const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'content', 'blog');
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

const posts = files.map(filename => {
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    return {
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        image: data.image || null,
        category: data.category || null,
        author: data.author || 'EMS Chaplaincy Team',
        body: content,
        slug: filename.replace('.md', '')
    };
});

// Write to JSON file
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated blog-posts.json with ${posts.length} post(s)`);
