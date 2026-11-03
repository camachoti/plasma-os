/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  TaskbarSettings,
  WindowState,
  WALLPAPERS,
  ACCENT_COLORS,
  DesktopIconSize,
} from './utils/desktopConfig';
import { Taskbar } from './components/Taskbar';
import { StartMenu, APPS_CATALOG } from './components/StartMenu';
import { QuickSettings } from './components/QuickSettings';
import { CalendarFlyout } from './components/CalendarFlyout';
import { NotificationCenter, NotificationItem } from './components/NotificationCenter';
import { WindowManager } from './components/WindowManager';
import { DesktopIcons } from './components/DesktopIcons';
import { DesktopContextMenu } from './components/DesktopContextMenu';
import { TaskViewOverview } from './components/TaskViewOverview';

// Persisted desktop preferences (survive reloads)
const SETTINGS_KEY = 'debian-silk:settings';

interface PersistedSettings {
  taskbarSettings?: Partial<TaskbarSettings>;
  currentWallpaper?: string;
  accentColor?: string;
  isDark?: boolean;
  acrylicEnabled?: boolean;
  desktopIconSize?: DesktopIconSize;
}

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

function sanitizeTaskbarSettings(raw: unknown): Partial<TaskbarSettings> {
  if (typeof raw !== 'object' || raw === null) return {};
  const src = raw as Record<string, unknown>;
  const clean: Partial<TaskbarSettings> = {};

  if (isOneOf(src.position, ['top', 'bottom', 'left', 'right'])) clean.position = src.position;
  if (isOneOf(src.mode, ['dock', 'panel'])) clean.mode = src.mode;
  if (isOneOf(src.startMenuMode, ['conventional', 'expanded'])) clean.startMenuMode = src.startMenuMode;
  if (isOneOf(src.size, ['compact', 'standard', 'large'])) clean.size = src.size;
  if (isOneOf(src.blur, ['none', 'subtle', 'medium', 'ultra'])) clean.blur = src.blur;
  if (typeof src.opacity === 'number' && src.opacity >= 20 && src.opacity <= 100) {
    clean.opacity = src.opacity;
  }
  for (const flag of [
    'autoHide',
    'centeredIcons',
    'showDesktopButton',
    'showSeconds',
    'showCalendar',
    'showQuickSettings',
    'iconGlow',
  ] as const) {
    if (typeof src[flag] === 'boolean') clean[flag] = src[flag];
  }
  return clean;
}

function loadPersistedSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      ...parsed,
      taskbarSettings: sanitizeTaskbarSettings(parsed.taskbarSettings),
    };
  } catch {
    // Corrupted or inaccessible storage: fall back to defaults
    return {};
  }
}

