import { App } from '../types';
import TextEditor from './TextEditor';
import FileManager from './FileManager';
import PaintApp from './PaintApp';
import Calculator from './Calculator';
import NotesApp from './NotesApp';
import SettingsApp from './SettingsApp';
import ClockApp from './ClockApp';
import BrowserApp from './BrowserApp';
import VideoEditor from './VideoEditor';
import PreviewApp from './PreviewApp';
import Terminal from './Terminal';
import MapsApp from './MapsApp';

export const apps: App[] = [
  {
    id: 'finder',
    name: 'Finder',
    icon: '📁',
    component: FileManager,
    category: 'system',
  },
  {
    id: 'text-editor',
    name: 'Text Editor',
    icon: '📝',
    component: TextEditor,
    category: 'productivity',
  },
  {
    id: 'paint',
    name: 'Paint',
    icon: '🎨',
    component: PaintApp,
    category: 'creative',
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    icon: '🎬',
    component: VideoEditor,
    category: 'creative',
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: '🌐',
    component: BrowserApp,
    category: 'productivity',
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🔢',
    component: Calculator,
    category: 'utility',
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📔',
    component: NotesApp,
    category: 'productivity',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    component: SettingsApp,
    category: 'system',
  },
  {
    id: 'clock',
    name: 'Clock',
    icon: '🕐',
    component: ClockApp,
    category: 'utility',
  },
  {
    id: 'preview',
    name: 'Preview',
    icon: '👁️',
    component: PreviewApp,
    category: 'utility',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '⌨️',
    component: Terminal,
    category: 'utility',
  },
  {
    id: 'maps',
    name: 'Maps',
    icon: '🗺️',
    component: MapsApp,
    category: 'utility',
  },
];

export function getAppById(id: string): App | undefined {
  return apps.find(app => app.id === id);
}
