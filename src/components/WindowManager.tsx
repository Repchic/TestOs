import { useStore } from '../store';
import WindowComponent from './Window';

export default function WindowManager() {
  const { windows } = useStore();

  return (
    <>
      {windows
        .filter(w => !w.isMinimized)
        .map((window) => (
          <WindowComponent key={window.id} window={window} />
        ))}
    </>
  );
}
