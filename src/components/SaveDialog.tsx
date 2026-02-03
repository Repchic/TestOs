import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { FileSystemNode } from '../types';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderId: string, fileName: string) => void;
  suggestedFileName: string;
  isDarkMode: boolean;
}

export default function SaveDialog({ isOpen, onClose, onSave, suggestedFileName, isDarkMode }: SaveDialogProps) {
  const { fileSystem } = useStore();
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [fileName, setFileName] = useState(suggestedFileName);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  const items = useMemo(() => {
    return fileSystem.filter(f => f.parentId === currentFolderId && !f.isDeleted && f.type === 'folder');
  }, [fileSystem, currentFolderId]);

  const breadcrumbs = useMemo(() => {
    const path: FileSystemNode[] = [];
    let current = fileSystem.find(f => f.id === currentFolderId);
    while (current) {
      path.unshift(current);
      const parentId = current.parentId;
      if (!parentId) break;
      current = fileSystem.find(f => f.id === parentId);
    }
    return path;
  }, [currentFolderId, fileSystem]);

  const checkFileExists = (name: string): boolean => {
    return fileSystem.some(
      f => f.parentId === currentFolderId && f.name === name && f.type === 'file' && !f.isDeleted
    );
  };

  const handleSave = () => {
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) return;

    if (checkFileExists(trimmedFileName)) {
      setShowOverwriteWarning(true);
      return;
    }

    onSave(currentFolderId, trimmedFileName);
    handleClose();
  };

  const handleOverwrite = () => {
    const trimmedFileName = fileName.trim();
    if (!trimmedFileName) return;

    onSave(currentFolderId, trimmedFileName);
    handleClose();
  };

  const handleClose = () => {
    setFileName(suggestedFileName);
    setShowOverwriteWarning(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && !showOverwriteWarning) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={handleClose}
    >
      <div
        className={`w-[600px] max-h-[500px] rounded-lg shadow-2xl flex flex-col ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Save File</h2>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Save location:</label>
            <div className={`flex items-center gap-2 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {breadcrumbs.map((folder, index) => (
                <div key={folder.id} className="flex items-center gap-2">
                  {index > 0 && <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>/</span>}
                  <button
                    onClick={() => setCurrentFolderId(folder.id)}
                    className={`hover:underline ${index === breadcrumbs.length - 1 ? 'font-semibold' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}
                  >
                    {folder.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Folder contents:</label>
            <div
              className={`border rounded-lg p-4 h-48 overflow-auto ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              }`}
            >
              {items.length === 0 ? (
                <div className="text-center text-gray-500 py-8">This folder is empty</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentFolderId(item.id)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-700 bg-gray-700/50'
                          : 'hover:bg-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📁</span>
                        <span className={`truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>File name:</label>
            <input
              type="text"
              value={fileName}
              onChange={e => {
                setFileName(e.target.value);
                setShowOverwriteWarning(false);
              }}
              className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300'
              }`}
              placeholder="Enter file name..."
              autoFocus
            />
            {checkFileExists(fileName.trim()) && !showOverwriteWarning && (
              <p className="text-sm text-orange-500 mt-2">⚠️ A file with this name already exists</p>
            )}
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button
            onClick={handleClose}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          {!showOverwriteWarning ? (
            <button
              onClick={handleSave}
              disabled={!fileName.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleOverwrite}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Overwrite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
