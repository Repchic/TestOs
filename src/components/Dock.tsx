import { useState } from 'react';
import { useStore } from '../store';
import { apps } from '../apps';

export default function Dock() {
  const { openWindow, windows, isDarkMode } = useStore();
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const handleAppClick = (appId: string, appName: string) => {
    openWindow(appId, appName);
  };

  const isAppOpen = (appId: string) => {
    return windows.some(w => w.appId === appId && !w.isMinimized);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className={`${isDarkMode ? 'glass-dark' : 'glass'} dock-shadow rounded-2xl px-3 py-2 border ${isDarkMode ? 'border-gray-700' : 'border-white/20'}`}>
        <div className="flex items-end gap-2">
          {apps.map((app) => (
            <div
              key={app.id}
              className="relative group"
              onMouseEnter={() => setHoveredApp(app.id)}
              onMouseLeave={() => setHoveredApp(null)}
            >
              <button
                onClick={() => handleAppClick(app.id, app.name)}
                className="w-14 h-14 flex items-center justify-center text-4xl rounded-xl transition-all duration-200 ease-out hover:scale-125 hover:-translate-y-2 active:scale-110"
                style={{
                  transform: hoveredApp === app.id ? 'scale(1.25) translateY(-8px)' : undefined,
                }}
                title={app.name}
              >
                {app.icon}
              </button>
              {isAppOpen(app.id) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
              )}
              {hoveredApp === app.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                  {app.name}
                </div>
              )}
            </div>
          ))}
          
          <div className="w-px h-12 bg-gray-400/30 mx-1" />
          
          <div
            className="relative group"
            onMouseEnter={() => setHoveredApp('trash')}
            onMouseLeave={() => setHoveredApp(null)}
          >
            <button
              onClick={() => openWindow('finder', 'Trash', { viewTrash: true })}
              className="w-14 h-14 flex items-center justify-center text-4xl rounded-xl transition-all duration-200 ease-out hover:scale-125 hover:-translate-y-2 active:scale-110"
              style={{
                transform: hoveredApp === 'trash' ? 'scale(1.25) translateY(-8px)' : undefined,
              }}
              title="Trash"
            >
              🗑️
            </button>
            {hoveredApp === 'trash' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                Trash
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
