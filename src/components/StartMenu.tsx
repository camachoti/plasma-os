import React, { useState, useEffect } from 'react';
import {
  IconSearch,
  IconPower,
  IconRefresh,
  IconLockFilled,
  IconX,
  IconFolderFilled,
  IconTerminal2,
  IconSettingsFilled,
  IconBuildingStore,
  IconCpu,
  IconFileFilled,
  IconWorld,
  IconCalculatorFilled,
} from '@tabler/icons-react';
import { TaskbarPosition, TaskbarMode, StartMenuMode } from '../utils/desktopConfig';

export interface AppDefinition {
  id: string;
  name: string;
  category: 'Sistema' | 'Desenvolvimento' | 'Escritório' | 'Multimídia' | 'Utilitários' | 'Internet';
  description: string;
  icon: React.ReactNode;
  version: string;
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  taskbarPosition: TaskbarPosition;
  taskbarMode?: TaskbarMode;
  startMenuMode?: StartMenuMode;
  accentColor: string;
  isDark: boolean;
}

export const APPS_CATALOG: AppDefinition[] = [
  {
    id: 'files',
    name: 'Gerenciador de Arquivos',
    category: 'Sistema',
    description: 'Explorador moderno de pastas, discos e arquivos do Debian',
    version: '4.2.0',
    icon: <IconFolderFilled className="w-5 h-5" />,
  },
  {
    id: 'terminal',
    name: 'Terminal Silk (Bash)',
    category: 'Desenvolvimento',
    description: 'Emulador de terminal Debian com suporte completo a comandos GNU',
    version: '5.2.32',
    icon: <IconTerminal2 className="w-5 h-5" />,
  },
  {
    id: 'settings',
    name: 'Central de Personalização',
    category: 'Sistema',
    description: 'Configuração da barra de tarefas, temas de vidro, papéis de parede e cores',
    version: '4.2.1',
    icon: <IconSettingsFilled className="w-5 h-5" />,
  },
  {
    id: 'store',
    name: 'Debian Software Hub',
    category: 'Sistema',
    description: 'Gerenciador de pacotes apt e repositórios da comunidade',
    version: '3.38.0',
    icon: <IconBuildingStore className="w-5 h-5" />,
  },
  {
    id: 'monitor',
    name: 'Monitor de Recursos',
    category: 'Sistema',
    description: 'Gráficos de CPU, memória RAM, disco e processos Debian',
    version: '2.4.0',
    icon: <IconCpu className="w-5 h-5" />,
  },
  {
    id: 'editor',
    name: 'Editor de Textos & Notas',
    category: 'Desenvolvimento',
    description: 'Editor de arquivos de configuração, scripts bash e markdown',
    version: '1.8.0',
    icon: <IconFileFilled className="w-5 h-5" />,
  },
  {
    id: 'browser',
    name: 'Navegador Firefox ESR',
    category: 'Internet',
    description: 'Navegação web estável e segura oficial da distribuição',
    version: '128.4',
    icon: <IconWorld className="w-5 h-5" />,
  },
  {
    id: 'calc',
    name: 'Calculadora',
    category: 'Utilitários',
    description: 'Cálculos padrão, científicos e conversões',
    version: '45.0',
    icon: <IconCalculatorFilled className="w-5 h-5" />,
  },
];

