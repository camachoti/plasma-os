import React, { useState, useRef, useEffect } from 'react';
import { executeDebianCommand } from '../../utils/desktopConfig';

interface TerminalAppProps {
  accentColor: string;
}

interface CommandHistoryItem {
  command: string;
  output: string;
  timestamp: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = () => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'neofetch',
      output: executeDebianCommand('neofetch').output,
      timestamp: '19:40',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandIndex, setCommandIndex] = useState<number>(-1);
  const [pastCommands, setPastCommands] = useState<string[]>(['neofetch']);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    setPastCommands((prev) => [...prev, trimmed]);
    setCommandIndex(-1);

    const result = executeDebianCommand(trimmed);

    if (result.clear) {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: result.output,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIndex =
          commandIndex === -1 ? pastCommands.length - 1 : Math.max(0, commandIndex - 1);
        setCommandIndex(nextIndex);
        setInputVal(pastCommands[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandIndex !== -1) {
        const nextIndex = commandIndex + 1;
        if (nextIndex >= pastCommands.length) {
          setCommandIndex(-1);
          setInputVal('');
        } else {
          setCommandIndex(nextIndex);
          setInputVal(pastCommands[nextIndex]);
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-[#0f172a]/85 text-slate-100 font-mono text-xs select-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top command shortcut toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5 bg-black/30 overflow-x-auto text-[11px] shrink-0">
        <span className="text-slate-400 mr-1 text-[10px]">Atalhos:</span>
        {[
          'neofetch',
          'uname -a',
          'cat /etc/os-release',
          'apt update',
          'apt install vlc',
          'free -m',
          'df -h',
          'clear',
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleRunCommand(cmd)}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors whitespace-nowrap text-[11px]"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
        <div className="text-slate-400 leading-normal text-[11px] pb-1 border-b border-white/5">
          Debian GNU/Linux 13 (Trixie) - x86_64
          <br />
          Digite <span className="text-slate-200 font-bold">help</span> para visualizar comandos disponíveis.
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 text-xs">
              <span className="text-emerald-400 font-bold">debian@debian-trixie</span>
              <span className="text-slate-500">:</span>
              <span className="text-sky-400">~</span>
              <span className="text-slate-400">$</span>
              <span className="text-white font-medium">{item.command}</span>
            </div>
            {item.output && (
              <pre className="text-slate-200 whitespace-pre-wrap font-mono leading-tight pl-2 border-l-2 border-slate-700 text-[11px]">
                {item.output}
              </pre>
            )}
          </div>
        ))}

        {/* Input prompt */}
        <div className="flex items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-emerald-400 font-bold shrink-0">debian@debian-trixie</span>
          <span className="text-slate-500">:</span>
          <span className="text-sky-400 shrink-0">~</span>
          <span className="text-slate-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
            spellCheck={false}
          />
        </div>

        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
