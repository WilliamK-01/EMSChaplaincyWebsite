export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  // Enforce only the auth route
  if (url.pathname !== "/auth") {
    return new Response("Not found", { status: 404 });
  }

  // CORS for CMS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      }
    });
  }

  const redirectUri = `${url.origin}/auth`;

  // Step 1: no code, redirect to GitHub authorize
  const code = url.searchParams.get("code");
  if (!code) {
    const state = crypto.randomUUID();
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", "repo user:email");
    authorizeUrl.searchParams.set("state", state);

    return Response.redirect(authorizeUrl.toString(), 302);
  }

  // Step 2: exchange code for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    })
  });

  if (!tokenRes.ok) {
    return new Response("OAuth exchange failed", { status: 502 });
  }

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;

  if (!accessToken) {
    return new Response("No access token returned", { status: 500 });
  }

  // Decap CMS expects a small HTML that posts the token back to the opener
  const html = `<!doctype html><html><body><script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage('authorization:github:success:' + ${JSON.stringify("" + accessToken)} , '*');
        window.removeEventListener('message', receiveMessage, false);
        window.close();
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
