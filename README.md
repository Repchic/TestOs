# Web OS - macOS-Inspired Full-Featured Operating System

A fully functional web-based operating system inspired by macOS design principles, built with React, TypeScript, and modern web technologies.

## 🎯 Features

### Core Desktop Environment
- **Beautiful Desktop**: Clean interface with customizable wallpapers
- **Dynamic Dock**: macOS-style dock with app indicators and hover effects
- **Menu Bar**: System information (time, battery, WiFi, volume)
- **Spotlight Search**: Quick app launcher (⌘ + Space)
- **Window Management**: Full drag, resize, minimize, maximize functionality
- **Notifications**: Toast notifications with auto-dismiss
- **Dark Mode**: Complete dark/light theme support

### Pre-bundled Applications

#### 1. **Text Editor** 📝
- Monaco Editor integration with syntax highlighting
- Multiple language support (JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown)
- Line numbers and word wrap
- Adjustable font size
- Auto-save to virtual file system
- Multiple tabs via window management

#### 2. **File Manager (Finder)** 📁
- Complete directory tree navigation
- Create/delete/rename files and folders
- Grid and list view modes
- Breadcrumb navigation
- Trash with restore capability
- File preview integration
- Search within directories

#### 3. **Paint Application** 🎨
- Drawing canvas with multiple tools (brush, eraser, shapes)
- Color picker and brush size adjustment
- Rectangle, circle, and line tools
- Undo/Redo functionality
- Export as PNG
- Clean, intuitive interface

#### 4. **Video Editor** 🎬
- Timeline-based editing interface
- Add and remove clips
- Playback controls
- Timeline scrubbing
- Export functionality
- Duration management

#### 5. **Web Browser** 🌐
- Basic web browsing with iframe embedding
- Bookmarks management
- Navigation history (back/forward)
- Address bar with URL validation
- Quick access to popular sites

#### 6. **Calculator** 🔢
- Scientific calculator
- Standard operations (+, -, ×, ÷, %)
- Beautiful macOS-style design
- Keyboard support

#### 7. **Notes App** 📔
- Rich text editing
- Create/edit/delete notes
- Auto-save functionality
- Sidebar navigation
- Timestamps for created/modified dates

#### 8. **Settings** ⚙️
- Dark/Light mode toggle
- Wallpaper selection (6 beautiful gradients)
- System information display
- About section

#### 9. **Clock** 🕐
- World clock (6 major cities)
- Timer with quick presets
- Stopwatch
- Clean, readable interface

#### 10. **Preview** 👁️
- Image viewer
- Rotate and zoom controls
- File upload support
- Clean viewing experience

#### 11. **Terminal** ⌨️
- Command-line emulator
- Built-in commands: help, clear, echo, date, ls, pwd, whoami, uname, cat, calc
- Command history (arrow keys)
- Classic green-on-black terminal aesthetic

#### 12. **Maps** 🗺️
- Interactive map viewer
- Location search
- Popular locations quick access
- OpenStreetMap integration

## 🛠️ Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Monaco Editor** - Code editor component
- **Day.js** - Date/time utilities
- **IndexedDB/LocalStorage** - Data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Quick Deploy (1 Minute)

Deploy to Vercel with one command:

```bash
npm install -g vercel
vercel
```

Your Web OS will be live with HTTPS at `https://your-project.vercel.app`!

See [DEPLOYMENT.md](DEPLOYMENT.md) for other hosting options.

## 🎨 Design Philosophy

- **macOS Sonoma/Ventura inspired**: Modern Apple design language
- **Glassmorphism**: Beautiful backdrop blur effects
- **Smooth animations**: 60fps transitions throughout
- **Accessibility**: Keyboard navigation and focus management
- **Responsive**: Works on different screen sizes
- **Performance**: Optimized rendering and state management

## ⌨️ Keyboard Shortcuts

- `⌘ + Space` or `Ctrl + Space` - Open Spotlight search
- Window controls respond to standard close/minimize/maximize buttons
- Terminal supports command history with arrow keys
- All inputs support standard keyboard navigation

## 💾 Data Persistence

- **File System**: Stored in Zustand state (can be extended with IndexedDB)
- **Notes**: LocalStorage persistence
- **Settings**: State-based (wallpaper, theme)
- **Window positions**: Session-based

## 🌐 Deployment

This project is ready for deployment to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- Any static hosting service

Simply run `npm run build` and deploy the `dist` folder.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## 📁 Project Structure

```
src/
├── apps/              # Individual applications
│   ├── TextEditor.tsx
│   ├── FileManager.tsx
│   ├── PaintApp.tsx
│   ├── Calculator.tsx
│   ├── NotesApp.tsx
│   ├── SettingsApp.tsx
│   ├── ClockApp.tsx
│   ├── BrowserApp.tsx
│   ├── VideoEditor.tsx
│   ├── PreviewApp.tsx
│   ├── Terminal.tsx
│   ├── MapsApp.tsx
│   └── index.tsx      # App registry
├── components/        # UI components
│   ├── Desktop.tsx
│   ├── MenuBar.tsx
│   ├── Dock.tsx
│   ├── Window.tsx
│   ├── WindowManager.tsx
│   ├── Spotlight.tsx
│   └── Notifications.tsx
├── store.ts          # Zustand state management
├── types.ts          # TypeScript types
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## 🎯 Key Features Implemented

✅ All 12 core applications fully functional  
✅ Desktop environment with window management  
✅ macOS-inspired design language  
✅ Smooth animations and transitions  
✅ Dark mode support  
✅ Spotlight search  
✅ Notification system  
✅ File system with trash  
✅ Data persistence  
✅ Responsive design  
✅ Keyboard shortcuts  
✅ Beautiful glassmorphism effects  

## 🔮 Future Enhancements

- Multi-desktop/Spaces support
- More file type support in File Manager
- Enhanced video editing with filters
- Email client functionality
- Advanced terminal commands
- Plugin/extension system
- Cloud sync capabilities
- Touch gesture support
- Screen recording
- More themes and customization

## 📝 License

MIT License - feel free to use this project for learning or as a foundation for your own Web OS!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🙏 Acknowledgments

- Inspired by macOS design
- Built with modern web technologies
- Community-driven development

---

**Built with ❤️ using React + TypeScript + Vite**

**Live Demo**: Deploy to Vercel/Netlify for instant HTTPS access!
