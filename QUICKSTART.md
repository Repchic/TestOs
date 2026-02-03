# Quick Start Guide

Get Web OS up and running in 3 minutes!

## 🚀 Installation

```bash
# Clone the repository (if from GitHub)
git clone https://github.com/yourusername/web-os.git
cd web-os

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎯 Basic Usage

### Opening Applications
1. Click any icon in the dock at the bottom
2. Or press `Cmd/Ctrl + Space` and search for an app

### Window Management
- **Move:** Click and drag the window title bar
- **Resize:** Drag the bottom-right corner
- **Minimize:** Click the yellow button (window disappears to dock)
- **Maximize:** Click the green button (fills screen)
- **Close:** Click the red button

### File System
1. Click the **Finder** (📁) icon in the dock
2. Create folders and files using the buttons
3. Double-click files to open them in Text Editor
4. Delete items to send them to Trash
5. Access Trash by clicking the 🗑️ icon in the dock

### Text Editing
1. Open **Text Editor** from the dock
2. Select a programming language from the dropdown
3. Start coding! Auto-save is enabled
4. Adjust font size with +/- buttons

### Drawing
1. Open **Paint** application
2. Select a tool (brush, shapes, etc.)
3. Pick a color
4. Draw on the canvas
5. Use Undo/Redo as needed
6. Export your creation as PNG

### Taking Notes
1. Open **Notes** app
2. Click "New Note"
3. Edit title and content
4. Click "Done" when finished
5. Notes auto-save to browser storage

### Calculator
1. Open **Calculator**
2. Click numbers and operations
3. Press = for result
4. Use C to clear

### Browsing
1. Open **Browser**
2. Type a URL in the address bar
3. Click Go or press Enter
4. Add bookmarks with the ⭐ button

### Customization
1. Open **Settings**
2. Toggle Dark Mode
3. Choose a wallpaper
4. Changes apply immediately!

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + Space` - Open Spotlight search
- `Esc` - Close Spotlight
- `Arrow Keys` - Navigate in Spotlight
- `Enter` - Select in Spotlight

## 🛠️ Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview the build locally
npm run preview
```

## 🌐 Deploy to Vercel (1 minute!)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and get your HTTPS link!
```

Your Web OS will be live at `https://your-project.vercel.app` with automatic HTTPS!

## 📱 Testing on Mobile

Web OS is responsive! Open it on your phone or tablet:
1. Deploy to Vercel or another host
2. Open the link on your mobile device
3. Add to home screen for app-like experience

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill the process on port 5173
kill -9 $(lsof -t -i:5173)

# Or specify a different port
npm run dev -- --port 3000
```

### Dependencies installation fails
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build errors
```bash
# Check TypeScript errors
npm run build

# If you see errors, check the console output
# Most errors are type-related and can be fixed by updating types
```

## 🎨 Customization Tips

### Adding Your Own Wallpaper
Edit `src/apps/SettingsApp.tsx` and add to the wallpapers array:
```typescript
const wallpapers = [
  { name: 'My Wallpaper', value: 'linear-gradient(135deg, #your-colors)' },
  // ... existing wallpapers
];
```

### Creating a New App
1. Create a new file in `src/apps/YourApp.tsx`
2. Export a React component
3. Register it in `src/apps/index.tsx`
4. Add to the apps array with an icon and category

### Changing Theme Colors
Edit `tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
}
```

## 📚 Learn More

- [Full Feature List](FEATURES.md) - Complete list of all features
- [Deployment Guide](DEPLOYMENT.md) - Deploy to various platforms
- [README](README.md) - Comprehensive documentation

## 🆘 Need Help?

- Check the browser console for errors (F12)
- Review the README for more details
- Check FEATURES.md for feature documentation

## 🎉 You're All Set!

Enjoy your Web OS experience! Happy computing! 🚀

---

**Pro Tips:**
- Right-click in File Manager to select files
- Keep Spotlight open for quick app switching
- Use Dark Mode for nighttime coding
- Create folders to organize your files
- Try the Terminal commands for fun!
