# Musician Portfolio & Blog

A static portfolio and blog site built with Node.js, Tailwind CSS, and markdown. Perfect for hosting on GitHub Pages or any static hosting service.

## Features

- 🎨 Beautiful, responsive design with Tailwind CSS
- 📝 Blog posts written in markdown
- 🚀 Simple build process
- 📱 Mobile-friendly navigation
- 🎯 Ready for GitHub Pages deployment

## Project Structure

```
portfolio/
├── content/
│   └── blog/              # Markdown blog posts
├── templates/              # HTML templates
├── public/                # Static assets (images, etc.)
├── docs/                  # Built output (deploy this - GitHub Pages compatible)
├── scripts/
│   └── build.js           # Build script
└── src/
    └── input.css          # Tailwind CSS input
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create blog posts:**
   - Add markdown files to `content/blog/`
   - Each post should have frontmatter with `title` and `date`:
     ```markdown
     ---
     title: "My Blog Post"
     date: "2024-01-15"
     ---
     
     Your content here...
     ```

3. **Build the site:**
   ```bash
   npm run build
   ```

4. **Preview locally:**
   - The built site is in the `docs/` directory
   - You can use any static file server, for example:
     ```bash
     cd docs
     python -m http.server 8000
     ```
     Then visit `http://localhost:8000`

## Build Commands

- `npm run build` - Build the entire site (generates HTML and compiles CSS)
- `npm run build:css` - Compile Tailwind CSS only
- `npm run dev` - Watch mode for CSS development (watches and recompiles CSS)

## Customization

### Styling

- Edit `src/input.css` to add custom Tailwind directives
- Modify `tailwind.config.js` to customize the Tailwind theme
- Update templates in `templates/` to change the design

### Pages

- **Landing Page**: `templates/index.html`
- **Blog Index**: `templates/blog-index.html`
- **Blog Post**: `templates/blog-post.html`
- **Projects**: `templates/projects.html`
- **Contact**: `templates/mailto:string.slinger@outlook.com`

### Content

- Add images to `public/` directory (they'll be copied to `docs/` during build)
- Update placeholder content in the template files
- Customize the navigation links in each template

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Set source to "Deploy from a branch"
4. Select the branch: **main** and folder: **/docs**
5. Click Save and wait 1-2 minutes
6. Your site will be live at `https://username.github.io/repository-name/`

### Other Static Hosts

Simply upload the contents of the `docs/` directory to your hosting service:
- Netlify
- Vercel
- AWS S3
- Any static file hosting

## Development Workflow

1. Write blog posts in `content/blog/` as markdown files
2. Customize templates in `templates/` as needed
3. Add images/assets to `public/`
4. Run `npm run build` to generate the site
5. Preview the `docs/` folder locally
6. Commit and push - GitHub Pages will automatically deploy from `docs/`

## Blog Post Format

Each blog post should be a markdown file with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
---

Your blog post content in markdown format.

You can use all standard markdown features:
- Lists
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- And more!
```

## License

MIT
