// Blog post loading and rendering
async function loadBlogPosts() {
    const blogContainer = document.getElementById('blogPosts');
    
    try {
        // Fetch blog posts from JSON
        const response = await fetch('/blog-posts.json');
        
        if (!response.ok) {
            throw new Error('No blog posts found');
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            blogContainer.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <i class="fas fa-bookmark text-6xl text-slate-700 mb-4"></i>
                    <p class="text-slate-500 text-lg">No blog posts yet. Check back soon!</p>
                </div>
            `;
            return;
        }
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Render blog posts
        blogContainer.innerHTML = posts.map(post => createBlogCard(post)).join('');
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogContainer.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-bookmark text-6xl text-slate-700 mb-4"></i>
                <p class="text-slate-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
        `;
    }
}

function createBlogCard(post) {
    const date = new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const excerpt = post.body.substring(0, 150) + '...';
    const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    return `
        <article class="glass-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 card-hover group">
            ${post.image ? `
                <div class="h-48 overflow-hidden">
                    <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500">
                </div>
            ` : ''}
            <div class="p-6">
                <div class="flex items-center gap-4 mb-4 text-xs">
                    <span class="text-yellow-500 font-semibold uppercase tracking-wide">
                        <i class="far fa-calendar mr-1"></i> ${date}
                    </span>
                    ${post.category ? `
                        <span class="text-purple-400 font-semibold uppercase tracking-wide">
                            <i class="far fa-folder mr-1"></i> ${post.category}
                        </span>
                    ` : ''}
                </div>
                <h2 class="text-2xl font-serif font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    ${post.title}
                </h2>
                <p class="text-slate-400 mb-4 leading-relaxed">
                    ${excerpt}
                </p>
                <a href="post.html?slug=${slug}" class="inline-flex items-center text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                    Read More <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                </a>
            </div>
        </article>
    `;
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadBlogPosts);
