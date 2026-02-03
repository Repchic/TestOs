import { useStore } from '../store';

export default function Notifications() {
  const { notifications, removeNotification, isDarkMode } = useStore();

  return (
    <div className="fixed top-10 right-4 z-[9998] space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${
            isDarkMode ? 'glass-dark' : 'glass'
          } rounded-lg shadow-lg p-4 w-80 animate-slide-in border ${
            isDarkMode ? 'border-gray-700' : 'border-white/20'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</div>
              <div className={`text-sm mt-1 opacity-80 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{notification.message}</div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={`transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
