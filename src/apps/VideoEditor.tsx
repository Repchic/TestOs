import { useState } from 'react';
import { useStore } from '../store';

interface Clip {
  id: string;
  name: string;
  duration: number;
  start: number;
}

export default function VideoEditor() {
  const { isDarkMode } = useStore();
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const addClip = () => {
    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      name: `Clip ${clips.length + 1}`,
      duration: 5,
      start: clips.reduce((acc, c) => acc + c.duration, 0),
    };
    setClips([...clips, newClip]);
  };

  const deleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
  };

  const totalDuration = clips.reduce((acc, c) => acc + c.duration, 0);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <div className="text-2xl font-semibold mb-2">Video Preview</div>
          <div className="text-gray-500">
            {clips.length === 0 ? 'Add clips to the timeline to begin' : `${clips.length} clip${clips.length !== 1 ? 's' : ''} in timeline`}
          </div>
        </div>
      </div>

      <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => setCurrentTime(0)}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            ⏮ Reset
          </button>
          <div className="flex-1 flex items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{Math.floor(currentTime)}s</span>
            <input
              type="range"
              min="0"
              max={totalDuration || 100}
              value={currentTime}
              onChange={e => setCurrentTime(Number(e.target.value))}
              className="flex-1"
            />
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{Math.floor(totalDuration)}s</span>
          </div>
          <button
            onClick={addClip}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            ➕ Add Clip
          </button>
        </div>

        <div className={`rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4`}>
          <div className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>Timeline</div>
          {clips.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No clips in timeline. Click "Add Clip" to begin.
            </div>
          ) : (
            <div className="space-y-2">
              {clips.map(clip => (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClip(clip.id)}
                  className={`p-3 rounded flex items-center justify-between cursor-pointer transition-colors ${
                    selectedClip === clip.id
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-600 hover:bg-gray-500'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎞️</div>
                    <div>
                      <div className={`font-medium ${selectedClip === clip.id ? '' : isDarkMode ? 'text-white' : 'text-black'}`}>{clip.name}</div>
                      <div className={`text-sm opacity-70 ${selectedClip === clip.id ? '' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {clip.duration}s • Start: {clip.start}s
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteClip(clip.id);
                    }}
                    className={`px-3 py-1 rounded ${
                      selectedClip === clip.id
                        ? 'bg-white text-red-500'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-red-600 hover:text-white'
                        : 'bg-gray-200 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} p-4`}>
        <div className="flex items-center justify-between">
          <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
            <span className="font-semibold">Total Duration:</span> {Math.floor(totalDuration)}s
          </div>
          <button
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => alert('Export functionality would save the video here!')}
          >
            📤 Export Video
          </button>
        </div>
      </div>
    </div>
  );
}
