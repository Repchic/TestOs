import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { FileSystemNode } from '../types';

interface Props {
  data?: any;
}

export default function FileManager({ data }: Props) {
  const {
    fileSystem,
    createFile,
    updateFile,
    deleteFile,
    restoreFile,
    permanentlyDeleteFile,
    permanentlyDeleteAll,
    openWindow,
    isDarkMode,
  } = useStore();
  
  const [currentFolderId, setCurrentFolderId] = useState<string>(
    data?.viewTrash ? 'trash' : 'root'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [newItemName, setNewItemName] = useState('');
  const [showNewItem, setShowNewItem] = useState<'file' | 'folder' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const currentFolder = fileSystem.find(f => f.id === currentFolderId);
  const isTrash = currentFolderId === 'trash';

  const items = useMemo(() => {
    if (isTrash) {
      return fileSystem.filter(f => f.isDeleted);
    }
    return fileSystem.filter(f => f.parentId === currentFolderId && !f.isDeleted);
  }, [fileSystem, currentFolderId, isTrash]);

  const breadcrumbs = useMemo(() => {
    const path: FileSystemNode[] = [];
    let current = currentFolder;
    while (current) {
      path.unshift(current);
      const parentId = current.parentId;
      if (!parentId) break;
      current = fileSystem.find(f => f.id === parentId);
    }
    return path;
  }, [currentFolder, fileSystem]);

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    createFile(newItemName, showNewItem!, currentFolderId, showNewItem === 'file' ? '' : undefined);
    setNewItemName('');
    setShowNewItem(null);
  };

  const handleItemClick = (item: FileSystemNode) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedFiles(new Set());
    } else {
      openWindow('text-editor', item.name, { content: item.content, fileId: item.id, fileName: item.name });
    }
  };

  const handleDelete = (id: string) => {
    deleteFile(id);
    setSelectedFiles(new Set());
  };

  const handleRestore = (id: string) => {
    restoreFile(id);
    setSelectedFiles(new Set());
  };

  const handlePermanentlyDelete = (id: string) => {
    permanentlyDeleteFile(id);
    setSelectedFiles(new Set());
  };

  const handlePermanentlyDeleteAll = () => {
    permanentlyDeleteAll();
    setSelectedFiles(new Set());
  };

  const handlePermanentlyDeleteSelected = () => {
    selectedFiles.forEach(id => permanentlyDeleteFile(id));
    setSelectedFiles(new Set());
  };

  const handleStartRename = (item: FileSystemNode) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleRename = () => {
    if (!editingId || !editingName.trim()) {
      setEditingId(null);
      setEditingName('');
      return;
    }

    const trimmedName = editingName.trim();
    const item = fileSystem.find(f => f.id === editingId);
    
    if (!item) {
      setEditingId(null);
      setEditingName('');
      return;
    }

    // Check for duplicate names in the same folder
    const duplicateExists = items.some(
      f => f.id !== editingId && f.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (duplicateExists) {
      setEditingId(null);
      setEditingName('');
      return;
    }

    updateFile(editingId, { name: trimmedName });
    setEditingId(null);
    setEditingName('');
    setSelectedFiles(new Set());
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          {breadcrumbs.map((folder, index) => (
            <div key={folder.id} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <button
                onClick={() => {
                  setCurrentFolderId(folder.id);
                  setSelectedFiles(new Set());
                }}
                className={`hover:underline ${index === breadcrumbs.length - 1 ? 'font-semibold' : ''} ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {!isTrash && (
            <>
              <button
                onClick={() => setShowNewItem('folder')}
                className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                📁 New Folder
              </button>
              <button
                onClick={() => setShowNewItem('file')}
                className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                📄 New File
              </button>
            </>
          )}
          {isTrash && (
            <>
              {selectedFiles.size > 0 && (
                <button
                  onClick={handlePermanentlyDeleteSelected}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete Selected
                </button>
              )}
              <button
                onClick={handlePermanentlyDeleteAll}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                🗑️ Empty Trash
              </button>
            </>
          )}
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300') : ''}`}
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-300') : ''}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {showNewItem && (
        <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder={`Enter ${showNewItem} name...`}
              className={`flex-1 px-3 py-2 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none focus:ring-2 focus:ring-blue-500`}
              onKeyDown={e => e.key === 'Enter' && handleCreateItem()}
              autoFocus
            />
            <button
              onClick={handleCreateItem}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewItem(null);
                setNewItemName('');
              }}
              className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4" onClick={() => setSelectedFiles(new Set())}>
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {isTrash ? 'Trash is empty' : 'This folder is empty'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedFiles.has(item.id)
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  editingId !== item.id && handleItemClick(item);
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  if (editingId !== item.id) {
                    setSelectedFiles(new Set([item.id]));
                  }
                }}
              >
                <div className="text-5xl mb-2 text-center">
                  {item.type === 'folder' ? '📁' : '📄'}
                </div>
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={e => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        handleRename();
                      } else if (e.key === 'Escape') {
                        handleCancelRename();
                      }
                    }}
                    onBlur={handleRename}
                    className={`w-full text-sm text-center px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <div className={`text-sm text-center truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{item.name}</div>
                )}
                {selectedFiles.has(item.id) && editingId !== item.id && (
                  <div className="mt-2 flex gap-2 justify-center">
                    {isTrash ? (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleRestore(item.id);
                          }}
                          className="text-xs px-2 py-1 bg-white text-blue-500 rounded"
                        >
                          Restore
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePermanentlyDelete(item.id);
                          }}
                          className="text-xs px-2 py-1 bg-white text-red-500 rounded"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleStartRename(item);
                          }}
                          className="text-xs px-2 py-1 bg-white text-blue-500 rounded"
                        >
                          Rename
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-xs px-2 py-1 bg-white text-red-500 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div
                key={item.id}
                className={`p-3 rounded flex items-center justify-between cursor-pointer ${
                  selectedFiles.has(item.id)
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  editingId !== item.id && handleItemClick(item);
                }}
                onContextMenu={e => {
                  e.preventDefault();
                  if (editingId !== item.id) {
                    setSelectedFiles(new Set([item.id]));
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{item.type === 'folder' ? '📁' : '📄'}</span>
                  <div className="flex-1 min-w-0">
                    {editingId === item.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={e => setEditingName(e.target.value)}
                        onKeyDown={e => {
                          e.stopPropagation();
                          if (e.key === 'Enter') {
                            handleRename();
                          } else if (e.key === 'Escape') {
                            handleCancelRename();
                          }
                        }}
                        onBlur={handleRename}
                        className={`w-full px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} outline-none focus:ring-2 focus:ring-blue-500`}
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className={isDarkMode ? 'text-white' : 'text-black'}>{item.name}</div>
                        <div className={`text-xs opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(item.modified).toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {selectedFiles.has(item.id) && editingId !== item.id && (
                  <div className="flex gap-2">
                    {isTrash ? (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleRestore(item.id);
                          }}
                          className="px-3 py-1 bg-white text-blue-500 rounded text-sm"
                        >
                          Restore
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePermanentlyDelete(item.id);
                          }}
                          className="px-3 py-1 bg-white text-red-500 rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleStartRename(item);
                          }}
                          className="px-3 py-1 bg-white text-blue-500 rounded text-sm"
                        >
                          Rename
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="px-3 py-1 bg-white text-red-500 rounded text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
