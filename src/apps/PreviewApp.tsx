import { useState } from 'react';
import { useStore } from '../store';

export default function PreviewApp() {
  const { isDarkMode } = useStore();
  const [imageUrl, setImageUrl] = useState('');
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotate = (deg: number) => {
    setRotation((rotation + deg) % 360);
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            📁 Open Image
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {imageUrl && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => rotate(-90)}
                className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                ↶ Rotate Left
              </button>
              <button
                onClick={() => rotate(90)}
                className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                ↷ Rotate Right
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Zoom:</span>
              <input
                type="range"
                min="10"
                max="200"
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-32"
              />
              <span className={`text-sm w-12 ${isDarkMode ? 'text-white' : 'text-black'}`}>{zoom}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            style={{
              transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
              transition: 'transform 0.3s ease',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">🖼️</div>
            <div className="text-xl">No image selected</div>
            <div className="text-sm mt-2">Click "Open Image" to view a file</div>
          </div>
        )}
      </div>
    </div>
  );
}
