import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';

type Tool = 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text';

export default function PaintApp() {
  const { isDarkMode } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      setHistoryStep(historyStep - 1);
      ctx.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      setHistoryStep(historyStep + 1);
      ctx.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'rectangle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'line') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const tools: { id: Tool; icon: string; label: string }[] = [
    { id: 'brush', icon: '🖌️', label: 'Brush' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
    { id: 'rectangle', icon: '▢', label: 'Rectangle' },
    { id: 'circle', icon: '○', label: 'Circle' },
    { id: 'line', icon: '/', label: 'Line' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {tools.map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-1 rounded ${
                  tool === t.id
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-200'
                }`}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-sm w-6">{brushSize}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyStep <= 0}
            className={`px-3 py-1 rounded ${
              historyStep <= 0
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            className={`px-3 py-1 rounded ${
              historyStep >= history.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
          >
            ↷ Redo
          </button>
          <button
            onClick={clearCanvas}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            🗑️ Clear
          </button>
          <button
            onClick={downloadImage}
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            💾 Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4 bg-gray-100 dark:bg-gray-900">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-white cursor-crosshair rounded shadow-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
    </div>
  );
}
