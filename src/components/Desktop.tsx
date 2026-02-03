import { useStore } from '../store';

export default function Desktop() {
  const { currentWallpaper } = useStore();

  return (
    <div
      className="w-full h-full fixed inset-0 -z-10"
      style={{ background: currentWallpaper }}
    />
  );
}
