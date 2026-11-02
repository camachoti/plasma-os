import React, { useState } from 'react';
import {
  TaskbarSettings,
  WindowState,
  computeTaskbarLayout,
} from '../utils/desktopConfig';
import {
  IconDeviceDesktopFilled,
  IconFolderFilled,
  IconTerminal2,
  IconBuildingStore,
  IconCpu,
  IconSettingsFilled,
  IconLayoutGridFilled,
  IconWifi,
  IconVolume,
  IconBatteryFilled,
  IconBellFilled,
  IconAdjustmentsFilled,
} from '@tabler/icons-react';
import { StartIcon } from './StartIcon';

interface TaskbarProps {
  settings: TaskbarSettings;
  isDark: boolean;
  accentColor: string;
  openWindows: WindowState[];
  activeWindowId: string | null;
  onToggleWindow: (id: string) => void;
  onOpenApp: (appId: string) => void;
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
  onToggleQuickSettings: () => void;
  isQuickSettingsOpen: boolean;
  onToggleCalendar: () => void;
  isCalendarOpen: boolean;
  onToggleNotifications: () => void;
  isNotificationsOpen: boolean;
  onToggleTaskView: () => void;
  isTaskViewOpen: boolean;
  onShowDesktop: () => void;
  currentTime: Date;
  onOpenTaskbarSettings: () => void;
  unreadNotificationsCount: number;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  settings,
  isDark,
  accentColor,
  openWindows,
  activeWindowId,
  onToggleWindow,
  onOpenApp,
  onToggleStartMenu,
  isStartMenuOpen,
  onToggleQuickSettings,
  isQuickSettingsOpen,
  onToggleCalendar,
  isCalendarOpen,
  onToggleNotifications,
  isNotificationsOpen,
  onToggleTaskView,
  isTaskViewOpen,
  onShowDesktop,
  currentTime,
  onOpenTaskbarSettings,
  unreadNotificationsCount,
}) => {
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const { isHorizontal, thickness, style } = computeTaskbarLayout(settings, isDark);

  // Tabler filled, less-colorful, cohesive system icons with dual-theme porcelain/dark support
  const pinnedApps = [
    {
      id: 'files',
      name: 'Gerenciador de Arquivos',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors group-hover:text-slate-950 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700/80">
          <IconFolderFilled className="w-4.5 h-4.5" />
        </div>
      ),
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors group-hover:text-slate-950 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700/80">
          <IconTerminal2 className="w-4.5 h-4.5" />
        </div>
      ),
    },
    {
      id: 'store',
      name: 'Debian Software',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors group-hover:text-slate-950 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700/80">
          <IconBuildingStore className="w-4.5 h-4.5" />
        </div>
      ),
    },
    {
      id: 'monitor',
      name: 'Monitor do Sistema',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors group-hover:text-slate-950 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700/80">
          <IconCpu className="w-4.5 h-4.5" />
        </div>
      ),
    },
    {
      id: 'settings',
      name: 'Configurações',
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs transition-colors group-hover:text-slate-950 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-slate-700/80">
          <IconSettingsFilled className="w-4.5 h-4.5" />
        </div>
      ),
    },
  ];

  const runningAppIds = Array.from(new Set(openWindows.map((w) => w.appId)));
  const allAppIds = Array.from(new Set([...pinnedApps.map((a) => a.id), ...runningAppIds]));

  const getAppMeta = (id: string) => {
    const found = pinnedApps.find((a) => a.id === id);
    if (found) return found;
    return {
      id,
      name: id,
      icon: (
        <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs">
          <IconDeviceDesktopFilled className="w-4.5 h-4.5" />
        </div>
      ),
    };
  };

  const isDock = settings.mode === 'dock';

  let positionContainerClasses = '';
  if (settings.position === 'bottom') {
    positionContainerClasses = isDock
      ? 'bottom-2.5 left-1/2 -translate-x-1/2 max-w-[94vw] rounded-2xl px-2 py-1 border'
      : 'bottom-0 left-0 right-0 w-full px-3 border-t';
  } else if (settings.position === 'top') {
    positionContainerClasses = isDock
      ? 'top-2.5 left-1/2 -translate-x-1/2 max-w-[94vw] rounded-2xl px-2 py-1 border'
      : 'top-0 left-0 right-0 w-full px-3 border-b';
  } else if (settings.position === 'left') {
    positionContainerClasses = isDock
      ? 'left-2.5 top-1/2 -translate-y-1/2 max-h-[94vh] rounded-2xl px-1 py-2 border'
      : 'left-0 top-0 bottom-0 h-full py-3 border-r';
  } else if (settings.position === 'right') {
    positionContainerClasses = isDock
      ? 'right-2.5 top-1/2 -translate-y-1/2 max-h-[94vh] rounded-2xl px-1 py-2 border'
      : 'right-0 top-0 bottom-0 h-full py-3 border-l';
  }

  const formatHours = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: settings.showSeconds ? '2-digit' : undefined,
    hour12: false,
  });

  const formatDate = currentTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <>
      <div
        data-silk-taskbar="true"
        className={`fixed z-50 flex items-center transition-all duration-200 select-none ${positionContainerClasses}`}
        style={{
          ...style,
          height: isHorizontal ? `${thickness}px` : undefined,
          width: !isHorizontal ? `${thickness}px` : undefined,
          flexDirection: isHorizontal ? 'row' : 'column',
          justifyContent: 'space-between',
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenuPos({ x: e.clientX, y: e.clientY });
        }}
      >
        {/* Left Section: Start Menu & Task View */}
        <div
          className={`flex items-center gap-1 ${
            isHorizontal ? 'flex-row' : 'flex-col'
          }`}
        >
          {/* Start Menu Button (Clean Monochrome Debian Swirl Badge) */}
          <button
            aria-label="Abrir Menu Iniciar Silk Debian"
            onClick={onToggleStartMenu}
            className={`relative p-1 rounded-xl transition-colors duration-150 flex items-center justify-center ${
              isStartMenuOpen
                ? 'bg-slate-200/80 dark:bg-white/15'
                : 'hover:bg-slate-200/50 dark:hover:bg-white/10'
            }`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/85 dark:bg-slate-800/90 border border-slate-300/70 dark:border-white/15 text-slate-800 dark:text-slate-100 shadow-xs transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
              <StartIcon style={settings.startIconStyle || 'debian'} className="w-4.5 h-4.5" />
            </div>
            {isStartMenuOpen && (
              <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-white" />
            )}
          </button>

          {/* Task View / Overview (Tabler filled grid) */}
          <button
            aria-label="Visão de Tarefas (Exposé)"
            onClick={onToggleTaskView}
            className={`p-2 rounded-xl transition-colors duration-150 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white ${
              isTaskViewOpen ? 'bg-slate-200/80 dark:bg-white/20' : 'hover:bg-slate-200/50 dark:hover:bg-white/10'
            }`}
            title="Visão de Janelas (Exposé)"
          >
            <IconLayoutGridFilled className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Center Section: App Icons */}
        <div
          className={`flex items-center gap-1.5 overflow-visible px-2 ${
            isHorizontal ? 'flex-row' : 'flex-col'
          } ${settings.centeredIcons ? 'justify-center flex-1' : 'justify-start'}`}
        >
          {allAppIds.map((appId) => {
            const app = getAppMeta(appId);
            const appWindows = openWindows.filter((w) => w.appId === appId);
            const isRunning = appWindows.length > 0;
            const hasActiveWindow = appWindows.some((w) => w.id === activeWindowId && !w.isMinimized);

            return (
              <div
                key={appId}
                className="relative group"
                onMouseEnter={() => setHoveredAppId(appId)}
                onMouseLeave={() => setHoveredAppId(null)}
              >
                <button
                  aria-label={`Aplicativo ${app.name}`}
                  onClick={() => {
                    if (isRunning) {
                      const targetWin = appWindows[0];
                      onToggleWindow(targetWin.id);
                    } else {
                      onOpenApp(appId);
                    }
                  }}
                  className={`relative p-1.5 rounded-xl transition-all duration-150 flex items-center justify-center ${
                    hasActiveWindow
                      ? 'bg-slate-200/80 dark:bg-white/15'
                      : isRunning
                      ? 'bg-slate-200/40 dark:bg-white/5 hover:bg-slate-200/60 dark:hover:bg-white/10'
                      : 'hover:bg-slate-200/50 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="transition-transform duration-150 active:scale-95">
                    {app.icon}
                  </div>

                  {/* Clean OS Running Indicator */}
                  {isRunning && (
                    <span
                      className={`absolute rounded-full transition-all duration-200 ${
                        isHorizontal
                          ? 'bottom-0 left-1/2 -translate-x-1/2'
                          : 'left-0 top-1/2 -translate-y-1/2'
                      } ${
                        hasActiveWindow
                          ? isHorizontal ? 'w-3 h-1 bg-slate-900 dark:bg-white' : 'w-1 h-3 bg-slate-900 dark:bg-white'
                          : 'w-1 h-1 bg-slate-500 dark:bg-slate-400'
                      }`}
                    />
                  )}
                </button>

                {/* Tooltip */}
                {hoveredAppId === appId && (
                  <div
                    className={`absolute z-50 pointer-events-none px-2.5 py-1 text-xs rounded-lg whitespace-nowrap shadow-md glass-subtle border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-medium bg-white/95 dark:bg-slate-900/95 ${
                      settings.position === 'bottom'
                        ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                        : settings.position === 'top'
                        ? 'top-full mt-2 left-1/2 -translate-x-1/2'
                        : settings.position === 'left'
                        ? 'left-full ml-2 top-1/2 -translate-y-1/2'
                        : 'right-full mr-2 top-1/2 -translate-y-1/2'
                    }`}
                  >
                    <span>{app.name}</span>
                    {isRunning && (
                      <span className="ml-1 text-slate-500 dark:text-slate-400 text-[10px]">
                        ({appWindows.length})
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Section: System Tray & Clock with Tabler filled/clean icons */}
        <div
          className={`flex items-center gap-1 text-slate-700 dark:text-slate-300 ${
            isHorizontal ? 'flex-row' : 'flex-col'
          }`}
        >
          {/* Quick Settings Action Pill */}
          <button
            aria-label="Central de Ações e Conexões"
            onClick={onToggleQuickSettings}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-colors text-xs ${
              isQuickSettingsOpen
                ? 'bg-slate-200/80 dark:bg-white/20 text-slate-950 dark:text-white'
                : 'hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
            }`}
          >
            <IconWifi className="w-4 h-4" />
            <IconVolume className="w-4 h-4" />
            <IconBatteryFilled className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Clock & Calendar */}
          {settings.showCalendar && (
            <button
              aria-label="Abrir Calendário do Sistema"
              onClick={onToggleCalendar}
              className={`flex items-center justify-center px-2 py-1 rounded-xl transition-colors text-xs tabular-nums text-slate-800 dark:text-slate-200 ${
                isCalendarOpen
                  ? 'bg-slate-200/80 dark:bg-white/20 text-slate-950 dark:text-white font-semibold'
                  : 'hover:bg-slate-200/50 dark:hover:bg-white/10'
              } ${isHorizontal ? 'flex-col leading-tight' : 'flex-col'}`}
            >
              <span className="font-semibold text-slate-900 dark:text-white text-[11px]">{formatHours}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{formatDate}</span>
            </button>
          )}

          {/* Notifications button with Tabler filled bell */}
          <button
            aria-label="Central de Notificações"
            onClick={onToggleNotifications}
            className={`relative p-2 rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white ${
              isNotificationsOpen ? 'bg-slate-200/80 dark:bg-white/20' : 'hover:bg-slate-200/50 dark:hover:bg-white/10'
            }`}
          >
            <IconBellFilled className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Taskbar settings shortcut with Tabler filled adjustments */}
          <button
            aria-label="Painel de Controle Rápido"
            onClick={onOpenTaskbarSettings}
            className="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            title="Personalizar Barra"
          >
            <IconAdjustmentsFilled className="w-4 h-4" />
          </button>

          {/* Show Desktop Button */}
          {settings.showDesktopButton && (
            <button
              aria-label="Mostrar Área de Trabalho"
              onClick={onShowDesktop}
              className={`transition-colors rounded-xs hover:bg-slate-400/30 dark:hover:bg-white/25 ${
                isHorizontal
                  ? 'w-2 h-6 ml-1 border-l border-slate-300/80 dark:border-white/15'
                  : 'h-2 w-6 mt-1 border-t border-slate-300/80 dark:border-white/15'
              }`}
              title="Mostrar Área de Trabalho"
            />
          )}
        </div>
      </div>

      {/* Right-click Context Menu */}
      {contextMenuPos && (
        <div
          className="fixed z-[100] w-60 rounded-xl glass-subtle p-1 text-xs text-slate-800 dark:text-slate-200 shadow-xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 animate-in fade-in zoom-in-95 duration-100"
          style={{
            top: Math.min(contextMenuPos.y, window.innerHeight - 180),
            left: Math.min(contextMenuPos.x, window.innerWidth - 250),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 mb-1 text-[11px]">
            Configuração da Barra Silk
          </div>

          <button
            onClick={() => {
              onOpenTaskbarSettings();
              setContextMenuPos(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
          >
            <span>Personalizar Barra...</span>
            <IconAdjustmentsFilled className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => {
              onShowDesktop();
              setContextMenuPos(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            Mostrar Área de Trabalho
          </button>

          <button
            onClick={() => {
              onToggleTaskView();
              setContextMenuPos(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
          >
            <span>Visão de Janelas</span>
            <IconLayoutGridFilled className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>
      )}

      {contextMenuPos && (
        <div
          className="fixed inset-0 z-[99]"
          onClick={() => setContextMenuPos(null)}
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenuPos(null);
          }}
        />
      )}
    </>
  );
};
