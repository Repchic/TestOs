import { useStore } from '../store';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

export default function MenuBar() {
  const { isDarkMode, toggleSpotlight } = useStore();
  const [time, setTime] = useState(dayjs().format('ddd MMM D  h:mm A'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format('ddd MMM D  h:mm A'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpotlightClick = () => {
    toggleSpotlight();
  };

  return (
    <div className={`fixed top-0 left-0 right-0 h-7 ${isDarkMode ? 'glass-dark' : 'glass'} flex items-center justify-between px-4 text-sm z-50 border-b ${isDarkMode ? 'border-gray-700' : 'border-white/20'}`}>
      <div className="flex items-center gap-4">
        <div className="font-semibold">🍎</div>
        <span className="font-medium">Web OS</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleSpotlightClick}
          className="hover:bg-white/10 px-2 py-0.5 rounded transition-colors"
          title="Spotlight (⌘Space)"
        >
          🔍
        </button>
        <div className="flex items-center gap-2">
          <span title="Battery">🔋 100%</span>
          <span title="WiFi">📶</span>
          <span title="Volume">🔊</span>
        </div>
        <span className="font-medium">{time}</span>
      </div>
    </div>
  );
}
