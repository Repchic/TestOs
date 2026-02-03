export interface Window {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  data?: any;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<any>;
  category: 'productivity' | 'creative' | 'utility' | 'system';
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  size?: number;
  created: Date;
  modified: Date;
  isDeleted?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  appId?: string;
}