const CATEGORIES = [
  'Todos',
  'Sistema',
  'Desenvolvimento',
  'Internet',
  'Utilitários',
] as const;

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  taskbarPosition,
  taskbarMode = 'dock',
  startMenuMode = 'conventional',
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [powerDialog, setPowerDialog] = useState<'shutdown' | 'restart' | 'lock' | null>(null);
  const [dockPosStyle, setDockPosStyle] = useState<React.CSSProperties>({});

  const isExpanded = startMenuMode === 'expanded';

  useEffect(() => {
    if (!isOpen || isExpanded) return;

    const calculatePosition = () => {
      if (taskbarMode !== 'dock') {
        setDockPosStyle({});
        return;
      }

      const startBtn = document.querySelector('button[aria-label="Abrir Menu Iniciar Silk Debian"]');
      const taskbarEl = document.querySelector('[data-silk-taskbar="true"]');

      if (startBtn) {
        const btnRect = startBtn.getBoundingClientRect();
        const taskbarRect = taskbarEl?.getBoundingClientRect();
        const popoverWidth = 560;
        const margin = 10;

        if (taskbarPosition === 'bottom') {
          const leftReference = taskbarRect ? Math.max(16, taskbarRect.left) : Math.max(16, btnRect.left);
          let targetLeft = leftReference;
          targetLeft = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, targetLeft));
          const bottomDistance = window.innerHeight - btnRect.top + margin;

          setDockPosStyle({
            position: 'fixed',
            left: `${targetLeft}px`,
            bottom: `${bottomDistance}px`,
            top: 'auto',
            right: 'auto',
          });
        } else if (taskbarPosition === 'top') {
          const leftReference = taskbarRect ? Math.max(16, taskbarRect.left) : Math.max(16, btnRect.left);
          let targetLeft = leftReference;
          targetLeft = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, targetLeft));
          const topDistance = btnRect.bottom + margin;

          setDockPosStyle({
            position: 'fixed',
            left: `${targetLeft}px`,
            top: `${topDistance}px`,
            bottom: 'auto',
            right: 'auto',
          });
        } else if (taskbarPosition === 'left') {
          const leftDistance = btnRect.right + margin;
          let targetBottom = window.innerHeight - btnRect.bottom;
          targetBottom = Math.max(16, Math.min(window.innerHeight - 520, targetBottom));

          setDockPosStyle({
            position: 'fixed',
            left: `${leftDistance}px`,
            bottom: `${targetBottom}px`,
            top: 'auto',
            right: 'auto',
          });
        } else if (taskbarPosition === 'right') {
          const rightDistance = window.innerWidth - btnRect.left + margin;
          let targetBottom = window.innerHeight - btnRect.bottom;
          targetBottom = Math.max(16, Math.min(window.innerHeight - 520, targetBottom));

          setDockPosStyle({
            position: 'fixed',
            right: `${rightDistance}px`,
            bottom: `${targetBottom}px`,
            top: 'auto',
            left: 'auto',
          });
        }
      }
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen, isExpanded, taskbarMode, taskbarPosition]);

  if (!isOpen) return null;

  const filteredApps = APPS_CATALOG.filter((app) => {
    const matchesCategory =
      selectedCategory === 'Todos' || app.category === selectedCategory;
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  let panelAnchorStyle: React.CSSProperties = {};
  if (!isExpanded && taskbarMode !== 'dock') {
    if (taskbarPosition === 'bottom') {
      panelAnchorStyle = { bottom: '60px', left: '16px' };
    } else if (taskbarPosition === 'top') {
      panelAnchorStyle = { top: '60px', left: '16px' };
    } else if (taskbarPosition === 'left') {
      panelAnchorStyle = { left: '60px', bottom: '16px' };
    } else if (taskbarPosition === 'right') {
      panelAnchorStyle = { right: '60px', bottom: '16px' };
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {isExpanded ? (
        /* Fullscreen Launchpad Mode (Controlled by system setting) */
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-12 glass-acrylic bg-slate-950/85 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-white shadow">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-2.73.47-5.18-.89-5.91-3.32-.73-2.43.68-5.01 3.16-5.75 2.48-.74 5.06.67 5.79 3.1.25.83.21 1.68-.07 2.45l-1.9-.62c.16-.48.18-1 .03-1.52-.46-1.53-2.08-2.42-3.64-1.95-1.55.46-2.44 2.07-1.98 3.6.46 1.53 2.08 2.42 3.64 1.95.34-.1.66-.27.93-.49l1.45 1.45c-.44.42-.96.76-1.5 1.05z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-white tracking-wide">
                  Debian Aplicativos
                </h2>
                <p className="text-xs text-slate-400">UKUI Shell 4.2 • Modo Expandido</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fechar (Esc)"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-lg my-6 relative">
            <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Buscar aplicativos ou configurações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-md"
            />
          </div>

          {/* Apps Grid */}
          <div className="w-full max-w-4xl flex-1 overflow-y-auto py-4">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-6 justify-items-center">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-center group w-24"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-white/10 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 group-hover:border-white/25">
                    {app.icon}
                  </div>
                  <span className="text-xs text-slate-200 font-medium group-hover:text-white truncate max-w-full">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Launchpad Footer */}
          <div className="w-full max-w-4xl flex items-center justify-between pt-6 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Debian Silk OS v13 (Trixie)</span>
            </div>
            <span>Pressione Esc para fechar</span>
          </div>
        </div>
      ) : (
        /* Conventional Floating Window Menu */
        <div
          className="fixed z-50 w-[560px] h-[480px] rounded-2xl glass-acrylic p-4 shadow-2xl border flex flex-col select-none animate-in fade-in zoom-in-95 duration-100"
          style={{
            ...(taskbarMode === 'dock' ? dockPosStyle : panelAnchorStyle),
            backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            color: isDark ? '#f8fafc' : '#0f172a',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
            boxShadow: isDark
              ? '0 20px 48px rgba(0, 0, 0, 0.5)'
              : '0 20px 48px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search (without expand button, purely controlled by system setting) */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200/80 dark:border-white/10">
            <div className="relative flex-1">
              <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Pesquisar aplicativos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          {/* Main Content: Categories + Apps */}
          <div className="flex-1 flex gap-2.5 overflow-hidden py-2.5">
            {/* Rail */}
            <div className="w-32 flex flex-col gap-0.5 pr-1.5 border-r border-slate-200/80 dark:border-white/10 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2 py-1">
                Categorias
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors font-medium ${
                      isActive
                        ? 'bg-accent-soft border border-accent-soft text-slate-900 dark:text-white dark:bg-accent-strong dark:border-transparent font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* List with Tabler filled icons */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/90 dark:hover:bg-white/10 active:bg-slate-200/70 dark:active:bg-white/15 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shrink-0 shadow-xs text-slate-700 dark:text-slate-200">
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">
                      {app.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {app.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer: User profile + System controls */}
          <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent text-white font-bold text-xs flex items-center justify-center">
                D
              </div>
              <div>
                <span className="font-semibold text-xs text-slate-900 dark:text-white block leading-none">
                  debian
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400">Usuário do Sistema</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setPowerDialog('lock')}
                className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
                title="Bloquear Sessão"
              >
                <IconLockFilled className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPowerDialog('restart')}
                className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
                title="Reiniciar Computador"
              >
                <IconRefresh className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPowerDialog('shutdown')}
                className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-600 transition-colors"
                title="Desligar Sistema"
              >
                <IconPower className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Power Dialog confirmation */}
      {powerDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-80 rounded-2xl p-4 glass-acrylic border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col gap-3"
            style={{
              backgroundColor: isDark ? 'rgba(20, 26, 38, 0.96)' : 'rgba(255, 255, 255, 0.96)',
            }}
          >
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
              <IconPower className="w-4 h-4 text-rose-500" />
              <span>
                {powerDialog === 'shutdown'
                  ? 'Desligar o Sistema?'
                  : powerDialog === 'restart'
                  ? 'Reiniciar o Sistema?'
                  : 'Bloquear Sessão?'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {powerDialog === 'shutdown'
                ? 'Todos os programas em execução serão fechados.'
                : powerDialog === 'restart'
                ? 'O computador será reiniciado para aplicar atualizações.'
                : 'A sessão atual será travada com senha.'}
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => setPowerDialog(null)}
                className="px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setPowerDialog(null);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
