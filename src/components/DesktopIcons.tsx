import React from 'react';
import {
  IconDeviceDesktopFilled,
  IconFolderFilled,
  IconTerminal2,
  IconBuildingStore,
  IconCpu,
  IconSettingsFilled,
  IconTrashFilled,
} from '@tabler/icons-react';
import { DesktopIconSize } from '../utils/desktopConfig';

export interface DesktopItem {
  id: string;
  name: string;
  appId: string;
  type: 'computer' | 'folder' | 'terminal' | 'store' | 'monitor' | 'settings' | 'trash';
}

interface DesktopIconsProps {
  onOpenApp: (appId: string) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  accentColor: string;
  iconSize?: DesktopIconSize;
}

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  onOpenApp,
  selectedId,
  onSelect,
  iconSize = 'medium',
}) => {
  const desktopItems: DesktopItem[] = [
    { id: 'computer', name: 'Este Computador', appId: 'files', type: 'computer' },
    { id: 'home', name: 'Pasta Pessoal', appId: 'files', type: 'folder' },
    { id: 'terminal', name: 'Terminal', appId: 'terminal', type: 'terminal' },
    { id: 'store', name: 'Debian Software', appId: 'store', type: 'store' },
    { id: 'monitor', name: 'Monitor do Sistema', appId: 'monitor', type: 'monitor' },
    { id: 'settings', name: 'Configurações', appId: 'settings', type: 'settings' },
    { id: 'trash', name: 'Lixeira', appId: 'files', type: 'trash' },
  ];

  // Size styling maps for resizable desktop icons
  const sizeConfig = {
    small: {
      tileClass: 'w-18 p-1.5 gap-1',
      boxClass: 'w-9 h-9 rounded-lg',
      iconClass: 'w-4.5 h-4.5',
      textClass: 'text-[10px]',
      containerGap: 'gap-2',
    },
    medium: {
      tileClass: 'w-22 p-2 gap-1.5',
      boxClass: 'w-11 h-11 rounded-xl',
      iconClass: 'w-6 h-6',
      textClass: 'text-xs',
      containerGap: 'gap-3.5',
    },
    large: {
      tileClass: 'w-26 p-2.5 gap-2',
      boxClass: 'w-14 h-14 rounded-2xl',
      iconClass: 'w-8 h-8',
      textClass: 'text-[13px]',
      containerGap: 'gap-4',
    },
  }[iconSize];

  const renderIcon = (type: DesktopItem['type']) => {
    switch (type) {
      case 'computer':
        return <IconDeviceDesktopFilled className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'folder':
        return <IconFolderFilled className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'terminal':
        return <IconTerminal2 className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'store':
        return <IconBuildingStore className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'monitor':
        return <IconCpu className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'settings':
        return <IconSettingsFilled className={`${sizeConfig.iconClass} text-slate-200`} />;
      case 'trash':
        return <IconTrashFilled className={`${sizeConfig.iconClass} text-slate-200`} />;
    }
  };

  return (
    <div
      className={`absolute top-6 left-6 flex flex-col ${sizeConfig.containerGap} z-10 transition-all duration-200`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelect(null);
        }
      }}
    >
      {desktopItems.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            aria-label={item.name}
            aria-pressed={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onOpenApp(item.appId);
            }}
            onKeyDown={(e) => {
              // Keyboard equivalent of the double-click open gesture
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(item.id);
                onOpenApp(item.appId);
              }
            }}
            className={`group flex flex-col items-center justify-center ${sizeConfig.tileClass} rounded-xl transition-all duration-150 text-center select-none ${
              isSelected
                ? 'bg-accent-tint backdrop-blur-md ring-1.5 ring-accent'
                : 'hover:bg-white/10 active:bg-white/15'
            }`}
          >
            {/* Resizable Muted Glass Container with Tabler Filled Icon */}
            <div
              className={`${sizeConfig.boxClass} bg-slate-900/60 dark:bg-slate-900/70 border border-white/15 backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-150 group-hover:scale-105 group-active:scale-95 group-hover:bg-slate-800/80 group-hover:border-white/25`}
            >
              {renderIcon(item.type)}
            </div>
            <span
              className={`${sizeConfig.textClass} font-medium text-slate-100 tracking-normal leading-tight px-1 rounded select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2`}
            >
              {item.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};
