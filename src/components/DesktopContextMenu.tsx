import React from 'react';
import {
  IconAdjustmentsFilled,
  IconPhotoFilled,
  IconTerminal2,
  IconFolderPlus,
  IconCpu,
  IconRefresh,
} from '@tabler/icons-react';
import { DesktopIconSize } from '../utils/desktopConfig';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  onOpenTaskbarSettings: () => void;
  onRefreshDesktop: () => void;
  desktopIconSize: DesktopIconSize;
  onUpdateDesktopIconSize: (size: DesktopIconSize) => void;
  isDark: boolean;
}

export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  onClose,
  onOpenApp,
  onOpenTaskbarSettings,
  onRefreshDesktop,
  desktopIconSize,
  onUpdateDesktopIconSize,
  isDark,
}) => {
  const adjustedX = Math.min(x, window.innerWidth - 240);
  const adjustedY = Math.min(y, window.innerHeight - 340);

  return (
    <>
      <div
        className="fixed inset-0 z-[80]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      <div
        className="fixed z-[85] w-60 rounded-xl glass-acrylic p-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100 border"
        style={{
          top: adjustedY,
          left: adjustedX,
          backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#f8fafc' : '#0f172a',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
          boxShadow: isDark
            ? '0 20px 48px rgba(0, 0, 0, 0.5)'
            : '0 20px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Icon Size Controls */}
        <div className="px-3 pt-1.5 pb-1 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
          Tamanho dos Ícones
        </div>
        <div className="grid grid-cols-3 gap-1 px-2 pb-1.5 mb-1">
          {(['small', 'medium', 'large'] as DesktopIconSize[]).map((size) => {
            const isSelected = desktopIconSize === size;
            const labels = {
              small: 'Pequeno',
              medium: 'Médio',
              large: 'Grande',
            };
            return (
              <button
                key={size}
                onClick={() => onUpdateDesktopIconSize(size)}
                className={`py-1 text-[11px] rounded-md font-medium text-center transition-colors ${
                  isSelected
                    ? 'bg-accent text-white font-semibold shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {labels[size]}
              </button>
            );
          })}
        </div>

        <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />

        <button
          onClick={() => {
            onOpenTaskbarSettings();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between font-medium text-slate-800 dark:text-slate-100"
        >
          <span>Personalizar Barra de Tarefas</span>
          <IconAdjustmentsFilled className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => {
            onOpenApp('settings');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between font-medium text-slate-800 dark:text-slate-100"
        >
          <span>Alterar Plano de Fundo</span>
          <IconPhotoFilled className="w-3.5 h-3.5 opacity-60" />
        </button>

        <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />

        <button
          onClick={() => {
            onOpenApp('terminal');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between font-medium text-slate-800 dark:text-slate-100"
        >
          <span>Abrir no Terminal</span>
          <IconTerminal2 className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => {
            onOpenApp('files');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between font-medium text-slate-800 dark:text-slate-100"
        >
          <span>Nova Pasta</span>
          <IconFolderPlus className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => {
            onOpenApp('monitor');
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between font-medium text-slate-800 dark:text-slate-100"
        >
          <span>Monitor do Sistema</span>
          <IconCpu className="w-3.5 h-3.5 opacity-60" />
        </button>

        <div className="my-1 border-t border-slate-200/80 dark:border-white/10" />

        <button
          onClick={() => {
            onRefreshDesktop();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium"
        >
          <span>Atualizar Área de Trabalho</span>
          <IconRefresh className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </>
  );
};
