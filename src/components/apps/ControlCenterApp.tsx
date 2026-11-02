import React, { useState } from 'react';
import {
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Info,
  Check,
  Layout,
  Sun,
  Moon,
  Shield,
  Monitor,
  LayoutGrid,
  Maximize2,
} from 'lucide-react';
import {
  TaskbarSettings,
  WALLPAPERS,
  ACCENT_COLORS,
  TaskbarPosition,
  TaskbarSize,
  BlurIntensity,
  DesktopIconSize,
} from '../../utils/desktopConfig';

interface ControlCenterAppProps {
  settings: TaskbarSettings;
  onUpdateSettings: (newSettings: Partial<TaskbarSettings>) => void;
  currentWallpaper: string;
  onSelectWallpaper: (path: string) => void;
  accentColor: string;
  onSelectAccentColor: (hex: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  acrylicEnabled: boolean;
  onToggleAcrylic: () => void;
  desktopIconSize?: DesktopIconSize;
  onUpdateDesktopIconSize?: (size: DesktopIconSize) => void;
}

export const ControlCenterApp: React.FC<ControlCenterAppProps> = ({
  settings,
  onUpdateSettings,
  currentWallpaper,
  onSelectWallpaper,
  accentColor,
  onSelectAccentColor,
  isDark,
  onToggleTheme,
  acrylicEnabled,
  onToggleAcrylic,
  desktopIconSize = 'medium',
  onUpdateDesktopIconSize,
}) => {
  const [activeTab, setActiveTab] = useState<'taskbar' | 'wallpaper' | 'appearance' | 'system'>('taskbar');

  return (
    <div className="flex h-full text-slate-800 dark:text-slate-100 select-none overflow-hidden text-xs">
      {/* Sidebar Rail */}
      <div className="w-52 p-2.5 flex flex-col gap-1 border-r border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-black/20 shrink-0">
        <div className="px-3 py-2 mb-1">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">Configurações</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Debian Silk Desktop</p>
        </div>

        <button
          onClick={() => setActiveTab('taskbar')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'taskbar'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Barra de Tarefas</span>
        </button>

        <button
          onClick={() => setActiveTab('wallpaper')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'wallpaper'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Plano de Fundo</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'appearance'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Aparência & Vidro</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'system'
              ? 'bg-blue-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Sobre o Sistema</span>
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-50/40 dark:bg-black/5">
        {/* Tab 1: Taskbar */}
        {activeTab === 'taskbar' && (
          <div className="max-w-2xl flex flex-col gap-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Barra de Tarefas & Dock
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Personalize o comportamento, dimensões e ancoragem do painel.
              </p>
            </div>

            {/* Mode: Floating Dock vs Edge Panel */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Modo da Barra
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onUpdateSettings({ mode: 'dock' })}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    settings.mode === 'dock'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-white dark:bg-blue-600/20'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Dock Flutuante</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Estilo OpenKylin / macOS com cantos arredondados
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onUpdateSettings({ mode: 'panel' })}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    settings.mode === 'panel'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-white dark:bg-blue-600/20'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Painel Estendido</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Barra contínua de ponta a ponta clássica do Linux
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Start Menu Mode: Conventional vs Expanded */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tipo do Menu Iniciar
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onUpdateSettings({ startMenuMode: 'conventional' })}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    settings.startMenuMode === 'conventional'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-white dark:bg-blue-600/20'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Convencional</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Menu compacto clássico estilo desktop Debian Silk
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onUpdateSettings({ startMenuMode: 'expanded' })}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    settings.startMenuMode === 'expanded'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-white dark:bg-blue-600/20'
                      : 'border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Expandido</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Visão em tela cheia (Launchpad) com grade ampla de apps
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Position */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Posição na Tela
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['bottom', 'top', 'left', 'right'] as TaskbarPosition[]).map((pos) => {
                  const isSelected = settings.position === pos;
                  const labels = {
                    bottom: 'Inferior',
                    top: 'Superior',
                    left: 'Esquerda',
                    right: 'Direita',
                  };
                  return (
                    <button
                      key={pos}
                      onClick={() => onUpdateSettings({ position: pos })}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      {labels[pos]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Opacity */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Opacidade do Painel
                </span>
                <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-300">{settings.opacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={settings.opacity}
                onChange={(e) => onUpdateSettings({ opacity: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Translúcido</span>
                <span>Equilibrado</span>
                <span>Opaco</span>
              </div>
            </div>

            {/* Blur */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Desfoque de Fundo (Blur)
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'none', label: 'Desativado' },
                    { id: 'subtle', label: 'Sutil (10px)' },
                    { id: 'medium', label: 'Médio (20px)' },
                    { id: 'ultra', label: 'Alto (30px)' },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onUpdateSettings({ blur: b.id as BlurIntensity })}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-medium transition-colors ${
                      settings.blur === b.id
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Dimensão da Barra
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'compact', label: 'Compacto (44px)' },
                    { id: 'standard', label: 'Padrão (52px)' },
                    { id: 'large', label: 'Espaçoso (64px)' },
                  ] as const
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdateSettings({ size: s.id as TaskbarSize })}
                    className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      settings.size === s.id
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Toggles */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Comportamento
              </span>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-slate-700 dark:text-slate-300">Centralizar ícones dos aplicativos</span>
                <input
                  type="checkbox"
                  checked={settings.centeredIcons}
                  onChange={(e) => onUpdateSettings({ centeredIcons: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-slate-700 dark:text-slate-300">Botão de mostrar área de trabalho na extremidade</span>
                <input
                  type="checkbox"
                  checked={settings.showDesktopButton}
                  onChange={(e) => onUpdateSettings({ showDesktopButton: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-slate-700 dark:text-slate-300">Mostrar segundos no relógio</span>
                <input
                  type="checkbox"
                  checked={settings.showSeconds}
                  onChange={(e) => onUpdateSettings({ showSeconds: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 2: Wallpapers */}
        {activeTab === 'wallpaper' && (
          <div className="max-w-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Planos de Fundo da Distribuição
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fotografias e composições sóbrias padrão do Debian GNU/Linux e UKUI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {WALLPAPERS.map((wp) => {
                const isSelected = currentWallpaper === wp.path;
                return (
                  <div
                    key={wp.id}
                    onClick={() => onSelectWallpaper(wp.path)}
                    className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all shadow-xs ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-md'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/25'
                    }`}
                  >
                    <img
                      src={wp.path}
                      alt={wp.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-white">
                            {wp.name}
                          </h4>
                          <span className="text-[10px] text-slate-300">
                            {wp.category} · {wp.tag}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Appearance */}
        {activeTab === 'appearance' && (
          <div className="max-w-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Cores & Efeitos Visuais
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ajuste o esquema de cor e a profundidade visual das janelas.
              </p>
            </div>

            {/* Dark / Light Toggle Card */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Esquema de Cores</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Alterna os tons do shell e das aplicações (Claro / Escuro)
                </p>
              </div>
              <div className="flex gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => {
                    if (isDark) onToggleTheme();
                  }}
                  className={`flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-medium transition-colors ${
                    !isDark
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Modo Claro</span>
                </button>
                <button
                  onClick={() => {
                    if (!isDark) onToggleTheme();
                  }}
                  className={`flex items-center gap-1.5 py-1 px-3 rounded-md text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-slate-800 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Modo Escuro</span>
                </button>
              </div>
            </div>

            {/* Accent color */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cor de Destaque
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ACCENT_COLORS.map((col) => {
                  const isSelected = accentColor === col.hex;
                  return (
                    <button
                      key={col.id}
                      onClick={() => onSelectAccentColor(col.hex)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 dark:bg-white/10 dark:border-white/30 font-semibold'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0 shadow-xs flex items-center justify-center text-white"
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      <span className="text-xs truncate text-slate-800 dark:text-white">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acrylic Blur toggle */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Efeito Acrílico nas Janelas</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Desfoque dinâmico de vidro nas barras e caixas de diálogo
                </p>
              </div>
              <button
                onClick={onToggleAcrylic}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                  acrylicEnabled
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/15'
                }`}
              >
                {acrylicEnabled ? 'Ativado' : 'Desativado'}
              </button>
            </div>

            {/* Desktop Icon Size card */}
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Ícones da Área de Trabalho</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Defina o dimensionamento da grade e dos títulos de aplicativos no desktop
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small', label: 'Pequeno', desc: 'Compacto (36px)' },
                  { id: 'medium', label: 'Médio', desc: 'Padrão (44px)' },
                  { id: 'large', label: 'Grande', desc: 'Amplo (56px)' },
                ].map((sz) => {
                  const isSelected = desktopIconSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      onClick={() => onUpdateDesktopIconSize?.(sz.id as DesktopIconSize)}
                      className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold shadow-xs'
                          : 'border-slate-200 hover:bg-slate-100 text-slate-700 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs">{sz.label}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {sz.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: System */}
        {activeTab === 'system' && (
          <div className="max-w-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Sobre o Sistema
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Informações da distribuição Debian GNU/Linux e componentes de base.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-700 flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Debian GNU/Linux 13 (Trixie)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Ambiente Desktop Silk (UKUI 4.2 / Wayland)
                </p>
                <div className="flex gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Kernel 6.12.9-amd64</span>
                  <span>·</span>
                  <span>x86_64</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Processador</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">AMD Ryzen 7 7840HS (16 vCPUs @ 5.1GHz)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Gráficos</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">AMD Radeon 780M</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Memória</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">16.0 GB RAM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 dark:text-slate-400">Disco</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">512 GB SSD (38 GB usados)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Ambiente Gráfico</span>
                <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">Silk-Shell v4.2.1-debian</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
