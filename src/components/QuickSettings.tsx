import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Bluetooth,
  Moon,
  Sun,
  Eye,
  Camera,
  BellOff,
  Sparkles,
  Volume2,
  SunMedium,
  Music,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';
import { TaskbarPosition, TaskbarMode } from '../utils/desktopConfig';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  taskbarPosition: TaskbarPosition;
  taskbarMode?: TaskbarMode;
  isDark: boolean;
  onToggleTheme: () => void;
  accentColor: string;
  onTakeScreenshot: () => void;
  acrylicEnabled: boolean;
  onToggleAcrylic: () => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({
  isOpen,
  onClose,
  taskbarPosition,
  taskbarMode = 'dock',
  isDark,
  onToggleTheme,
  accentColor,
  onTakeScreenshot,
  acrylicEnabled,
  onToggleAcrylic,
}) => {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [dockPosStyle, setDockPosStyle] = useState<React.CSSProperties>({});
  const [arrowOffset, setArrowOffset] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const calculatePosition = () => {
      if (taskbarMode !== 'dock') {
        setDockPosStyle({});
        setArrowOffset(null);
        return;
      }

      const qsBtn = document.querySelector('button[aria-label="Central de Ações e Conexões"]');
      const taskbarEl = document.querySelector('[data-silk-taskbar="true"]');

      if (qsBtn) {
        const btnRect = qsBtn.getBoundingClientRect();
        const taskbarRect = taskbarEl?.getBoundingClientRect();
        const popoverWidth = 320; // w-80 = 20rem = 320px
        const margin = 10;

        if (taskbarPosition === 'bottom') {
          const rightReference = taskbarRect
            ? Math.min(taskbarRect.right, btnRect.right + 120)
            : btnRect.right + 60;
          let targetLeft = rightReference - popoverWidth;
          targetLeft = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, targetLeft));
          const bottomDistance = window.innerHeight - btnRect.top + margin;

          setDockPosStyle({
            position: 'fixed',
            left: `${targetLeft}px`,
            bottom: `${bottomDistance}px`,
            top: 'auto',
            right: 'auto',
          });

          const arrowCenter = btnRect.left + btnRect.width / 2;
          setArrowOffset(arrowCenter - targetLeft);
        } else if (taskbarPosition === 'top') {
          const rightReference = taskbarRect
            ? Math.min(taskbarRect.right, btnRect.right + 120)
            : btnRect.right + 60;
          let targetLeft = rightReference - popoverWidth;
          targetLeft = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, targetLeft));
          const topDistance = btnRect.bottom + margin;

          setDockPosStyle({
            position: 'fixed',
            left: `${targetLeft}px`,
            top: `${topDistance}px`,
            bottom: 'auto',
            right: 'auto',
          });

          const arrowCenter = btnRect.left + btnRect.width / 2;
          setArrowOffset(arrowCenter - targetLeft);
        } else if (taskbarPosition === 'left') {
          const leftDistance = btnRect.right + margin;
          let targetBottom = window.innerHeight - btnRect.bottom;
          targetBottom = Math.max(16, Math.min(window.innerHeight - 440, targetBottom));

          setDockPosStyle({
            position: 'fixed',
            left: `${leftDistance}px`,
            bottom: `${targetBottom}px`,
            top: 'auto',
            right: 'auto',
          });
          setArrowOffset(null);
        } else if (taskbarPosition === 'right') {
          const rightDistance = window.innerWidth - btnRect.left + margin;
          let targetBottom = window.innerHeight - btnRect.bottom;
          targetBottom = Math.max(16, Math.min(window.innerHeight - 440, targetBottom));

          setDockPosStyle({
            position: 'fixed',
            right: `${rightDistance}px`,
            bottom: `${targetBottom}px`,
            top: 'auto',
            left: 'auto',
          });
          setArrowOffset(null);
        }
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen, taskbarMode, taskbarPosition]);

  if (!isOpen) return null;

  const isDock = taskbarMode === 'dock';

  let panelAnchorClasses = '';
  if (taskbarPosition === 'bottom') {
    panelAnchorClasses = 'bottom-15 right-4';
  } else if (taskbarPosition === 'top') {
    panelAnchorClasses = 'top-15 right-4';
  } else if (taskbarPosition === 'left') {
    panelAnchorClasses = 'bottom-4 left-15';
  } else if (taskbarPosition === 'right') {
    panelAnchorClasses = 'bottom-4 right-15';
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className={`fixed z-50 w-80 rounded-2xl glass-acrylic p-3.5 shadow-2xl border select-none animate-in fade-in zoom-in-95 duration-100 ${
          isDock ? '' : panelAnchorClasses
        }`}
        style={{
          ...(isDock ? dockPosStyle : {}),
          backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
          color: isDark ? '#f8fafc' : '#0f172a',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
          boxShadow: isDark
            ? '0 20px 48px rgba(0, 0, 0, 0.5)'
            : '0 20px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10 mb-3 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-300">
            Ações Rápidas
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">Bateria: 95%</span>
        </div>

        {/* Quick Toggles Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* WiFi */}
          <button
            onClick={() => setWifiEnabled(!wifiEnabled)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors text-xs ${
              wifiEnabled
                ? 'bg-accent text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
            }`}
          >
            <Wifi className="w-4 h-4 mb-1" />
            <span className="font-semibold text-[11px]">Wi-Fi</span>
            <span className="text-[9px] opacity-80">{wifiEnabled ? 'Conectado' : 'Desligado'}</span>
          </button>

          {/* Bluetooth */}
          <button
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors text-xs ${
              bluetoothEnabled
                ? 'bg-accent text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
            }`}
          >
            <Bluetooth className="w-4 h-4 mb-1" />
            <span className="font-semibold text-[11px]">Bluetooth</span>
            <span className="text-[9px] opacity-80">{bluetoothEnabled ? 'Ativo' : 'Desligado'}</span>
          </button>

          {/* Dark / Light Theme */}
          <button
            onClick={onToggleTheme}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-transparent transition-colors text-xs text-slate-800 dark:text-white"
          >
            {isDark ? <Moon className="w-4 h-4 mb-1 text-sky-400" /> : <Sun className="w-4 h-4 mb-1 text-amber-500" />}
            <span className="font-semibold text-[11px]">Tema</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{isDark ? 'Escuro' : 'Claro'}</span>
          </button>

          {/* Acrylic Glass Blur toggle */}
          <button
            onClick={onToggleAcrylic}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors text-xs ${
              acrylicEnabled
                ? 'bg-accent text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1" />
            <span className="font-semibold text-[11px]">Transparência</span>
            <span className="text-[9px] opacity-80">{acrylicEnabled ? 'Acrílica' : 'Opaca'}</span>
          </button>

          {/* Night Light */}
          <button
            onClick={() => setNightLight(!nightLight)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors text-xs ${
              nightLight
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
            }`}
          >
            <Eye className="w-4 h-4 mb-1" />
            <span className="font-semibold text-[11px]">Luz Noturna</span>
            <span className="text-[9px] opacity-80">{nightLight ? 'Ligada' : 'Desligada'}</span>
          </button>

          {/* Do Not Disturb */}
          <button
            onClick={() => setDoNotDisturb(!doNotDisturb)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors text-xs ${
              doNotDisturb
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10'
            }`}
          >
            <BellOff className="w-4 h-4 mb-1" />
            <span className="font-semibold text-[11px]">Silencioso</span>
            <span className="text-[9px] opacity-80">{doNotDisturb ? 'Ativo' : 'Desativado'}</span>
          </button>
        </div>

        {/* Sliders: Brightness & Volume */}
        <div className="flex flex-col gap-2.5 mb-3 p-2.5 rounded-xl bg-slate-100/90 dark:bg-black/20 border border-slate-200/80 dark:border-white/5">
          {/* Brightness */}
          <div className="flex items-center gap-2.5">
            <SunMedium className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 accent-accent h-1.5 rounded-lg cursor-pointer bg-slate-300 dark:bg-slate-700"
            />
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 w-7 text-right">{brightness}%</span>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-accent h-1.5 rounded-lg cursor-pointer bg-slate-300 dark:bg-slate-700"
            />
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 w-7 text-right">{volume}%</span>
          </div>
        </div>

        {/* Media Player */}
        <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-black/20 border border-slate-200/80 dark:border-white/5 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-accent-soft dark:bg-slate-700 flex items-center justify-center text-accent dark:text-slate-200 shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Debian Audio Studio</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">PipeWire Sound Server</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
            >
              {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors">
              <SkipForward className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Screenshot action */}
        <button
          onClick={onTakeScreenshot}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium text-slate-800 dark:text-white flex items-center justify-center gap-2 transition-colors border border-slate-200/80 dark:border-white/10 shadow-xs"
        >
          <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          <span>Capturar Tela</span>
        </button>
      </div>
    </>
  );
};
