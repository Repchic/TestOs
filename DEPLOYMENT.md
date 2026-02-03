# Deployment Guide

This guide will help you deploy Web OS to various platforms with HTTPS support.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel provides automatic HTTPS and is the easiest way to deploy.

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your site will be live with HTTPS!

### Option 2: Deploy via GitHub

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the settings and deploy
6. Your site will be live with a vercel.app domain (HTTPS enabled)

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-os)

## 🌐 Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

Or use Netlify's web interface:
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

## 📦 Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install -g gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Update vite.config.ts to include base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

4. Deploy:
```bash
npm run deploy
```

5. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: gh-pages branch
   - Save

Note: GitHub Pages provides HTTPS for *.github.io domains.

## 🐳 Deploy with Docker

1. Create a Dockerfile:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create nginx.conf:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Build and run:
```bash
docker build -t web-os .
docker run -p 80:80 web-os
```

For HTTPS with Docker, use a reverse proxy like Caddy or Traefik.

## 🔒 HTTPS Configuration

### Vercel & Netlify
- Automatic HTTPS with free SSL certificates
- Custom domains supported with automatic SSL

### Self-Hosted with Caddy (Easiest)
```
your-domain.com {
    reverse_proxy localhost:3000
}
```
Caddy automatically provisions and renews SSL certificates!

### Self-Hosted with Nginx + Let's Encrypt

1. Install certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Get certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

3. Certbot will automatically configure nginx for HTTPS

### Self-Hosted with Apache + Let's Encrypt

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com
```

## 🌍 Custom Domain Setup

### Vercel
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. HTTPS is automatically configured

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. HTTPS is automatically configured

## 📊 Performance Optimization

Before deploying, ensure optimal performance:

1. Build with optimizations:
```bash
npm run build
```

2. Test the production build locally:
```bash
npm run preview
```

3. Check bundle size:
```bash
npm run build -- --mode production
```

## 🔍 Post-Deployment Checklist

- [ ] Test all applications (Text Editor, Paint, Calculator, etc.)
- [ ] Verify dark/light mode switching
- [ ] Test Spotlight search (Cmd/Ctrl + Space)
- [ ] Check window management (drag, resize, minimize, maximize)
- [ ] Test file system operations
- [ ] Verify mobile responsiveness
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Test keyboard shortcuts
- [ ] Verify HTTPS is working
- [ ] Check console for errors

## 🆘 Troubleshooting

### Build fails with TypeScript errors
```bash
npm run build -- --mode development
```

### Monaco Editor not loading
Ensure the base path is set correctly in vite.config.ts

### 404 on page refresh
Make sure your hosting platform is configured for SPA routing:
- Vercel: Uses vercel.json (already included)
- Netlify: Create _redirects file: `/* /index.html 200`
- GitHub Pages: May need additional configuration

### Slow initial load
- Enable gzip compression on your server
- Consider code splitting
- Use a CDN for static assets

## 📝 Environment Variables

If you need environment variables:

1. Create `.env` file:
```env
VITE_API_URL=https://api.example.com
```

2. Use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. Configure on hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

## 🎉 You're Done!

Your Web OS should now be live with HTTPS! Share your link and enjoy!

Example URL formats:
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`
- Custom: `https://your-domain.com`
