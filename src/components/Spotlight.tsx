import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { apps } from '../apps';

export default function Spotlight() {
  const { showSpotlight, toggleSpotlight, openWindow, isDarkMode } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (showSpotlight) {
      setQuery('');
      setSelectedIndex(0);
      inputRef.current?.focus();
    }
  }, [showSpotlight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        toggleSpotlight();
      }
      
      if (showSpotlight) {
        if (e.key === 'Escape') {
          toggleSpotlight();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredApps.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredApps.length > 0) {
          const app = filteredApps[selectedIndex];
          openWindow(app.id, app.name);
          toggleSpotlight();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSpotlight, filteredApps, selectedIndex, openWindow, toggleSpotlight]);

  if (!showSpotlight) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-start justify-center pt-32"
      onClick={toggleSpotlight}
    >
      <div
        className={`w-full max-w-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-2xl overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search applications..."
            className={`w-full px-4 py-3 text-lg outline-none ${
              isDarkMode
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            } rounded-lg`}
          />
        </div>
        
        {filteredApps.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? isDarkMode
                      ? 'bg-blue-600'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  openWindow(app.id, app.name);
                  toggleSpotlight();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="text-3xl">{app.icon}</span>
                <div>
                  <div className={`font-medium ${index === selectedIndex ? 'text-white' : isDarkMode ? 'text-white' : 'text-black'}`}>{app.name}</div>
                  <div className={`text-sm ${index === selectedIndex ? 'text-white/80' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {app.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {query && filteredApps.length === 0 && (
          <div className={`px-4 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No applications found
          </div>
        )}
      </div>
    </div>
  );
}
