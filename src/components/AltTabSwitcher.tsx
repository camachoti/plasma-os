import React, { useEffect } from 'react';
import { WindowState } from '../utils/desktopConfig';
import {
  IconDeviceDesktopFilled,
  IconFolderFilled,
  IconTerminal2,
  IconBuildingStore,
  IconCpu,
  IconSettingsFilled,
} from '@tabler/icons-react';

interface AltTabSwitcherProps {
  isOpen: boolean;
  windows: WindowState[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onConfirm: (windowId: string) => void;
  onClose: () => void;
  isDark: boolean;
}

const getWindowAppIcon = (appId: string) => {
  switch (appId) {
    case 'settings':
      return <IconSettingsFilled className="w-8 h-8 text-blue-400" />;
    case 'terminal':
      return <IconTerminal2 className="w-8 h-8 text-emerald-400" />;
    case 'files':
      return <IconFolderFilled className="w-8 h-8 text-amber-400" />;
    case 'store':
      return <IconBuildingStore className="w-8 h-8 text-purple-400" />;
    case 'monitor':
      return <IconCpu className="w-8 h-8 text-cyan-400" />;
    default:
      return <IconDeviceDesktopFilled className="w-8 h-8 text-slate-300" />;
  }
};

export const AltTabSwitcher: React.FC<AltTabSwitcherProps> = ({
  isOpen,
  windows,
  selectedIndex,
  onSelectIndex,
  onConfirm,
  onClose,
  isDark,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        onSelectIndex((selectedIndex + 1) % windows.length);
      } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        onSelectIndex((selectedIndex - 1 + windows.length) % windows.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (windows[selectedIndex]) {
          onConfirm(windows[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, selectedIndex, windows, onSelectIndex, onConfirm, onClose]);

  if (!isOpen || windows.length === 0) return null;

  const currentWin = windows[selectedIndex] || windows[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Alternador de Janelas (Alt+Tab)"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md select-none animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl mx-4 rounded-2xl border p-6 flex flex-col gap-5 shadow-2xl glass-acrylic transition-all ${
          isDark
            ? 'bg-slate-900/90 border-white/15 text-white shadow-black/60'
            : 'bg-white/95 border-slate-300/80 text-slate-800 shadow-slate-900/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Title */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Alternador de Janelas
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {selectedIndex + 1} de {windows.length}
          </span>
        </div>

        {/* Windows Cards Grid / Carousel */}
        <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-1">
          {windows.map((win, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={win.id}
                type="button"
                onClick={() => onConfirm(win.id)}
                onMouseEnter={() => onSelectIndex(idx)}
                className={`relative flex flex-col items-center justify-between w-32 h-36 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/20 ring-2 ring-accent scale-105 shadow-xl'
                    : isDark
                    ? 'border-white/10 bg-slate-800/60 hover:bg-slate-800/90 hover:border-white/20'
                    : 'border-slate-200 bg-slate-100/80 hover:bg-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Minimized badge */}
                {win.isMinimized && (
                  <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-400 font-medium">
                    Min
                  </span>
                )}

                {/* Window App Icon */}
                <div className="flex-1 flex items-center justify-center">
                  {getWindowAppIcon(win.appId)}
                </div>

                {/* Title */}
                <div className="w-full text-center">
                  <p
                    className={`text-xs font-medium truncate ${
                      isSelected ? 'text-white font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {win.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with focused window name and tip */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
          <span className="truncate max-w-[380px] text-slate-200 font-medium">
            {currentWin ? currentWin.title : ''}
          </span>
          <span className="text-[11px] text-slate-400">
            Solte <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Alt</kbd> para alternar
          </span>
        </div>
      </div>
    </div>
  );
};
