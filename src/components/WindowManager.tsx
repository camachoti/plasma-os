import React, { useState, useRef } from 'react';
import {
  WindowState,
  TaskbarSettings,
  calculateWindowSnap,
  DesktopIconSize,
} from '../utils/desktopConfig';
import { Minus, Square, X, Copy } from 'lucide-react';
import {
  IconDeviceDesktopFilled,
  IconFolderFilled,
  IconTerminal2,
  IconBuildingStore,
  IconCpu,
  IconSettingsFilled,
} from '@tabler/icons-react';
import { ControlCenterApp } from './apps/ControlCenterApp';
import { TerminalApp } from './apps/TerminalApp';
import { FileManagerApp } from './apps/FileManagerApp';
import { AppStoreApp } from './apps/AppStoreApp';
import { SystemMonitorApp } from './apps/SystemMonitorApp';

const getTitlebarIcon = (appId: string) => {
  switch (appId) {
    case 'settings':
      return <IconSettingsFilled className="w-3.5 h-3.5 text-slate-300" />;
    case 'terminal':
      return <IconTerminal2 className="w-3.5 h-3.5 text-slate-300" />;
    case 'files':
      return <IconFolderFilled className="w-3.5 h-3.5 text-slate-300" />;
    case 'store':
      return <IconBuildingStore className="w-3.5 h-3.5 text-slate-300" />;
    case 'monitor':
      return <IconCpu className="w-3.5 h-3.5 text-slate-300" />;
    default:
      return <IconDeviceDesktopFilled className="w-3.5 h-3.5 text-slate-300" />;
  }
};

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const MIN_WINDOW_WIDTH = 320;
const MIN_WINDOW_HEIGHT = 200;

