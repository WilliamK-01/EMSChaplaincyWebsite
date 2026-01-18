const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'content', 'posts');
const outputFile = path.join(__dirname, 'blog-posts.json');

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify([]));
    console.log('No blog posts found. Created empty blog-posts.json');
    process.exit(0);
}

// Read all markdown files
const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

const posts = files
    .map(filename => {
        const filePath = path.join(contentDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Skip drafts
        if (data.draft === true) {
            return null;
        }

        // Normalize slug from filename
        const slug = filename.replace(/\.md$/i, '');

        return {
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString(),
            // Map featured_image to image for existing UI
            image: data.featured_image || data.image || null,
            description: data.description || null,
            tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
            category: data.category || null,
            author: data.author || 'EMS Chaplaincy Team',
            body: content,
            slug
        };
    })
    .filter(Boolean);

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated blog-posts.json with ${posts.length} post(s)`);
