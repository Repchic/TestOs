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
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 });
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

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    focusWindow(window.id);
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
      top: window.position.y,
      left: window.position.x,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, globalThis.window.innerWidth - 200));
        const newY = Math.max(28, Math.min(e.clientY - dragOffset.y, globalThis.window.innerHeight - 100));
        updateWindowPosition(window.id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.left;
        let newY = resizeStart.top;

        // Handle horizontal resizing
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(400, resizeStart.width + deltaX);
        } else if (resizeDirection.includes('w')) {
          newWidth = Math.max(400, resizeStart.width - deltaX);
          if (newWidth > 400) {
            newX = resizeStart.left + deltaX;
          }
        }

        // Handle vertical resizing
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(300, resizeStart.height + deltaY);
        } else if (resizeDirection.includes('n')) {
          newHeight = Math.max(300, resizeStart.height - deltaY);
          if (newHeight > 300) {
            newY = resizeStart.top + deltaY;
          }
        }

        // Update window size and position
        updateWindowSize(window.id, { width: newWidth, height: newHeight });
        if (newX !== resizeStart.left || newY !== resizeStart.top) {
          updateWindowPosition(window.id, { x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isDragging || isResizing) {
      globalThis.window.addEventListener('mousemove', handleMouseMove);
      globalThis.window.addEventListener('mouseup', handleMouseUp);
      return () => {
        globalThis.window.removeEventListener('mousemove', handleMouseMove);
        globalThis.window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeDirection, resizeStart, dragOffset, window.id, updateWindowPosition, updateWindowSize]);

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
        
        <div className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {app?.icon && <span>{app.icon}</span>}
          <span>{window.title}</span>
        </div>
        
        <div className="w-12" />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {AppComponent && <AppComponent windowId={window.id} data={window.data} />}
      </div>
      
      {!window.isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
        </>
      )}
    </div>
  );
}
