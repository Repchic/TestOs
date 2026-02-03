import { useEffect } from 'react';
import { useStore } from './store';
import Desktop from './components/Desktop';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import WindowManager from './components/WindowManager';
import Spotlight from './components/Spotlight';
import Notifications from './components/Notifications';

function App() {
  const { isDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="w-full h-full overflow-hidden">
      <Desktop />
      <MenuBar />
      <WindowManager />
      <Dock />
      <Spotlight />
      <Notifications />
    </div>
  );
}

export default App;
