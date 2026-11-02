import React from 'react';
import { WindowState } from '../utils/desktopConfig';
import { IconLayoutGridFilled, IconX } from '@tabler/icons-react';

interface TaskViewOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  windows: WindowState[];
  onSelectWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  accentColor: string;
}

export const TaskViewOverview: React.FC<TaskViewOverviewProps> = ({
  isOpen,
  onClose,
  windows,
  onSelectWindow,
  onCloseWindow,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-between p-12 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <IconLayoutGridFilled className="w-5 h-5 text-slate-300" />
        <h2 className="text-sm font-semibold text-white tracking-wide">
          Visão Geral das Tarefas
        </h2>
      </div>

      {/* Grid of open windows */}
      <div
        className="w-full max-w-5xl flex-1 flex items-center justify-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {windows.length === 0 ? (
          <div className="text-center text-slate-400 text-xs">
            <p>Nenhuma janela aberta.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full max-h-[70vh] overflow-y-auto p-4">
            {windows.map((win) => (
              <div
                key={win.id}
                onClick={() => {
                  onSelectWindow(win.id);
                  onClose();
                }}
                className="group relative rounded-xl p-3.5 glass-subtle bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 transition-all cursor-pointer shadow-lg hover:border-white/20"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{win.icon}</span>
                    <span className="text-xs font-medium text-white truncate max-w-[140px]">
                      {win.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseWindow(win.id);
                    }}
                    className="p-1 rounded-md hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                    title="Fechar janela"
                  >
                    <IconX className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="h-28 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-slate-400 text-[11px] font-mono">
                  <span>{win.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-slate-400">
        Pressione <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Esc</kbd> para fechar
      </div>
    </div>
  );
};
