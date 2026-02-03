import { useState, useEffect } from 'react';
import { useStore } from '../store';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created: Date;
  modified: Date;
}

export default function NotesApp() {
  const { isDarkMode } = useStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('webos-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes).map((n: any) => ({
        ...n,
        created: new Date(n.created),
        modified: new Date(n.modified),
      })));
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('webos-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      tags: [],
      created: new Date(),
      modified: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditMode(true);
  };

  const updateNote = (updates: Partial<Note>) => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      ...updates,
      modified: new Date(),
    };
    
    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="h-full flex">
      <div className={`w-64 border-r ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'} flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={createNote}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ➕ New Note
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setEditMode(false);
              }}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedNote?.id === note.id
                  ? 'bg-blue-500 text-white'
                  : isDarkMode
                  ? 'border-gray-700 hover:bg-gray-700'
                  : 'border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold truncate">{note.title}</div>
              <div className="text-sm opacity-70 truncate">{note.content}</div>
              <div className="text-xs opacity-50 mt-1">
                {note.modified.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <input
                type="text"
                value={selectedNote.title}
                onChange={e => updateNote({ title: e.target.value })}
                className={`text-xl font-semibold flex-1 outline-none ${
                  isDarkMode ? 'bg-transparent text-white' : 'bg-transparent'
                }`}
                disabled={!editMode}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1 rounded ${
                    editMode
                      ? 'bg-blue-500 text-white'
                      : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}
                >
                  {editMode ? '✓ Done' : '✎ Edit'}
                </button>
                <button
                  onClick={() => deleteNote(selectedNote.id)}
                  className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-red-600' : 'bg-gray-200 hover:bg-red-500 hover:text-white'}`}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <textarea
                value={selectedNote.content}
                onChange={e => updateNote({ content: e.target.value })}
                className={`w-full h-full resize-none outline-none ${
                  isDarkMode ? 'bg-transparent text-white' : 'bg-transparent'
                }`}
                placeholder="Start typing..."
                disabled={!editMode}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
