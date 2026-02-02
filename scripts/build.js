const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { execSync } = require('child_process');

// Configuration
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'blog');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Ensure dist directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Clean dist directory
function cleanDist() {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
    }
    ensureDir(DIST_DIR);
    ensureDir(path.join(DIST_DIR, 'blog'));
}

// Simple template engine
function renderTemplate(template, data) {
    let html = template;
    
    // Handle conditional blocks {{#if condition}}...{{/if}} first
    // This needs to happen before simple replacements to avoid conflicts
    html = html.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
        return data[condition] ? content : '';
    });
    
    // Replace simple placeholders {{key}}
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        html = html.replace(regex, String(data[key] || ''));
    });
    
    return html;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Read and parse blog posts
function getBlogPosts() {
    if (!fs.existsSync(CONTENT_DIR)) {
        return [];
    }
    
    const files = fs.readdirSync(CONTENT_DIR)
        .filter(file => file.endsWith('.md'));
    
    const posts = files.map(file => {
        const filePath = path.join(CONTENT_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        const slug = path.basename(file, '.md');
        
        return {
            slug,
            title: data.title || 'Untitled',
            date: data.date || new Date().toISOString().split('T')[0],
            dateFormatted: formatDate(data.date || new Date().toISOString()),
            dateISO: data.date || new Date().toISOString().split('T')[0],
            content: marked(content),
            rawContent: content
        };
    });
    
    // Sort by date, newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return posts;
}

// Generate blog post pages
function generateBlogPosts(posts) {
    const template = fs.readFileSync(
        path.join(TEMPLATES_DIR, 'blog-post.html'), 
        'utf-8'
    );
    
    posts.forEach(post => {
        const html = renderTemplate(template, {
            title: post.title,
            date: post.dateFormatted,
            dateISO: post.dateISO,
            content: post.content
        });
        
        const outputPath = path.join(DIST_DIR, 'blog', `${post.slug}.html`);
        fs.writeFileSync(outputPath, html);
    });
}

// Generate blog index
function generateBlogIndex(posts) {
    const template = fs.readFileSync(
        path.join(TEMPLATES_DIR, 'blog-index.html'), 
        'utf-8'
    );
    
    let postsHtml = '';
    
    if (posts.length > 0) {
        postsHtml = posts.map(post => {
            // Get excerpt (first 150 characters of raw content)
            const excerpt = post.rawContent.substring(0, 150).replace(/\n/g, ' ').trim();
            const excerptWithEllipsis = post.rawContent.length > 150 ? excerpt + '...' : excerpt;
            
            return `
                <article class="border-l-2 border-metal-red pl-8 pb-12 hover:border-white transition">
                    <time class="text-metal-silver text-xs uppercase tracking-widest mb-3 block" datetime="${post.dateISO}">${post.dateFormatted}</time>
                    <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        <a href="${post.slug}.html" class="text-white hover:text-metal-red transition">
                            ${post.title}
                        </a>
                    </h2>
                    <p class="text-metal-silver text-lg mb-6 leading-relaxed">${excerptWithEllipsis}</p>
                    <a href="${post.slug}.html" class="text-metal-red hover:text-white transition uppercase tracking-wide text-sm font-bold">
                        Read Full Post →
                    </a>
                </article>
            `;
        }).join('');
    }
    
    const html = renderTemplate(template, {
        posts: postsHtml,
        noPosts: posts.length === 0
    });
    
    fs.writeFileSync(path.join(DIST_DIR, 'blog', 'index.html'), html);
}

// Generate static pages
function generateStaticPages() {
    const pages = [
        { template: 'index.html', output: 'index.html' },
        { template: 'projects.html', output: 'projects.html' },
        { template: 'contact.html', output: 'contact.html' }
    ];
    
    pages.forEach(page => {
        const templatePath = path.join(TEMPLATES_DIR, page.template);
        const template = fs.readFileSync(templatePath, 'utf-8');
        const outputPath = path.join(DIST_DIR, page.output);
        fs.writeFileSync(outputPath, template);
    });
}

// Copy public assets
function copyPublicAssets() {
    if (fs.existsSync(PUBLIC_DIR)) {
        const files = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });
        
        files.forEach(file => {
            const srcPath = path.join(PUBLIC_DIR, file.name);
            const destPath = path.join(DIST_DIR, file.name);
            
            if (file.isDirectory()) {
                // Recursively copy directories
                if (!fs.existsSync(destPath)) {
                    fs.mkdirSync(destPath, { recursive: true });
                }
                copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }
}

// Recursively copy directory
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src, { withFileTypes: true });
    
    files.forEach(file => {
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        
        if (file.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Compile Tailwind CSS
function compileCSS() {
    try {
        execSync('npx tailwindcss -i ./src/input.css -o ./dist/styles.css --minify', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        });
    } catch (error) {
        console.error('Error compiling CSS:', error.message);
        process.exit(1);
    }
}

// Main build function
function build() {
    console.log('Starting build...');
    
    // Clean dist directory
    console.log('Cleaning dist directory...');
    cleanDist();
    
    // Compile CSS
    console.log('Compiling Tailwind CSS...');
    compileCSS();
    
    // Get blog posts
    console.log('Reading blog posts...');
    const posts = getBlogPosts();
    console.log(`Found ${posts.length} blog post(s)`);
    
    // Generate blog posts
    if (posts.length > 0) {
        console.log('Generating blog post pages...');
        generateBlogPosts(posts);
    }
    
    // Generate blog index
    console.log('Generating blog index...');
    generateBlogIndex(posts);
    
    // Generate static pages
    console.log('Generating static pages...');
    generateStaticPages();
    
    // Copy public assets
    console.log('Copying public assets...');
    copyPublicAssets();
    
    console.log('Build complete!');
    console.log(`Output directory: ${DIST_DIR}`);
}

// Run build
build();
