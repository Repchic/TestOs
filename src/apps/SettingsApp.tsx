import { useStore } from '../store';

export default function SettingsApp() {
  const { isDarkMode, toggleDarkMode, currentWallpaper, setWallpaper } = useStore();

  const wallpapers = [
    { name: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Ocean Blue', value: 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)' },
    { name: 'Rose', value: 'linear-gradient(135deg, #F857A6 0%, #FF5858 100%)' },
    { name: 'Northern Lights', value: 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)' },
  ];

  return (
    <div className={`h-full overflow-y-auto p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm opacity-70">Use dark theme throughout the system</div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Wallpaper</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {wallpapers.map(wp => (
              <button
                key={wp.name}
                onClick={() => setWallpaper(wp.value)}
                className={`aspect-video rounded-lg overflow-hidden border-4 transition-all ${
                  currentWallpaper === wp.value
                    ? 'border-blue-500 scale-95'
                    : 'border-transparent hover:scale-95'
                }`}
              >
                <div className="w-full h-full" style={{ background: wp.value }} />
                <div className={`text-center py-2 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {wp.name}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">System</h2>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-3`}>
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Platform</span>
              <span>Web OS</span>
            </div>
            <div className="flex justify-between">
              <span>Browser</span>
              <span>{navigator.userAgent.split(' ').slice(-1)[0]}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className="mb-2">
              Web OS is a fully-featured operating system built with React and TypeScript.
            </p>
            <p>
              Inspired by macOS design principles, it provides a beautiful and functional
              desktop experience directly in your browser.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
