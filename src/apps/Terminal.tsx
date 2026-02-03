import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';

interface Command {
  input: string;
  output: string;
}

export default function Terminal() {
  const { fileSystem } = useStore();
  const [history, setHistory] = useState<Command[]>([
    { input: '', output: 'Web OS Terminal v1.0.0\nType "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';

    switch (command) {
      case 'help':
        output = `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  echo [text]   - Print text to terminal
  date          - Show current date and time
  ls            - List files in current directory
  pwd           - Print working directory
  whoami        - Display current user
  uname         - Display system information
  cat [file]    - Display file contents
  calc [expr]   - Simple calculator (e.g., calc 2+2)
`;
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'echo':
        output = args.join(' ') + '\n';
        break;
      case 'date':
        output = new Date().toString() + '\n';
        break;
      case 'ls': {
        const files = fileSystem.filter(f => !f.isDeleted && f.parentId === 'root');
        output = files.map(f => `${f.type === 'folder' ? '📁' : '📄'} ${f.name}`).join('\n') + '\n';
        break;
      }
      case 'pwd':
        output = '/home/user\n';
        break;
      case 'whoami':
        output = 'user\n';
        break;
      case 'uname':
        output = 'Web OS 1.0.0 (Browser)\n';
        break;
      case 'cat': {
        if (args.length === 0) {
          output = 'cat: missing file operand\n';
        } else {
          const file = fileSystem.find(f => f.name === args[0] && f.type === 'file');
          if (file) {
            output = (file.content || '(empty file)') + '\n';
          } else {
            output = `cat: ${args[0]}: No such file\n`;
          }
        }
        break;
      }
      case 'calc':
        if (args.length === 0) {
          output = 'calc: missing expression\n';
        } else {
          try {
            const expr = args.join('').replace(/[^0-9+\-*/().]/g, '');
            const result = Function('"use strict"; return (' + expr + ')')();
            output = `${result}\n`;
          } catch {
            output = 'calc: invalid expression\n';
          }
        }
        break;
      case '':
        break;
      default:
        output = `${command}: command not found\n`;
    }

    setHistory([...history, { input: cmd, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = history.filter(h => h.input).map(h => h.input);
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commands[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commands = history.filter(h => h.input).map(h => h.input);
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commands.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commands[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="h-full p-4 font-mono text-sm overflow-y-auto bg-black text-green-400"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="space-y-1">
        {history.map((cmd, i) => (
          <div key={i}>
            {cmd.input && (
              <div>
                <span className="text-blue-400">user@webos</span>
                <span className="text-white">:</span>
                <span className="text-purple-400">~</span>
                <span className="text-white">$ </span>
                <span>{cmd.input}</span>
              </div>
            )}
            {cmd.output && <pre className="whitespace-pre-wrap">{cmd.output}</pre>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-blue-400">user@webos</span>
        <span className="text-white">:</span>
        <span className="text-purple-400">~</span>
        <span className="text-white">$ </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none ml-1 text-green-400"
          autoFocus
        />
      </form>

      <div ref={bottomRef} />
    </div>
  );
}
