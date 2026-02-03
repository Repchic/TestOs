import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store';
import SaveDialog from '../components/SaveDialog';

interface Props {
  windowId: string;
  data?: any;
}

export default function TextEditor({ windowId, data }: Props) {
  const { updateWindowData, isDarkMode, fileSystem, updateFile, createFile, addNotification } = useStore();
  const [content, setContent] = useState(data?.content || '// Start coding...\n');
  const [language, setLanguage] = useState(data?.language || 'javascript');
  const [fontSize, setFontSize] = useState(14);
  const [fileName, setFileName] = useState(data?.fileName || 'untitled.js');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    if (data?.fileId) {
      const file = fileSystem.find(f => f.id === data.fileId);
      if (file && file.content) {
        setContent(file.content);
        setFileName(file.name);
        const ext = file.name.split('.').pop();
        const langMap: Record<string, string> = {
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
          html: 'html',
          css: 'css',
          json: 'json',
          md: 'markdown',
          txt: 'plaintext',
        };
        setLanguage(langMap[ext || ''] || 'plaintext');
      }
    }
  }, [data?.fileId, fileSystem]);

  const handleContentChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    updateWindowData(windowId, { content: newContent, language, fileName });
    
    if (data?.fileId) {
      updateFile(data.fileId, { content: newContent });
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: '.js' },
    { value: 'typescript', label: 'TypeScript', extension: '.ts' },
    { value: 'python', label: 'Python', extension: '.py' },
    { value: 'html', label: 'HTML', extension: '.html' },
    { value: 'css', label: 'CSS', extension: '.css' },
    { value: 'json', label: 'JSON', extension: '.json' },
    { value: 'markdown', label: 'Markdown', extension: '.md' },
    { value: 'plaintext', label: 'Plain Text', extension: '.txt' },
  ];

  const getExtension = (lang: string): string => {
    const langObj = languages.find(l => l.value === lang);
    return langObj ? langObj.extension : '.txt';
  };

  const getSuggestedFileName = (): string => {
    if (data?.fileId) {
      return fileName;
    }
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    return baseName || 'untitled';
  };

  const handleSave = (folderId: string, saveFileName: string) => {
    const existingFile = fileSystem.find(
      f => f.parentId === folderId && f.name === saveFileName && f.type === 'file' && !f.isDeleted
    );

    let fileId: string;

    if (existingFile) {
      updateFile(existingFile.id, { content });
      fileId = existingFile.id;
    } else {
      fileId = createFile(saveFileName, 'file', folderId, content);
    }
    
    updateWindowData(windowId, {
      fileId,
      fileName: saveFileName,
      content,
      language,
    });

    setFileName(saveFileName);
    
    addNotification({
      title: 'File Saved',
      message: `Successfully saved ${saveFileName}`,
    });
  };

  const handleSaveShortcut = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (data?.fileId) {
        updateFile(data.fileId, { content });
        addNotification({
          title: 'File Saved',
          message: `Successfully saved ${fileName}`,
        });
      } else {
        setShowSaveDialog(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleSaveShortcut);
    return () => window.removeEventListener('keydown', handleSaveShortcut);
  }, [content, fileName, data?.fileId]);

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className={`px-2 py-1 rounded border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} outline-none`}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Save
          </button>
          <span className="text-sm">Font Size:</span>
          <button
            onClick={() => setFontSize(prev => Math.max(10, prev - 2))}
            className={`px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            -
          </button>
          <span className="text-sm w-8 text-center">{fontSize}</span>
          <button
            onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
            className={`px-2 py-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleContentChange}
          theme={isDarkMode ? 'vs-dark' : 'light'}
          options={{
            fontSize,
            minimap: { enabled: true },
            lineNumbers: 'on',
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
        />
      </div>

      <SaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSave}
        suggestedFileName={`${getSuggestedFileName()}${getExtension(language)}`}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
