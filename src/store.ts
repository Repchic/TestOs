import { create } from 'zustand';
import { Window, FileSystemNode, NotificationItem } from './types';

const FILE_SYSTEM_STORAGE_KEY = 'webos-filesystem';

// Serialize file system for localStorage (convert Date objects to ISO strings)
const serializeFileSystem = (fileSystem: FileSystemNode[]): string => {
  return JSON.stringify(fileSystem.map(node => ({
    ...node,
    created: node.created.toISOString(),
    modified: node.modified.toISOString(),
  })));
};

// Deserialize file system from localStorage (convert ISO strings back to Date objects)
const deserializeFileSystem = (serialized: string): FileSystemNode[] => {
  try {
    return JSON.parse(serialized).map((node: any) => ({
      ...node,
      created: new Date(node.created),
      modified: new Date(node.modified),
    }));
  } catch (error) {
    console.warn('Failed to deserialize file system from localStorage:', error);
    return createDefaultFileSystem();
  }
};

// Load file system from localStorage or return default
const loadFileSystem = (): FileSystemNode[] => {
  try {
    const saved = localStorage.getItem(FILE_SYSTEM_STORAGE_KEY);
    if (saved) {
      return deserializeFileSystem(saved);
    }
  } catch (error) {
    console.warn('Failed to load file system from localStorage:', error);
  }
  return createDefaultFileSystem();
};

// Save file system to localStorage
const saveFileSystem = (fileSystem: FileSystemNode[]) => {
  try {
    localStorage.setItem(FILE_SYSTEM_STORAGE_KEY, serializeFileSystem(fileSystem));
  } catch (error) {
    console.warn('Failed to save file system to localStorage:', error);
  }
};

interface OSState {
  windows: Window[];
  nextZIndex: number;
  isDarkMode: boolean;
  showSpotlight: boolean;
  fileSystem: FileSystemNode[];
  notifications: NotificationItem[];
  currentWallpaper: string;
  
  openWindow: (appId: string, title: string, data?: any) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
  updateWindowData: (windowId: string, data: any) => void;
  
  toggleDarkMode: () => void;
  toggleSpotlight: () => void;
  
  createFile: (name: string, type: 'file' | 'folder', parentId: string | null, content?: string) => string;
  updateFile: (id: string, updates: Partial<FileSystemNode>) => void;
  deleteFile: (id: string) => void;
  restoreFile: (id: string) => void;
  
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  
  setWallpaper: (wallpaper: string) => void;
}

const defaultWallpaper = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

const createDefaultFileSystem = (): FileSystemNode[] => {
  const now = new Date();
  return [
    {
      id: 'root',
      name: 'Root',
      type: 'folder',
      parentId: null,
      created: now,
      modified: now,
    },
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      parentId: 'root',
      created: now,
      modified: now,
    },
    {
      id: 'downloads',
      name: 'Downloads',
      type: 'folder',
      parentId: 'root',
      created: now,
      modified: now,
    },
    {
      id: 'pictures',
      name: 'Pictures',
      type: 'folder',
      parentId: 'root',
      created: now,
      modified: now,
    },
    {
      id: 'trash',
      name: 'Trash',
      type: 'folder',
      parentId: null,
      created: now,
      modified: now,
    },
  ];
};

export const useStore = create<OSState>((set, get) => ({
  windows: [],
  nextZIndex: 1000,
  isDarkMode: false,
  showSpotlight: false,
  fileSystem: loadFileSystem(),
  notifications: [],
  currentWallpaper: defaultWallpaper,
  
  openWindow: (appId, title, data) => {
    const existingWindow = get().windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      get().focusWindow(existingWindow.id);
      return;
    }
    
    const minimizedWindow = get().windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
      set(state => ({
        windows: state.windows.map(w =>
          w.id === minimizedWindow.id
            ? { ...w, isMinimized: false, isFocused: true, zIndex: state.nextZIndex }
            : { ...w, isFocused: false }
        ),
        nextZIndex: state.nextZIndex + 1,
      }));
      return;
    }
    
    const windowId = `${appId}-${Date.now()}`;
    const centerX = (window.innerWidth - 800) / 2;
    const centerY = (window.innerHeight - 600) / 2;
    
    const newWindow: Window = {
      id: windowId,
      appId,
      title,
      position: { x: Math.max(50, centerX), y: Math.max(50, centerY) },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: get().nextZIndex,
      data,
    };
    
    set(state => ({
      windows: state.windows.map(w => ({ ...w, isFocused: false })).concat(newWindow),
      nextZIndex: state.nextZIndex + 1,
    }));
  },
  
  closeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.filter(w => w.id !== windowId),
    }));
  },
  
  focusWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId
          ? { ...w, isFocused: true, zIndex: state.nextZIndex }
          : { ...w, isFocused: false }
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },
  
  minimizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, isMinimized: true, isFocused: false } : w
      ),
    }));
  },
  
  maximizeWindow: (windowId) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    }));
  },
  
  updateWindowPosition: (windowId, position) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, position } : w
      ),
    }));
  },
  
  updateWindowSize: (windowId, size) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, size } : w
      ),
    }));
  },
  
  updateWindowData: (windowId, data) => {
    set(state => ({
      windows: state.windows.map(w =>
        w.id === windowId ? { ...w, data } : w
      ),
    }));
  },
  
  toggleDarkMode: () => {
    set(state => ({ isDarkMode: !state.isDarkMode }));
  },
  
  toggleSpotlight: () => {
    set(state => ({ showSpotlight: !state.showSpotlight }));
  },
  
  createFile: (name, type, parentId, content) => {
    const now = new Date();
    const newFile: FileSystemNode = {
      id: `file-${Date.now()}-${Math.random()}`,
      name,
      type,
      parentId,
      content,
      size: content ? content.length : 0,
      created: now,
      modified: now,
    };
    set(state => {
      const newFileSystem = [...state.fileSystem, newFile];
      saveFileSystem(newFileSystem);
      return { fileSystem: newFileSystem };
    });
    return newFile.id;
  },
  
  updateFile: (id, updates) => {
    set(state => {
      const newFileSystem = state.fileSystem.map(f =>
        f.id === id ? { ...f, ...updates, modified: new Date() } : f
      );
      saveFileSystem(newFileSystem);
      return { fileSystem: newFileSystem };
    });
  },
  
  deleteFile: (id) => {
    set(state => {
      const newFileSystem = state.fileSystem.map(f =>
        f.id === id ? { ...f, isDeleted: true, parentId: 'trash' } : f
      );
      saveFileSystem(newFileSystem);
      return { fileSystem: newFileSystem };
    });
  },
  
  restoreFile: (id) => {
    set(state => {
      const newFileSystem = state.fileSystem.map(f =>
        f.id === id ? { ...f, isDeleted: false, parentId: 'root' } : f
      );
      saveFileSystem(newFileSystem);
      return { fileSystem: newFileSystem };
    });
  },
  
  addNotification: (notification) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
    };
    set(state => ({
      notifications: [...state.notifications, newNotification],
    }));
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },
  
  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
  
  setWallpaper: (wallpaper) => {
    set({ currentWallpaper: wallpaper });
  },
}));
