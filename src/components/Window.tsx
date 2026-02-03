import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { Window as WindowType } from '../types';
import { getAppById } from '../apps';

interface Props {
  window: WindowType;
}

export default function Window({ window }: Props) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    updateWindowSize,
    isDarkMode,
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const app = getAppById(window.appId);
  const AppComponent = app?.component;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    focusWindow(window.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusWindow(window.id);
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.window.innerWidth - 200));
        const newY = Math.max(28, Math.min(e.clientY - dragOffset.y, globalThis.window.innerHeight - 100));
        updateWindowPosition(window.id, { x: newX, y: newY });
      } else if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
          const newWidth = Math.max(400, e.clientX - rect.left);
          const newHeight = Math.max(300, e.clientY - rect.top);
          updateWindowSize(window.id, { width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      globalThis.window.addEventListener('mousemove', handleMouseMove);
      globalThis.window.addEventListener('mouseup', handleMouseUp);
      return () => {
        globalThis.window.removeEventListener('mousemove', handleMouseMove);
        globalThis.window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, window.id, updateWindowPosition, updateWindowSize]);

  const style = window.isMaximized
    ? {
        position: 'fixed' as const,
        top: 28,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 28px - 5rem)',
        zIndex: window.zIndex,
      }
    : {
        position: 'fixed' as const,
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className={`window-shadow rounded-lg overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } flex flex-col ${window.isFocused ? 'opacity-100' : 'opacity-95'}`}
      style={style}
      onClick={() => focusWindow(window.id)}
    >
      <div
        className={`h-12 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        } flex items-center justify-between px-4 cursor-move border-b ${
          isDarkMode ? 'border-gray-600' : 'border-gray-200'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 window-controls">
          <button
            onClick={() => closeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            title="Close"
          />
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            title="Minimize"
          />
          <button
            onClick={() => maximizeWindow(window.id)}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            title="Maximize"
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm font-medium">
          {app?.icon && <span>{app.icon}</span>}
          <span>{window.title}</span>
        </div>
        
        <div className="w-12" />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {AppComponent && <AppComponent windowId={window.id} data={window.data} />}
      </div>
      
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
