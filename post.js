// Get slug from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const postContent = document.getElementById('postContent');

async function loadPost() {
    if (!slug) {
        showError();
        return;
    }

    try {
        // Fetch all blog posts
        const response = await fetch('/blog-posts.json');
        
        if (!response.ok) {
            throw new Error('Failed to load blog posts');
        }
        
        const posts = await response.json();
        
        // Find the post with matching slug
        const post = posts.find(p => {
            const postSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return postSlug === slug || p.slug === slug;
        });
        
        if (!post) {
            throw new Error('Post not found');
        }
        
        // Display the post
        displayPost(post);
        
    } catch (error) {
        console.error('Error loading post:', error);
        showError();
    }
}

function displayPost(post) {
    // Hide loading, show content
    loadingState.classList.add('hidden');
    postContent.classList.remove('hidden');
    
    // Set page title
    document.getElementById('pageTitle').textContent = `${post.title} - EMS Chaplaincy`;
    
    // Set breadcrumb title
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title;
    }
    
    // Set post title
    document.getElementById('postTitle').textContent = post.title;
    
    // Set post meta
    const date = new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const metaHtml = `
        <span class="text-yellow-500 font-semibold uppercase tracking-wide">
            <i class="far fa-calendar mr-1"></i> ${date}
        </span>
        ${post.category ? `
            <span class="text-purple-400 font-semibold uppercase tracking-wide">
                <i class="far fa-folder mr-1"></i> ${post.category}
            </span>
        ` : ''}
        ${post.author ? `
            <span class="text-slate-400 font-semibold">
                <i class="far fa-user mr-1"></i> ${post.author}
            </span>
        ` : ''}
    `;
    document.getElementById('postMeta').innerHTML = metaHtml;
    
    // Set featured image if exists
    if (post.image) {
        document.getElementById('postImage').innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="w-full h-auto rounded-2xl shadow-2xl">
        `;
    }
    
    // Convert markdown to HTML and set post body
    const htmlContent = marked.parse(post.body);
    document.getElementById('postBody').innerHTML = htmlContent;
}

function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
}

// Share functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.getElementById('postTitle').textContent);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Load post when page loads
document.addEventListener('DOMContentLoaded', loadPost);
