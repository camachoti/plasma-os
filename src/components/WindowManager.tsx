import React, { useState, useEffect, useRef } from 'react';
import {
  WindowState,
  TaskbarSettings,
  calculateWindowSnap,
  detectSnapTarget,
  SnapTarget,
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
import { soundEffects } from '../utils/soundEffects';

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

const RESIZE_CURSOR: Record<ResizeEdge, string> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
};

const RESIZE_HANDLES: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

type Interaction =
  | {
      kind: 'drag';
      windowId: string;
      startX: number;
      startY: number;
      initialX: number;
      initialY: number;
    }
  | {
      kind: 'resize';
      windowId: string;
      edge: ResizeEdge;
      startX: number;
      startY: number;
      initialX: number;
      initialY: number;
      initialWidth: number;
      initialHeight: number;
    };

interface WindowManagerProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onToggleMaximizeWindow: (id: string) => void;
  onSnapWindow: (id: string, side: SnapTarget) => void;
  onRestoreWindow: (id: string) => void;
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
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  soundVolume?: number;
  onUpdateSoundVolume?: (vol: number) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onSnapWindow,
  onRestoreWindow,
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
  soundEnabled = true,
  onToggleSound,
  soundVolume = 70,
  onUpdateSoundVolume,
}) => {
  // A interação (arrastar/redimensionar) vive num ref e os listeners ficam no document:
  // assim o mouse pode sair da janela e ser solto sobre o desktop sem travar o estado.
  const interactionRef = useRef<Interaction | null>(null);
  const updatePosRef = useRef(onUpdateWindowPos);
  const updateSizeRef = useRef(onUpdateWindowSize);
  const onSnapWindowRef = useRef(onSnapWindow);
  updatePosRef.current = onUpdateWindowPos;
  updateSizeRef.current = onUpdateWindowSize;
  onSnapWindowRef.current = onSnapWindow;

  // Aero Snap Translucent Preview Zone
  const [activeSnapPreview, setActiveSnapPreview] = useState<SnapTarget | null>(null);
  const activeSnapPreviewRef = useRef<SnapTarget | null>(null);

  // Active interaction window state (disables CSS transitions immediately during drag/resize)
  const [activeInteractionWinId, setActiveInteractionWinId] = useState<string | null>(null);

  // Smooth window close transition state
  const [closingIds, setClosingIds] = useState<string[]>([]);
  const onCloseWindowRef = useRef(onCloseWindow);
  onCloseWindowRef.current = onCloseWindow;

  // Track windows executing entrance animation
  const [openingIds, setOpeningIds] = useState<string[]>(() => windows.map((w) => w.id));
  const knownWindowsRef = useRef<Set<string>>(new Set(windows.map((w) => w.id)));

  useEffect(() => {
    const newIds: string[] = [];
    for (const w of windows) {
      if (!knownWindowsRef.current.has(w.id)) {
        knownWindowsRef.current.add(w.id);
        newIds.push(w.id);
      }
    }
    if (newIds.length > 0) {
      setOpeningIds((prev) => [...prev, ...newIds]);
    }
  }, [windows]);

  const handleRequestClose = (id: string) => {
    if (closingIds.includes(id)) return;
    setClosingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setClosingIds((prev) => prev.filter((item) => item !== id));
      onCloseWindowRef.current(id);
    }, 180);
  };

  useEffect(() => {
    const endInteraction = () => {
      const interaction = interactionRef.current;
      const snap = activeSnapPreviewRef.current;

      // If dragging and dropped in a snap zone, execute Aero Snap!
      if (interaction && interaction.kind === 'drag' && snap) {
        onSnapWindowRef.current(interaction.windowId, snap);
      }

      activeSnapPreviewRef.current = null;
      setActiveSnapPreview(null);
      interactionRef.current = null;
      setActiveInteractionWinId(null);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    const handleMove = (e: MouseEvent) => {
      const interaction = interactionRef.current;
      if (!interaction) return;

      // Rede de segurança: se o mouseup se perdeu (soltou fora do iframe/app),
      // e.buttons já vem 0 e o gesto precisa terminar aqui.
      if (e.buttons === 0) {
        endInteraction();
        return;
      }

      if (interaction.kind === 'drag') {
        // Detect Aero Snap border proximity
        const snap = detectSnapTarget(
          e.clientX,
          e.clientY,
          window.innerWidth,
          window.innerHeight,
          24
        );
        if (snap !== activeSnapPreviewRef.current) {
          activeSnapPreviewRef.current = snap;
          setActiveSnapPreview(snap);
        }

        const newX = Math.max(
          0,
          Math.min(
            window.innerWidth - 100,
            interaction.initialX + (e.clientX - interaction.startX)
          )
        );
        const newY = Math.max(
          0,
          Math.min(
            window.innerHeight - 80,
            interaction.initialY + (e.clientY - interaction.startY)
          )
        );
        updatePosRef.current(interaction.windowId, newX, newY);
        return;
      }

      const dx = e.clientX - interaction.startX;
      const dy = e.clientY - interaction.startY;
      const { edge, initialX, initialY, initialWidth, initialHeight } = interaction;

      let x = initialX;
      let y = initialY;
      let width = initialWidth;
      let height = initialHeight;

      // Limites: a janela nunca fica maior que a área visível nem é cortada
      // na borda (antes ela crescia para fora e o overflow a escondia).
      if (edge.includes('e')) {
        width = Math.min(
          Math.max(MIN_WINDOW_WIDTH, initialWidth + dx),
          window.innerWidth - initialX
        );
      }
      if (edge.includes('s')) {
        height = Math.min(
          Math.max(MIN_WINDOW_HEIGHT, initialHeight + dy),
          window.innerHeight - initialY
        );
      }
      if (edge.includes('w')) {
        width = Math.min(
          Math.max(MIN_WINDOW_WIDTH, initialWidth - dx),
          initialX + initialWidth
        );
        x = initialX + initialWidth - width;
      }
      if (edge.includes('n')) {
        height = Math.min(
          Math.max(MIN_WINDOW_HEIGHT, initialHeight - dy),
          initialY + initialHeight
        );
        y = initialY + initialHeight - height;
      }

      updateSizeRef.current(interaction.windowId, { x, y, width, height });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', endInteraction);
    window.addEventListener('pointerup', endInteraction);
    window.addEventListener('pointercancel', endInteraction);
    window.addEventListener('blur', endInteraction);
    document.addEventListener('visibilitychange', endInteraction);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', endInteraction);
      window.removeEventListener('pointerup', endInteraction);
      window.removeEventListener('pointercancel', endInteraction);
      window.removeEventListener('blur', endInteraction);
      document.removeEventListener('visibilitychange', endInteraction);
    };
  }, []);

  const beginInteraction = (interaction: Interaction, cursor: string) => {
    interactionRef.current = interaction;
    setActiveInteractionWinId(interaction.windowId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = cursor;
  };

  const handleMouseDownHeader = (e: React.MouseEvent, win: WindowState) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onFocusWindow(win.id);

    // If window is currently maximized or snapped to an edge, restore cleanly
    // and center the header right under the cursor so dragging is seamless!
    if (win.isMaximized || win.snappedSide) {
      const restoredWidth =
        win.prevRect?.width || Math.min(740, Math.floor(window.innerWidth * 0.65));
      const restoredHeight =
        win.prevRect?.height || Math.min(500, Math.floor(window.innerHeight * 0.65));
      const restoredX = Math.max(
        0,
        Math.min(
          window.innerWidth - restoredWidth,
          e.clientX - Math.floor(restoredWidth / 2)
        )
      );
      const restoredY = Math.max(
        0,
        Math.min(window.innerHeight - 80, Math.max(10, e.clientY - 18))
      );

      onUpdateWindowSize(win.id, {
        x: restoredX,
        y: restoredY,
        width: restoredWidth,
        height: restoredHeight,
      });
      onRestoreWindow(win.id);

      beginInteraction(
        {
          kind: 'drag',
          windowId: win.id,
          startX: e.clientX,
          startY: e.clientY,
          initialX: restoredX,
          initialY: restoredY,
        },
        'move'
      );
      return;
    }

    beginInteraction(
      {
        kind: 'drag',
        windowId: win.id,
        startX: e.clientX,
        startY: e.clientY,
        initialX: win.x,
        initialY: win.y,
      },
      'move'
    );
  };

  const handleMouseDownResize = (e: React.MouseEvent, win: WindowState, edge: ResizeEdge) => {
    e.stopPropagation();
    if (win.isMaximized || win.snappedSide || e.button !== 0) return;
    e.preventDefault();
    onFocusWindow(win.id);
    beginInteraction(
      {
        kind: 'resize',
        windowId: win.id,
        edge,
        startX: e.clientX,
        startY: e.clientY,
        initialX: win.x,
        initialY: win.y,
        initialWidth: win.width,
        initialHeight: win.height,
      },
      RESIZE_CURSOR[edge]
    );
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {windows.map((win) => {
        const isClosing = closingIds.includes(win.id);
        const isMinimized = win.isMinimized;
        const isOpening = openingIds.includes(win.id);
        const isInteracting =
          activeInteractionWinId === win.id || interactionRef.current?.windowId === win.id;
        const isActive = win.id === activeWindowId && !isMinimized && !isClosing;

        let targetX = win.x;
        let targetY = win.y;
        let targetWidth = win.width;
        let targetHeight = win.height;

        if (win.isMaximized) {
          const snap = calculateWindowSnap(
            'maximize',
            window.innerWidth,
            window.innerHeight,
            taskbarSettings.position,
            52,
            taskbarSettings.mode === 'dock'
          );
          targetX = snap.x;
          targetY = snap.y;
          targetWidth = snap.width;
          targetHeight = snap.height;
        } else if (win.snappedSide) {
          const snap = calculateWindowSnap(
            win.snappedSide,
            window.innerWidth,
            window.innerHeight,
            taskbarSettings.position,
            52,
            taskbarSettings.mode === 'dock'
          );
          targetX = snap.x;
          targetY = snap.y;
          targetWidth = snap.width;
          targetHeight = snap.height;
        }

        let transformStr = 'scale(1) translateY(0)';
        let opacityVal = 1;
        let pointerEventsVal: React.CSSProperties['pointerEvents'] = 'auto';
        let visibilityVal: React.CSSProperties['visibility'] = 'visible';

        if (isMinimized) {
          transformStr = 'scale(0.88) translateY(28px)';
          opacityVal = 0;
          pointerEventsVal = 'none';
          visibilityVal = 'hidden';
        } else if (isClosing) {
          transformStr = 'scale(0.92) translateY(10px)';
          opacityVal = 0;
          pointerEventsVal = 'none';
        }

        const styleObj: React.CSSProperties = {
          zIndex: win.zIndex,
          left: `${targetX}px`,
          top: `${targetY}px`,
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          transform: transformStr,
          opacity: opacityVal,
          pointerEvents: pointerEventsVal,
          visibility: visibilityVal,
        };

        const handlePosition: Record<ResizeEdge, React.CSSProperties> = {
          n: { top: 0, left: 8, right: 8, height: 5, cursor: RESIZE_CURSOR.n },
          s: { bottom: 0, left: 8, right: 8, height: 5, cursor: RESIZE_CURSOR.s },
          w: { left: 0, top: 8, bottom: 8, width: 5, cursor: RESIZE_CURSOR.w },
          e: { right: 0, top: 8, bottom: 8, width: 5, cursor: RESIZE_CURSOR.e },
          nw: { top: 0, left: 0, width: 12, height: 12, cursor: RESIZE_CURSOR.nw },
          ne: { top: 0, right: 0, width: 12, height: 12, cursor: RESIZE_CURSOR.ne },
          sw: { bottom: 0, left: 0, width: 12, height: 12, cursor: RESIZE_CURSOR.sw },
          se: { bottom: 0, right: 0, width: 12, height: 12, cursor: RESIZE_CURSOR.se },
        };

        const isRestorable = win.isMaximized || !!win.snappedSide;

        return (
          <div
            key={win.id}
            role="dialog"
            aria-label={win.title}
            aria-hidden={isMinimized || isClosing ? true : undefined}
            onMouseDown={() => onFocusWindow(win.id)}
            onAnimationEnd={(e) => {
              if (e.animationName === 'windowOpen') {
                setOpeningIds((prev) => prev.filter((id) => id !== win.id));
              }
            }}
            className={`absolute flex flex-col rounded-xl overflow-hidden border ${
              acrylicEnabled ? 'glass-acrylic' : ''
            } ${!isInteracting ? 'window-transition-smooth' : ''} ${
              isOpening && !isMinimized && !isClosing ? 'window-anim-open' : ''
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
              onDoubleClick={() => {
                if (win.snappedSide) {
                  onRestoreWindow(win.id);
                } else {
                  onToggleMaximizeWindow(win.id);
                }
              }}
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
                  onClick={() => {
                    if (win.snappedSide) {
                      onRestoreWindow(win.id);
                    } else {
                      onToggleMaximizeWindow(win.id);
                    }
                  }}
                  aria-label={isRestorable ? 'Restaurar janela' : 'Maximizar janela'}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-slate-200/80 dark:hover:bg-white/10 active:scale-95 transition-colors text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  title={isRestorable ? 'Restaurar' : 'Maximizar'}
                >
                  {isRestorable ? (
                    <Copy className="w-3 h-3" />
                  ) : (
                    <Square className="w-2.5 h-2.5" />
                  )}
                </button>
                <button
                  onClick={() => handleRequestClose(win.id)}
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

            {/* Resize handles (hidden while maximized, edge-snapped, minimized or closing) */}
            {!win.isMaximized && !win.snappedSide && !isMinimized && !isClosing &&
              RESIZE_HANDLES.map((edge) => (
                <div
                  key={edge}
                  aria-hidden="true"
                  data-resize-edge={edge}
                  onMouseDown={(e) => handleMouseDownResize(e, win, edge)}
                  className="absolute z-10 transition-colors hover:bg-accent-soft"
                  style={handlePosition[edge]}
                />
              ))}
          </div>
        );
      })}

      {/* Aero Snap Translucent Preview Overlay */}
      {activeSnapPreview && (() => {
        const snapGeom = calculateWindowSnap(
          activeSnapPreview,
          window.innerWidth,
          window.innerHeight,
          taskbarSettings.position,
          52,
          taskbarSettings.mode === 'dock'
        );
        return (
          <div
            aria-hidden="true"
            data-testid="aero-snap-preview"
            className="fixed pointer-events-none rounded-2xl transition-all duration-150 ease-out z-15 border-2 border-accent/80"
            style={{
              left: `${snapGeom.x}px`,
              top: `${snapGeom.y}px`,
              width: `${snapGeom.width}px`,
              height: `${snapGeom.height}px`,
              backgroundColor: isDark ? 'rgba(37, 99, 235, 0.16)' : 'rgba(37, 99, 235, 0.12)',
              backdropFilter: 'blur(16px) saturate(140%)',
              boxShadow: '0 0 35px rgba(37, 99, 235, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.2)',
            }}
          >
            <div className="absolute inset-2 rounded-xl border border-white/25 border-dashed" />
          </div>
        );
      })()}
    </div>
  );
};
