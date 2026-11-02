import React, { useState } from 'react';
import { ShoppingBag, Download, Trash2, Search, Star } from 'lucide-react';

interface SoftwarePackage {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  size: string;
  installed: boolean;
  iconBg: string;
}

export const AppStoreApp: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [packages, setPackages] = useState<SoftwarePackage[]>([
    {
      id: 'vscode',
      name: 'Visual Studio Code',
      category: 'Desenvolvimento',
      description: 'Editor de código moderno com depuração e suporte a extensões',
      rating: 4.9,
      size: '95 MB',
      installed: true,
      iconBg: 'bg-blue-600',
    },
    {
      id: 'gimp',
      name: 'GIMP',
      category: 'Gráficos',
      description: 'Programa de manipulação e edição avançada de imagens GNU',
      rating: 4.6,
      size: '140 MB',
      installed: false,
      iconBg: 'bg-amber-600',
    },
    {
      id: 'blender',
      name: 'Blender 3D',
      category: 'Modelagem 3D',
      description: 'Suíte profissional completa de criação 3D e renderização',
      rating: 4.9,
      size: '320 MB',
      installed: false,
      iconBg: 'bg-orange-600',
    },
    {
      id: 'vlc',
      name: 'VLC Media Player',
      category: 'Multimídia',
      description: 'Reprodutor multimídia universal e reprodutor de streaming',
      rating: 4.8,
      size: '48 MB',
      installed: true,
      iconBg: 'bg-amber-500',
    },
    {
      id: 'libreoffice',
      name: 'LibreOffice Suite',
      category: 'Escritório',
      description: 'Pacote de produtividade com processador de texto e planilhas',
      rating: 4.7,
      size: '280 MB',
      installed: true,
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'firefox-esr',
      name: 'Firefox ESR',
      category: 'Internet',
      description: 'Navegador estável oficial de longo prazo da Debian',
      rating: 4.7,
      size: '88 MB',
      installed: true,
      iconBg: 'bg-rose-500',
    },
  ]);

  const [installingId, setInstallingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === id ? { ...pkg, installed: !pkg.installed } : pkg))
      );
      setInstallingId(null);
    }, 1200);
  };

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100 select-none overflow-hidden bg-slate-50/50 dark:bg-black/10">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-transparent">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Debian Software Hub</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Repositórios Oficiais Debian 13 (Trixie)</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar pacotes deb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
          />
        </div>
      </div>

      {/* Package cards list */}
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((pkg) => {
          const isBusy = installingId === pkg.id;
          return (
            <div
              key={pkg.id}
              className="p-3.5 rounded-xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-2.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0 ${pkg.iconBg}`}
                >
                  {pkg.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{pkg.name}</h4>
                    <span className="flex items-center gap-1 text-[11px] text-amber-500 dark:text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                      {pkg.rating}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{pkg.category}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                    {pkg.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5 text-xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Tamanho: {pkg.size}</span>

                <button
                  onClick={() => toggleInstall(pkg.id)}
                  disabled={isBusy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors text-xs ${
                    pkg.installed
                      ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 border border-rose-500/20'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                  }`}
                >
                  {isBusy ? (
                    <span className="animate-spin inline-block">⏳</span>
                  ) : pkg.installed ? (
                    <Trash2 className="w-3.5 h-3.5" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isBusy
                      ? 'Processando...'
                      : pkg.installed
                      ? 'Remover'
                      : 'Instalar'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