interface WindowManagerProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onToggleMaximizeWindow: (id: string) => void;
  onUpdateWindowPos: (id: string, x: number, y: number) => void;
  onUpdateWindowSize: (
    id: string,
    size: { x: number; y: number; width: number; height: number }
  ) => void;
  taskbarSettings: TaskbarSettings;
  accentColor: string;
  isDark: boolean;
  acrylicEnabled: boolean;
  onUpdateSettings: (newSettings: Partial<TaskbarSettings>) => void;
  currentWallpaper: string;
  onSelectWallpaper: (path: string) => void;
  onSelectAccentColor: (hex: string) => void;
  onToggleTheme: () => void;
  onToggleAcrylic: () => void;
  desktopIconSize?: DesktopIconSize;
  onUpdateDesktopIconSize?: (size: DesktopIconSize) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onUpdateWindowPos,
  onUpdateWindowSize,
  taskbarSettings,
  accentColor,
  isDark,
  acrylicEnabled,
  onUpdateSettings,
  currentWallpaper,
  onSelectWallpaper,
  onSelectAccentColor,
  onToggleTheme,
  onToggleAcrylic,
  desktopIconSize = 'medium',
  onUpdateDesktopIconSize,
}) => {
  const [dragState, setDragState] = useState<{
    windowId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const [resizeState, setResizeState] = useState<{
    windowId: string;
    edge: ResizeEdge;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);

  const dragWindowRef = useRef<{ id: string; x: number; y: number } | null>(null);

  const handleMouseDownHeader = (e: React.MouseEvent, win: WindowState) => {
    if (win.isMaximized) return;
    onFocusWindow(win.id);
    setDragState({
      windowId: win.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: win.x,
      initialY: win.y,
    });
    dragWindowRef.current = { id: win.id, x: win.x, y: win.y };
  };

  const handleMouseDownResize = (e: React.MouseEvent, win: WindowState, edge: ResizeEdge) => {
    e.stopPropagation();
    if (win.isMaximized) return;
    onFocusWindow(win.id);
    setResizeState({
      windowId: win.id,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      initialX: win.x,
      initialY: win.y,
      initialWidth: win.width,
      initialHeight: win.height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (resizeState) {
      const dx = e.clientX - resizeState.startX;
      const dy = e.clientY - resizeState.startY;
      const { edge, initialX, initialY, initialWidth, initialHeight } = resizeState;

      let x = initialX;
      let y = initialY;
      let width = initialWidth;
      let height = initialHeight;

      if (edge.includes('e')) {
        width = Math.max(MIN_WINDOW_WIDTH, initialWidth + dx);
      }
      if (edge.includes('s')) {
        height = Math.max(MIN_WINDOW_HEIGHT, initialHeight + dy);
      }
      if (edge.includes('w')) {
        width = Math.max(MIN_WINDOW_WIDTH, initialWidth - dx);
        x = initialX + (initialWidth - width);
      }
      if (edge.includes('n')) {
        height = Math.max(MIN_WINDOW_HEIGHT, initialHeight - dy);
        y = initialY + (initialHeight - height);
      }

      // Keep the window reachable inside the viewport
      x = Math.max(0, x);
      y = Math.max(0, y);

      onUpdateWindowSize(resizeState.windowId, { x, y, width, height });
      return;
    }

    if (!dragState) return;
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragState.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragState.initialY + deltaY));

    dragWindowRef.current = { id: dragState.windowId, x: newX, y: newY };
    onUpdateWindowPos(dragState.windowId, newX, newY);
  };

  const handleMouseUp = () => {
    setDragState(null);
    setResizeState(null);
  };

  const renderAppContent = (win: WindowState) => {
    switch (win.appId) {
      case 'settings':
        return (
          <ControlCenterApp
            settings={taskbarSettings}
            onUpdateSettings={onUpdateSettings}
            currentWallpaper={currentWallpaper}
            onSelectWallpaper={onSelectWallpaper}
            accentColor={accentColor}
            onSelectAccentColor={onSelectAccentColor}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            acrylicEnabled={acrylicEnabled}
            onToggleAcrylic={onToggleAcrylic}
            desktopIconSize={desktopIconSize}
            onUpdateDesktopIconSize={onUpdateDesktopIconSize}
          />
        );
      case 'terminal':
        return <TerminalApp accentColor={accentColor} />;
      case 'files':
        return <FileManagerApp accentColor={accentColor} />;
      case 'store':
        return <AppStoreApp accentColor={accentColor} />;
      case 'monitor':
        return <SystemMonitorApp accentColor={accentColor} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs">
            Aplicativo {win.title} em execução.
          </div>
        );
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {windows.map((win) => {
        if (win.isMinimized) return null;
        const isActive = win.id === activeWindowId;

        let styleObj: React.CSSProperties = {
          zIndex: win.zIndex,
        };

        if (win.isMaximized) {
          const snap = calculateWindowSnap(
            'maximize',
            window.innerWidth,
            window.innerHeight,
            taskbarSettings.position,
            52,
            taskbarSettings.mode === 'dock'
          );
          styleObj = {
            ...styleObj,
            transform: `translate3d(${snap.x}px, ${snap.y}px, 0)`,
            width: `${snap.width}px`,
            height: `${snap.height}px`,
          };
        } else {
          styleObj = {
            ...styleObj,
            transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
            width: `${win.width}px`,
            height: `${win.height}px`,
          };
        }

        const resizeCursor = (edge: ResizeEdge) => {
          switch (edge) {
            case 'n':
            case 's':
              return 'cursor-ns-resize';
            case 'e':
            case 'w':
              return 'cursor-ew-resize';
            case 'ne':
            case 'sw':
              return 'cursor-nesw-resize';
            case 'nw':
            case 'se':
              return 'cursor-nwse-resize';
          }
        };

        const resizeHandles: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
        const handlePosition: Record<ResizeEdge, React.CSSProperties> = {
          n: { top: 0, left: 8, right: 8, height: 5, cursor: 'ns-resize' },
          s: { bottom: 0, left: 8, right: 8, height: 5, cursor: 'ns-resize' },
          w: { left: 0, top: 8, bottom: 8, width: 5, cursor: 'ew-resize' },
          e: { right: 0, top: 8, bottom: 8, width: 5, cursor: 'ew-resize' },
          nw: { top: 0, left: 0, width: 12, height: 12, cursor: 'nwse-resize' },
          ne: { top: 0, right: 0, width: 12, height: 12, cursor: 'nesw-resize' },
          sw: { bottom: 0, left: 0, width: 12, height: 12, cursor: 'nesw-resize' },
          se: { bottom: 0, right: 0, width: 12, height: 12, cursor: 'nwse-resize' },
        };

        return (
          <div
            key={win.id}
            role="dialog"
            aria-label={win.title}
            onMouseDown={() => onFocusWindow(win.id)}
            className={`absolute pointer-events-auto flex flex-col rounded-xl overflow-hidden transition-[box-shadow,border-color] duration-150 border ${
              acrylicEnabled ? 'glass-acrylic' : ''
            }`}
            style={{
              ...styleObj,
              backgroundColor: isDark
                ? acrylicEnabled ? 'rgba(18, 24, 38, 0.86)' : 'rgba(18, 24, 38, 0.98)'
                : acrylicEnabled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.98)',
              borderColor: isDark
                ? (isActive ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.08)')
                : (isActive ? 'rgba(100, 116, 139, 0.35)' : 'rgba(148, 163, 184, 0.22)'),
              boxShadow: isDark
                ? (isActive
                    ? '0 20px 48px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                    : '0 8px 24px -6px rgba(0, 0, 0, 0.4)')
                : (isActive
                    ? '0 20px 48px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(100, 116, 139, 0.18)'
                    : '0 8px 24px -6px rgba(15, 23, 42, 0.10)'),
            }}
          >
            {/* Window Title Bar (Authentic OpenKylin / Linux Desktop) */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, win)}
              onDoubleClick={() => onToggleMaximizeWindow(win.id)}
              className="h-9 px-3 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 cursor-move select-none shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(0, 0, 0, 0.22)' : 'rgba(241, 245, 249, 0.85)',
              }}
            >
              {/* Left: Window Title & Icon */}
              <div className="flex items-center gap-2 min-w-0">
                {getTitlebarIcon(win.appId)}
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {win.title}
                </span>
              </div>

              {/* Right: Window Controls */}
              <div
                className="flex items-center gap-1"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onMinimizeWindow(win.id)}
                  aria-label="Minimizar janela"
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-200/80 dark:hover:bg-white/10 active:scale-95 transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  title="Minimizar"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onToggleMaximizeWindow(win.id)}
                  aria-label={win.isMaximized ? 'Restaurar janela' : 'Maximizar janela'}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-200/80 dark:hover:bg-white/10 active:scale-95 transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  title={win.isMaximized ? 'Restaurar' : 'Maximizar'}
                >
                  {win.isMaximized ? (
                    <Copy className="w-3 h-3" />
                  ) : (
                    <Square className="w-2.5 h-2.5" />
                  )}
                </button>
                <button
                  onClick={() => onCloseWindow(win.id)}
                  aria-label="Fechar janela"
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-rose-600 active:scale-95 transition-colors text-slate-600 hover:text-white dark:text-slate-300 dark:hover:text-white"
                  title="Fechar"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-hidden relative">
              {renderAppContent(win)}
            </div>

            {/* Resize handles (hidden while maximized) */}
            {!win.isMaximized &&
              resizeHandles.map((edge) => (
                <div
                  key={edge}
                  aria-hidden="true"
                  onMouseDown={(e) => handleMouseDownResize(e, win, edge)}
                  className={`absolute z-10 transition-colors ${resizeCursor(edge)} hover:bg-accent-soft`}
                  style={handlePosition[edge]}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
};
