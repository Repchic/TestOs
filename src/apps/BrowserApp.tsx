import { useState } from 'react';
import { useStore } from '../store';

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

export default function BrowserApp() {
  const { isDarkMode } = useStore();
  const [url, setUrl] = useState('https://example.com');
  const [currentUrl, setCurrentUrl] = useState('https://example.com');
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'Google', url: 'https://google.com' },
    { id: '2', title: 'GitHub', url: 'https://github.com' },
  ]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const navigate = (newUrl: string) => {
    const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    setCurrentUrl(fullUrl);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(fullUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
    }
  };

  const addBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: currentUrl.replace(/https?:\/\//, '').split('/')[0],
      url: currentUrl,
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className={`px-3 py-1 rounded ${
              historyIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
          >
            ←
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className={`px-3 py-1 rounded ${
              historyIndex === history.length - 1
                ? 'opacity-50 cursor-not-allowed'
                : isDarkMode
                ? 'hover:bg-gray-700'
                : 'hover:bg-gray-200'
            }`}
          >
            →
          </button>
          <button
            onClick={() => setCurrentUrl(currentUrl)}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            ↻
          </button>
          
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(url)}
              className={`flex-1 px-4 py-2 rounded-full border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-100 border-gray-300'
              } outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter URL..."
            />
            <button
              onClick={() => navigate(url)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Go
            </button>
          </div>
          
          <button
            onClick={addBookmark}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Add Bookmark"
          >
            ⭐
          </button>
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`px-3 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Bookmarks"
          >
            📚
          </button>
        </div>

        {showBookmarks && (
          <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Bookmarks</div>
            <div className="space-y-1">
              {bookmarks.map(bookmark => (
                <div
                  key={bookmark.id}
                  onClick={() => {
                    navigate(bookmark.url);
                    setShowBookmarks(false);
                  }}
                  className={`px-3 py-2 rounded cursor-pointer ${
                    isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>{bookmark.title}</div>
                  <div className={`text-xs opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{bookmark.url}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          title="Browser Content"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  );
}
