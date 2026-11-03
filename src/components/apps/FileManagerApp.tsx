import React, { useState, useRef, useEffect } from 'react';
import {
  IconFolderFilled,
  IconFileFilled,
  IconPhotoFilled,
  IconTerminal2,
  IconDeviceDesktopFilled,
  IconDownload,
  IconMusic,
  IconSearch,
  IconPlus,
  IconTrashFilled,
  IconChevronRight,
  IconChevronDown,
  IconLayoutGridFilled,
  IconList,
  IconFolderPlus,
} from '@tabler/icons-react';
import { FolderIconSize, FolderViewMode } from '../../utils/desktopConfig';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'text' | 'image' | 'script';
  size: string;
  modified: string;
  path: string;
}

export const FileManagerApp: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [currentPath, setCurrentPath] = useState('/home/debian');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Resizable sidebar folder structure state
  const [sidebarWidth, setSidebarWidth] = useState(210);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resizable folder icons and view mode
  const [folderIconSize, setFolderIconSize] = useState<FolderIconSize>('medium');
  const [viewMode, setViewMode] = useState<FolderViewMode>('grid');

  // Expandable folder tree states in the sidebar
  const [homeExpanded, setHomeExpanded] = useState(true);
  const [systemExpanded, setSystemExpanded] = useState(false);

  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Documentos', type: 'folder', size: '—', modified: 'Hoje, 14:10', path: '/home/debian' },
    { id: '2', name: 'Downloads', type: 'folder', size: '—', modified: 'Hoje, 18:02', path: '/home/debian' },
    { id: '3', name: 'Imagens', type: 'folder', size: '—', modified: 'Ontem', path: '/home/debian' },
    { id: '4', name: 'Música', type: 'folder', size: '—', modified: '2 dias atrás', path: '/home/debian' },
    { id: '5', name: 'Projetos_Debian', type: 'folder', size: '—', modified: 'Hoje, 19:20', path: '/home/debian' },
    { id: '6', name: 'bem-vindo.txt', type: 'text', size: '1.2 KB', modified: 'Hoje, 10:00', path: '/home/debian' },
    { id: '7', name: 'configuracao_silk.sh', type: 'script', size: '3.4 KB', modified: 'Hoje, 16:45', path: '/home/debian' },
    { id: '8', name: 'wallpaper_preview.jpg', type: 'image', size: '4.8 MB', modified: 'Hoje, 17:30', path: '/home/debian' },
    // Documentos subfolder items
    { id: 'doc-1', name: 'anotacoes_trixie.txt', type: 'text', size: '840 B', modified: 'Hoje, 11:30', path: '/home/debian/Documentos' },
    { id: 'doc-2', name: 'guia_openkylin_de.pdf', type: 'text', size: '2.1 MB', modified: 'Ontem', path: '/home/debian/Documentos' },
    // Downloads subfolder items
    { id: 'dl-1', name: 'debian-13-live-amd64.iso', type: 'script', size: '2.4 GB', modified: 'Hoje, 09:15', path: '/home/debian/Downloads' },
    { id: 'dl-2', name: 'silk_theme_papirus.tar.gz', type: 'script', size: '14.2 MB', modified: 'Ontem', path: '/home/debian/Downloads' },
    // Imagens subfolder items
    { id: 'img-1', name: 'captura_de_tela_01.png', type: 'image', size: '1.1 MB', modified: 'Hoje, 15:40', path: '/home/debian/Imagens' },
    { id: 'img-2', name: 'wallpaper_aurora.jpg', type: 'image', size: '3.6 MB', modified: '3 dias atrás', path: '/home/debian/Imagens' },
  ]);

  // Sidebar drag resizer listener
  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingSidebar || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(140, Math.min(380, e.clientX - rect.left));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
    };

    if (isResizingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingSidebar]);

  const handleCreateFolder = () => {
    const folderName = `Nova_Pasta_${Date.now().toString().slice(-4)}`;
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: folderName,
      type: 'folder',
      size: '—',
      modified: 'Agora',
      path: currentPath,
    };
    setFiles((prev) => [...prev, newFolder]);
  };

  const handleDeleteSelected = () => {
    if (!selectedFileId) return;
    setFiles((prev) => prev.filter((f) => f.id !== selectedFileId));
    setSelectedFileId(null);
  };

  const filteredFiles = files.filter(
    (f) =>
      f.path === currentPath &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic grid configuration based on folderIconSize
  const gridClasses = {
    small: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2',
    medium: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5',
    large: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5',
  }[folderIconSize];

  const iconBoxClasses = {
    small: 'w-8 h-8 rounded-lg mb-1',
    medium: 'w-11 h-11 rounded-xl mb-1.5',
    large: 'w-16 h-16 rounded-2xl mb-2',
  }[folderIconSize];

  const iconSvgSizes = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-9 h-9',
  }[folderIconSize];

  const pathParts = currentPath.split('/').filter(Boolean);

  const renderFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder':
        return <IconFolderFilled className={`${iconSvgSizes} text-slate-600 dark:text-slate-200`} />;
      case 'text':
        return <IconFileFilled className={`${iconSvgSizes} text-slate-600 dark:text-slate-200`} />;
      case 'image':
        return <IconPhotoFilled className={`${iconSvgSizes} text-slate-600 dark:text-slate-200`} />;
      case 'script':
        return <IconTerminal2 className={`${iconSvgSizes} text-slate-600 dark:text-slate-200`} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex h-full text-slate-800 dark:text-slate-100 select-none overflow-hidden text-xs"
    >
      {/* Resizable Sidebar (Folder Structure / Tree) */}
      <div
        style={{ width: `${sidebarWidth}px` }}
        className="p-2.5 flex flex-col gap-0.5 border-r border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-black/20 shrink-0 overflow-y-auto"
      >
        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2 py-1 tracking-wider">
          Estrutura de Pastas
        </span>

        {/* Tree Item: Pasta Pessoal with expand toggle */}
        <div>
          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPath === '/home/debian'
                ? 'bg-accent-soft border border-accent-soft text-slate-900 dark:text-white font-semibold dark:bg-accent-strong dark:border-transparent'
                : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5'
            }`}
            onClick={() => setCurrentPath('/home/debian')}
          >
            <div className="flex items-center gap-2 truncate">
              <IconFolderFilled className="w-4 h-4 text-slate-500 dark:text-slate-300 shrink-0" />
              <span className="truncate">Pasta Pessoal</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHomeExpanded(!homeExpanded);
              }}
              className="p-0.5 rounded hover:bg-slate-300/50 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {homeExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Subfolders under /home/debian */}
          {homeExpanded && (
            <div className="ml-3 pl-2 border-l border-slate-200/80 dark:border-white/10 flex flex-col gap-0.5 my-0.5">
              <button
                onClick={() => setCurrentPath('/home/debian/Documentos')}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-left transition-colors text-[11px] ${
                  currentPath === '/home/debian/Documentos'
                    ? 'bg-accent-soft text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <IconFileFilled className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Documentos</span>
              </button>

              <button
                onClick={() => setCurrentPath('/home/debian/Downloads')}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-left transition-colors text-[11px] ${
                  currentPath === '/home/debian/Downloads'
                    ? 'bg-accent-soft text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <IconDownload className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Downloads</span>
              </button>

              <button
                onClick={() => setCurrentPath('/home/debian/Imagens')}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-left transition-colors text-[11px] ${
                  currentPath === '/home/debian/Imagens'
                    ? 'bg-accent-soft text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <IconPhotoFilled className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Imagens</span>
              </button>

              <button
                onClick={() => setCurrentPath('/home/debian/Música')}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-left transition-colors text-[11px] ${
                  currentPath === '/home/debian/Música'
                    ? 'bg-accent-soft text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-white/5'
                }`}
              >
                <IconMusic className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="truncate">Música</span>
              </button>
            </div>
          )}
        </div>

        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2 py-1 mt-2.5 tracking-wider">
          Dispositivos
        </span>

        {/* Tree Item: Root Filesystem */}
        <div>
          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentPath === '/'
                ? 'bg-accent-soft border border-accent-soft text-slate-900 dark:text-white font-semibold dark:bg-accent-strong dark:border-transparent'
                : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5'
            }`}
            onClick={() => setCurrentPath('/')}
          >
            <div className="flex items-center gap-2 truncate">
              <IconDeviceDesktopFilled className="w-4 h-4 text-slate-500 dark:text-slate-300 shrink-0" />
              <span className="truncate">Sistema de Arquivos (/)</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSystemExpanded(!systemExpanded);
              }}
              className="p-0.5 rounded hover:bg-slate-300/50 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {systemExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {systemExpanded && (
            <div className="ml-3 pl-2 border-l border-slate-200/80 dark:border-white/10 flex flex-col gap-0.5 my-0.5 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="px-2 py-0.5 font-mono">/etc (config)</span>
              <span className="px-2 py-0.5 font-mono">/home (usuários)</span>
              <span className="px-2 py-0.5 font-mono">/usr (binários)</span>
              <span className="px-2 py-0.5 font-mono">/var (daemons)</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Draggable Split Handle to Resize Sidebar Folder Structure */}
      <div
        onMouseDown={handleStartResize}
        className={`w-1 cursor-col-resize hover:w-1.5 transition-all relative flex items-center justify-center shrink-0 select-none group z-10 ${
          isResizingSidebar
            ? 'bg-accent w-1.5'
            : 'bg-slate-200/90 dark:bg-white/10 hover:bg-accent-soft'
        }`}
        title="Arraste para redimensionar a estrutura de pastas lateral"
      >
        <div className="w-0.5 h-8 rounded-full bg-slate-400/50 group-hover:bg-white transition-colors" />
      </div>

      {/* Main Files Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white/40 dark:bg-black/5 min-w-0">
        {/* Navigation & Action Bar */}
        <div className="p-2.5 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5 bg-white/60 dark:bg-transparent shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200/80 dark:border-transparent text-xs font-mono text-slate-700 dark:text-slate-300">
            <span
              onClick={() => setCurrentPath('/')}
              className="cursor-pointer hover:text-accent"
            >
              /
            </span>
            {pathParts.map((part, index) => {
              const fullSubPath = '/' + pathParts.slice(0, index + 1).join('/');
              const isLast = index === pathParts.length - 1;
              return (
                <React.Fragment key={fullSubPath}>
                  <IconChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span
                    onClick={() => setCurrentPath(fullSubPath)}
                    className={`cursor-pointer ${
                      isLast
                        ? 'text-slate-900 dark:text-white font-semibold'
                        : 'hover:text-accent'
                    }`}
                  >
                    {part}
                  </span>
                </React.Fragment>
              );
            })}
          </div>

          {/* Action buttons & Icon Sizing Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200/80 dark:border-white/10 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent w-36 sm:w-44"
              />
            </div>

            <button
              onClick={handleCreateFolder}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-700 dark:bg-white/10 dark:hover:bg-white/15 dark:border-transparent dark:text-white text-xs font-medium transition-colors shadow-xs"
              title="Criar nova pasta no diretório atual"
            >
              <IconPlus className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Nova Pasta</span>
            </button>

            {selectedFileId && (
              <button
                onClick={handleDeleteSelected}
                className="p-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 transition-colors border border-rose-500/20"
                title="Excluir arquivo selecionado"
              >
                <IconTrashFilled className="w-3.5 h-3.5" />
              </button>
            )}

            {/* View Mode & Icon Size Presets Toggle */}
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-white/10 pl-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`p-1.5 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-slate-200/80 dark:bg-white/20 text-slate-900 dark:text-white border-transparent'
                    : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
                title={viewMode === 'grid' ? 'Visualizar como Lista' : 'Visualizar como Grade'}
              >
                {viewMode === 'grid' ? <IconLayoutGridFilled className="w-3.5 h-3.5" /> : <IconList className="w-3.5 h-3.5" />}
              </button>

              {/* Resizable Folder Icons Size Selector */}
              <div className="flex items-center bg-slate-200/70 dark:bg-white/10 p-0.5 rounded-lg text-[10px]">
                <button
                  onClick={() => setFolderIconSize('small')}
                  className={`px-1.5 py-0.5 rounded font-medium transition-all ${
                    folderIconSize === 'small'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title="Ícones Pequenos"
                >
                  P
                </button>
                <button
                  onClick={() => setFolderIconSize('medium')}
                  className={`px-1.5 py-0.5 rounded font-medium transition-all ${
                    folderIconSize === 'medium'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title="Ícones Médios"
                >
                  M
                </button>
                <button
                  onClick={() => setFolderIconSize('large')}
                  className={`px-1.5 py-0.5 rounded font-medium transition-all ${
                    folderIconSize === 'large'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  title="Ícones Grandes"
                >
                  G
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Files Content: Resizable Grid or List */}
        <div
          className="flex-1 overflow-y-auto p-4"
          onClick={() => setSelectedFileId(null)}
        >
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
              <IconFolderPlus className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p>Nenhum item encontrado nesta pasta.</p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Resizable Grid of Files & Folders */
            <div className={`grid ${gridClasses}`}>
              {filteredFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        setCurrentPath(`${file.path}/${file.name}`.replace('//', '/'));
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-accent-soft border-accent shadow-xs ring-1 ring-accent'
                        : 'border-transparent hover:bg-slate-100/80 dark:hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`${iconBoxClasses} bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 flex items-center justify-center shadow-xs text-slate-700 dark:text-slate-200 transition-all`}
                    >
                      {renderFileIcon(file.type)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-full">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {file.size}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Detailed List View */
            <div className="divide-y divide-slate-200/70 dark:divide-white/5 font-mono text-xs">
              <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-white/5 rounded-lg mb-1">
                <span className="w-1/2">Nome</span>
                <span className="w-1/6 text-right">Tamanho</span>
                <span className="w-1/6 text-right">Tipo</span>
                <span className="w-1/6 text-right">Modificado</span>
              </div>
              {filteredFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        setCurrentPath(`${file.path}/${file.name}`.replace('//', '/'));
                      }
                    }}
                    className={`px-3 py-2 flex items-center justify-between rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-accent-soft text-slate-900 dark:text-white'
                        : 'hover:bg-slate-100/80 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="w-1/2 flex items-center gap-2 truncate">
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {renderFileIcon(file.type)}
                      </div>
                      <span className="font-sans font-medium truncate">{file.name}</span>
                    </div>
                    <span className="w-1/6 text-right text-slate-500 dark:text-slate-400 text-[11px]">
                      {file.size}
                    </span>
                    <span className="w-1/6 text-right text-slate-500 dark:text-slate-400 text-[11px] capitalize">
                      {file.type}
                    </span>
                    <span className="w-1/6 text-right text-slate-400 dark:text-slate-500 text-[10px]">
                      {file.modified}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-3 py-1.5 border-t border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-black/25 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <span>{filteredFiles.length} itens</span>
            {selectedFileId && <span className="text-accent font-semibold">• 1 selecionado</span>}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-sans">
            <span>Painel: {sidebarWidth}px</span>
            <span>•</span>
            <span>Ícones: {folderIconSize === 'small' ? 'Pequenos' : folderIconSize === 'medium' ? 'Médios' : 'Grandes'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
