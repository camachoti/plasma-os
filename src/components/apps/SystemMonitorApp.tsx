import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  XCircle,
  Search,
  X,
  User,
  Server,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { SystemProcess } from '../../utils/desktopConfig';

type ProcessCategory = 'all' | 'user' | 'system';

export const SystemMonitorApp: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [cpuUsage, setCpuUsage] = useState(18);
  const [memUsage, setMemUsage] = useState(24);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<ProcessCategory>('all');

  const [processes, setProcesses] = useState<SystemProcess[]>([
    { pid: 1, name: 'systemd (init daemon)', user: 'root', cpu: 0.2, memoryMb: 24, status: 'running' },
    { pid: 342, name: 'systemd-journald', user: 'root', cpu: 0.1, memoryMb: 36, status: 'running' },
    { pid: 610, name: 'NetworkManager', user: 'root', cpu: 0.3, memoryMb: 42, status: 'running' },
    { pid: 820, name: 'cron', user: 'root', cpu: 0.0, memoryMb: 8, status: 'sleeping' },
    { pid: 1042, name: 'silk-compositor (wayland)', user: 'debian', cpu: 6.4, memoryMb: 420, status: 'running' },
    { pid: 1108, name: 'silk-dock-customizer', user: 'debian', cpu: 1.2, memoryMb: 110, status: 'running' },
    { pid: 1240, name: 'pipewire-pulse (audio)', user: 'debian', cpu: 0.8, memoryMb: 64, status: 'running' },
    { pid: 1450, name: 'gnome-keyring-daemon', user: 'debian', cpu: 0.1, memoryMb: 28, status: 'sleeping' },
    { pid: 1890, name: 'firefox-esr', user: 'debian', cpu: 8.5, memoryMb: 980, status: 'running' },
    { pid: 2104, name: 'silk-terminal', user: 'debian', cpu: 0.4, memoryMb: 48, status: 'running' },
    { pid: 2150, name: 'bash', user: 'debian', cpu: 0.0, memoryMb: 12, status: 'sleeping' },
    { pid: 2315, name: 'dbus-daemon', user: 'messagebus', cpu: 0.1, memoryMb: 18, status: 'sleeping' },
    { pid: 2490, name: 'ufw-security-daemon', user: 'root', cpu: 0.1, memoryMb: 32, status: 'sleeping' },
    { pid: 2890, name: 'code-oss (editor)', user: 'debian', cpu: 3.2, memoryMb: 540, status: 'running' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = (Math.random() - 0.48) * 8;
        return Math.max(8, Math.min(65, Math.round(prev + delta)));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleKillProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const isUserProcess = (proc: SystemProcess) => proc.user === 'debian';

  // Counts
  const userCount = useMemo(() => processes.filter(isUserProcess).length, [processes]);
  const systemCount = useMemo(() => processes.filter((p) => !isUserProcess(p)).length, [processes]);

  // Filtered list
  const filteredProcesses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return processes.filter((proc) => {
      const isUser = isUserProcess(proc);
      const matchesCategory =
        category === 'all' ||
        (category === 'user' && isUser) ||
        (category === 'system' && !isUser);

      if (!matchesCategory) return false;

      if (!q) return true;

      return (
        proc.name.toLowerCase().includes(q) ||
        proc.pid.toString().includes(q) ||
        proc.user.toLowerCase().includes(q)
      );
    });
  }, [processes, category, searchQuery]);

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100 select-none overflow-hidden bg-slate-50/50 dark:bg-black/15">
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 p-3.5 border-b border-slate-200/80 dark:border-white/10 shrink-0 bg-white/70 dark:bg-transparent">
        {/* CPU */}
        <div className="p-3 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              CPU AMD Ryzen 7
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{cpuUsage}%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">16 núcleos @ 5.1GHz</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center text-accent">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        {/* Memory */}
        <div className="p-3 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              Memória RAM
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">3.4 / 16.0 GB</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{memUsage}% em uso</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center text-slate-700 dark:text-slate-200">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Storage */}
        <div className="p-3 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              SSD NVMe (/)
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">38 / 512 GB</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">91% Livre (399 GB)</span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 dark:bg-emerald-600/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="px-3.5 py-2.5 border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] flex flex-wrap items-center justify-between gap-2 shrink-0">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-white/10 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setCategory('all')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
              category === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 font-mono">
              {processes.length}
            </span>
          </button>

          <button
            onClick={() => setCategory('user')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
              category === 'user'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Usuário</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 font-mono">
              {userCount}
            </span>
          </button>

          <button
            onClick={() => setCategory('system')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
              category === 'system'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Sistema</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 font-mono">
              {systemCount}
            </span>
          </button>
        </div>

        {/* Real-time Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar processo, PID ou usuário..."
            className="w-full pl-8 pr-7 py-1 text-xs rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1.5 focus:ring-accent transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Process Table Header */}
      <div className="px-4 py-1.5 bg-slate-100/90 dark:bg-black/25 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span>Processos no Debian</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono font-medium normal-case">
            {filteredProcesses.length} de {processes.length} ativos
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">Uso</span>
          <span>Ação</span>
        </div>
      </div>

      {/* Process Table List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200/60 dark:divide-white/5 bg-white/40 dark:bg-transparent">
        {filteredProcesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-slate-200/60 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Nenhum processo encontrado
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs">
              {searchQuery
                ? `Nenhum processo corresponde à busca "${searchQuery}" nesta categoria.`
                : 'Não há processos ativos nesta categoria.'}
            </p>
            {(searchQuery || category !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-accent-soft text-accent hover:bg-accent-strong transition-colors font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar filtros</span>
              </button>
            )}
          </div>
        ) : (
          filteredProcesses.map((proc) => {
            const isUser = isUserProcess(proc);
            return (
              <div
                key={proc.pid}
                className="px-4 py-2 flex items-center justify-between text-xs hover:bg-slate-100/80 dark:hover:bg-white/5 transition-colors font-mono group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-slate-400 dark:text-slate-500 w-11 text-right text-[11px] shrink-0">
                    {proc.pid}
                  </span>
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-900 dark:text-white font-medium truncate">
                      {proc.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold shrink-0 tracking-wide ${
                        isUser
                          ? 'bg-accent-soft text-accent dark:bg-accent-strong'
                          : 'bg-slate-500/10 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                      }`}
                    >
                      {proc.user}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-slate-600 dark:text-slate-300 w-14 text-right text-[11px]">
                    {proc.cpu}% <span className="text-[9px] text-slate-400">CPU</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 w-16 text-right text-[11px]">
                    {proc.memoryMb} <span className="text-[9px] text-slate-400">MB</span>
                  </span>
                  <button
                    onClick={() => handleKillProcess(proc.pid)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/15 dark:hover:text-rose-400 dark:hover:bg-rose-500/20 transition-all opacity-80 group-hover:opacity-100"
                    title={`Finalizar processo ${proc.name} (PID: ${proc.pid})`}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
