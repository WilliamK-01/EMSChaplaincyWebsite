# Contact Form Setup with Resend API

The contact form uses Cloudflare Pages Functions with Resend API for email delivery.

## Setup Instructions

### 1. Get Resend API Key

1. Go to https://resend.com and sign up for a free account
2. Navigate to API Keys in the dashboard
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Cloudflare Environment Variables

1. Go to your Cloudflare Pages dashboard
2. Select your `emschaplaincy` project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production**:
   - `RESEND_API_KEY` = `re_your_api_key_here`
   - `CONTACT_EMAIL` = `ems.chaplaincy@gmail.com` (or your preferred email)

5. Click **Save**

### 3. Verify Your Domain (Optional but Recommended)

By default, Resend uses `onboarding@resend.dev` as the sender. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `emschaplaincy.site`)
3. Add the DNS records they provide to your Cloudflare DNS
4. Wait for verification
5. Update line 71 in `/functions/api/contact.js`:
   ```javascript
   from: 'EMS Chaplaincy <contact@emschaplaincy.site>',
   ```

### 4. Deploy

After setting environment variables, redeploy your site:
- Commit and push your changes
- Cloudflare will automatically redeploy
- The contact form will now work!

## How It Works

1. User fills out contact form on website
2. Form submits to `/api/contact` (Cloudflare Pages Function)
3. Function validates the data
4. Function sends email via Resend API to `CONTACT_EMAIL`
5. User receives success/error message

## Testing

Test the form locally or after deployment:
- Fill out all required fields (name, email, message)
- Click "Send Message"
- You should receive an email at the configured `CONTACT_EMAIL`
- Check Resend dashboard for delivery logs

## Rate Limits

Resend free tier:
- 100 emails per day
- 3,000 emails per month

If you need more, upgrade your Resend plan.