export default function App() {
  const [persisted] = useState<PersistedSettings>(loadPersistedSettings);

  // Desktop Taskbar Customization State
  const [taskbarSettings, setTaskbarSettings] = useState<TaskbarSettings>({
    position: 'bottom',
    mode: 'dock',
    startMenuMode: 'conventional',
    size: 'standard',
    opacity: 85,
    blur: 'medium',
    autoHide: false,
    centeredIcons: true,
    showDesktopButton: true,
    showSeconds: false,
    showCalendar: true,
    showQuickSettings: true,
    iconGlow: false,
    ...persisted.taskbarSettings,
  });

  // Wallpaper & Theme state - Dignified default (validated against known values)
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(() =>
    WALLPAPERS.some((wp) => wp.path === persisted.currentWallpaper)
      ? persisted.currentWallpaper!
      : WALLPAPERS[0].path
  );
  const [accentColor, setAccentColor] = useState<string>(() =>
    ACCENT_COLORS.some((col) => col.hex === persisted.accentColor)
      ? persisted.accentColor!
      : ACCENT_COLORS[0].hex
  );
  const [isDark, setIsDark] = useState<boolean>(persisted.isDark ?? true);
  const [acrylicEnabled, setAcrylicEnabled] = useState<boolean>(persisted.acrylicEnabled ?? true);
  const [desktopIconSize, setDesktopIconSize] = useState<DesktopIconSize>(
    persisted.desktopIconSize ?? 'medium'
  );

  // Window Management State
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'win-settings',
      appId: 'settings',
      title: 'Configurações do Sistema',
      icon: '⚙️',
      x: 120,
      y: 60,
      width: 740,
      height: 500,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
    },
    {
      id: 'win-terminal',
      appId: 'terminal',
      title: 'Terminal - debian@debian-trixie:~',
      icon: '📟',
      x: 360,
      y: 150,
      width: 660,
      height: 420,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
    },
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-settings');
  const [nextZIndex, setNextZIndex] = useState<number>(20);

  // Popovers & Drawers State
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);

  // Desktop Context Menu State
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);

  // Screenshot flash effect state
  const [screenshotFlash, setScreenshotFlash] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Debian 13 (Trixie) Inicializado',
      message: 'Compositor Wayland e ambiente Silk Desktop ativos.',
      time: 'Agora',
      type: 'system',
    },
    {
      id: 'notif-2',
      title: 'Barra de Tarefas Personalizável',
      message: 'Alterne entre Modo Dock e Painel, ou reposicione na tela.',
      time: '1 min',
      type: 'info',
    },
    {
      id: 'notif-3',
      title: 'Atualização de Segurança Aplicada',
      message: 'Kernel Linux 6.12.9-amd64 com módulos carregados.',
      time: '4 min',
      type: 'security',
    },
  ]);

  // Persist preferences whenever they change
  useEffect(() => {
    const settings: PersistedSettings = {
      taskbarSettings,
      currentWallpaper,
      accentColor,
      isDark,
      acrylicEnabled,
      desktopIconSize,
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Storage full or blocked: preferences simply won't persist
    }
  }, [taskbarSettings, currentWallpaper, accentColor, isDark, acrylicEnabled, desktopIconSize]);

  // Update root dark class when theme toggles
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Publish the selected accent color as a CSS variable so every
  // bg-accent / text-accent / border-accent utility follows it
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStartMenuOpen(false);
        setIsQuickSettingsOpen(false);
        setIsCalendarOpen(false);
        setIsNotificationsOpen(false);
        setIsTaskViewOpen(false);
        setDesktopContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Window actions
  const handleOpenApp = (appId: string) => {
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: nextZIndex }
            : w
        )
      );
      setActiveWindowId(existing.id);
      setNextZIndex((z) => z + 1);
      return;
    }

    const catalogItem = APPS_CATALOG.find((a) => a.id === appId);
    const title = catalogItem ? catalogItem.name : appId;
    const icons: Record<string, string> = {
      settings: '⚙️',
      terminal: '📟',
      files: '📁',
      store: '🛍️',
      monitor: '⚡',
      editor: '📝',
      browser: '🌐',
      calc: '🧮',
      gallery: '🖼️',
      audio: '🎵',
    };

    const newWindow: WindowState = {
      id: `win-${appId}-${Date.now()}`,
      appId,
      title,
      icon: icons[appId] || '📄',
      x: 100 + ((windows.length * 35) % 180),
      y: 50 + ((windows.length * 25) % 130),
      width: appId === 'terminal' ? 660 : appId === 'settings' ? 740 : 680,
      height: appId === 'terminal' ? 420 : appId === 'settings' ? 500 : 440,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex((z) => z + 1);
  };

  const handleFocusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((z) => z + 1);
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleToggleWindow = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.isMinimized) {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w))
      );
      setActiveWindowId(id);
      setNextZIndex((z) => z + 1);
    } else if (activeWindowId === id) {
      handleMinimizeWindow(id);
    } else {
      handleFocusWindow(id);
    }
  };

  const handleToggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const handleUpdateWindowPos = (id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  const handleShowDesktop = () => {
    const allMinimized = windows.every((w) => w.isMinimized);
    setWindows((prev) =>
      prev.map((w) => ({ ...w, isMinimized: !allMinimized }))
    );
    if (!allMinimized) {
      setActiveWindowId(null);
    }
  };

  const handleTakeScreenshot = () => {
    setScreenshotFlash(true);
    setTimeout(() => setScreenshotFlash(false), 200);

    const newNotif: NotificationItem = {
      id: `screenshot-${Date.now()}`,
      title: 'Captura de Tela Salva',
      message: 'Imagem gravada em /home/debian/Imagens/Captura.png',
      time: 'Agora',
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateTaskbarSettings = (newSettings: Partial<TaskbarSettings>) => {
    setTaskbarSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none ${
        isDark ? 'dark' : ''
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        setDesktopContextMenu({ x: e.clientX, y: e.clientY });
        setIsStartMenuOpen(false);
        setIsQuickSettingsOpen(false);
        setIsCalendarOpen(false);
        setIsNotificationsOpen(false);
      }}
      onClick={() => {
        setDesktopContextMenu(null);
        setSelectedDesktopIcon(null);
      }}
    >
      {/* Desktop Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentWallpaper}
          alt="Papel de Parede Oficial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-opacity duration-500 pointer-events-none"
        />
        {/* Subtle contrast gradient for desktop legibility */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* Desktop Icons */}
      <DesktopIcons
        onOpenApp={handleOpenApp}
        selectedId={selectedDesktopIcon}
        onSelect={setSelectedDesktopIcon}
        accentColor={accentColor}
        iconSize={desktopIconSize}
      />

      {/* Floating Application Windows */}
      <WindowManager
        windows={windows}
        activeWindowId={activeWindowId}
        onFocusWindow={handleFocusWindow}
        onCloseWindow={handleCloseWindow}
        onMinimizeWindow={handleMinimizeWindow}
        onToggleMaximizeWindow={handleToggleMaximizeWindow}
        onUpdateWindowPos={handleUpdateWindowPos}
        taskbarSettings={taskbarSettings}
        accentColor={accentColor}
        isDark={isDark}
        acrylicEnabled={acrylicEnabled}
        onUpdateSettings={handleUpdateTaskbarSettings}
        currentWallpaper={currentWallpaper}
        onSelectWallpaper={setCurrentWallpaper}
        onSelectAccentColor={setAccentColor}
        onToggleTheme={() => setIsDark(!isDark)}
        onToggleAcrylic={() => setAcrylicEnabled(!acrylicEnabled)}
        desktopIconSize={desktopIconSize}
        onUpdateDesktopIconSize={setDesktopIconSize}
      />

      {/* Taskbar */}
      <Taskbar
        settings={taskbarSettings}
        isDark={isDark}
        accentColor={accentColor}
        openWindows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={handleToggleWindow}
        onOpenApp={handleOpenApp}
        onToggleStartMenu={() => {
          setIsStartMenuOpen(!isStartMenuOpen);
          setIsQuickSettingsOpen(false);
          setIsCalendarOpen(false);
          setIsNotificationsOpen(false);
        }}
        isStartMenuOpen={isStartMenuOpen}
        onToggleQuickSettings={() => {
          setIsQuickSettingsOpen(!isQuickSettingsOpen);
          setIsStartMenuOpen(false);
          setIsCalendarOpen(false);
          setIsNotificationsOpen(false);
        }}
        isQuickSettingsOpen={isQuickSettingsOpen}
        onToggleCalendar={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setIsStartMenuOpen(false);
          setIsQuickSettingsOpen(false);
          setIsNotificationsOpen(false);
        }}
        isCalendarOpen={isCalendarOpen}
        onToggleNotifications={() => {
          setIsNotificationsOpen(!isNotificationsOpen);
          setIsStartMenuOpen(false);
          setIsQuickSettingsOpen(false);
          setIsCalendarOpen(false);
        }}
        isNotificationsOpen={isNotificationsOpen}
        onToggleTaskView={() => setIsTaskViewOpen(!isTaskViewOpen)}
        isTaskViewOpen={isTaskViewOpen}
        onShowDesktop={handleShowDesktop}
        onOpenTaskbarSettings={() => handleOpenApp('settings')}
        unreadNotificationsCount={notifications.length}
      />

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenApp={handleOpenApp}
        taskbarPosition={taskbarSettings.position}
        taskbarMode={taskbarSettings.mode}
        startMenuMode={taskbarSettings.startMenuMode}
        accentColor={accentColor}
        isDark={isDark}
      />

      {/* Quick Settings */}
      <QuickSettings
        isOpen={isQuickSettingsOpen}
        onClose={() => setIsQuickSettingsOpen(false)}
        taskbarPosition={taskbarSettings.position}
        taskbarMode={taskbarSettings.mode}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        accentColor={accentColor}
        onTakeScreenshot={handleTakeScreenshot}
        acrylicEnabled={acrylicEnabled}
        onToggleAcrylic={() => setAcrylicEnabled(!acrylicEnabled)}
      />

      {/* Calendar Flyout */}
      <CalendarFlyout
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        taskbarPosition={taskbarSettings.position}
        taskbarMode={taskbarSettings.mode}
        isDark={isDark}
        accentColor={accentColor}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        taskbarPosition={taskbarSettings.position}
        taskbarMode={taskbarSettings.mode}
        isDark={isDark}
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        onClearAll={() => setNotifications([])}
        accentColor={accentColor}
      />

      {/* Task View Overview */}
      <TaskViewOverview
        isOpen={isTaskViewOpen}
        onClose={() => setIsTaskViewOpen(false)}
        windows={windows}
        onSelectWindow={handleFocusWindow}
        onCloseWindow={handleCloseWindow}
        accentColor={accentColor}
      />

      {/* Context Menu */}
      {desktopContextMenu && (
        <DesktopContextMenu
          x={desktopContextMenu.x}
          y={desktopContextMenu.y}
          onClose={() => setDesktopContextMenu(null)}
          onOpenApp={handleOpenApp}
          onOpenTaskbarSettings={() => handleOpenApp('settings')}
          onRefreshDesktop={() => setDesktopContextMenu(null)}
          desktopIconSize={desktopIconSize}
          onUpdateDesktopIconSize={setDesktopIconSize}
          isDark={isDark}
        />
      )}

      {/* Screenshot Flash */}
      {screenshotFlash && (
        <div className="fixed inset-0 z-[200] bg-white/60 pointer-events-none animate-out fade-out duration-200" />
      )}
    </div>
  );
}
