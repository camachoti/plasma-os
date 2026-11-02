import React, { useState, useEffect } from 'react';
import {
  IconBellFilled,
  IconShieldFilled,
  IconRefresh,
  IconCpu,
  IconTrashFilled,
  IconX,
  IconCircleCheckFilled,
} from '@tabler/icons-react';
import { TaskbarPosition, TaskbarMode } from '../utils/desktopConfig';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'system' | 'update' | 'security' | 'info';
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  taskbarPosition: TaskbarPosition;
  taskbarMode?: TaskbarMode;
  isDark: boolean;
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  accentColor: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  taskbarPosition,
  taskbarMode = 'dock',
  isDark,
  notifications,
  onDismiss,
  onClearAll,
}) => {
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

      const notifBtn = document.querySelector('button[aria-label="Central de Notificações"]');
      const taskbarEl = document.querySelector('[data-silk-taskbar="true"]');

      if (notifBtn) {
        const btnRect = notifBtn.getBoundingClientRect();
        const taskbarRect = taskbarEl?.getBoundingClientRect();
        const popoverWidth = 336; // w-84 = 21rem = 336px
        const margin = 10;

        if (taskbarPosition === 'bottom') {
          // Align right edge of popover with right side of dock or button
          const rightReference = taskbarRect
            ? Math.min(taskbarRect.right, btnRect.right + 28)
            : btnRect.right;
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
            ? Math.min(taskbarRect.right, btnRect.right + 28)
            : btnRect.right;
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
          targetBottom = Math.max(16, Math.min(window.innerHeight - 480, targetBottom));

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
          targetBottom = Math.max(16, Math.min(window.innerHeight - 480, targetBottom));

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

  // Fallback classes used when in fixed panel mode
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

  const isDock = taskbarMode === 'dock';

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'security':
        return <IconShieldFilled className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
      case 'update':
        return <IconRefresh className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
      case 'system':
        return <IconCpu className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
      default:
        return <IconBellFilled className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className={`fixed z-50 w-84 max-h-[460px] flex flex-col rounded-2xl glass-acrylic p-3.5 shadow-2xl border select-none animate-in fade-in zoom-in-95 duration-100 ${
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
        {/* Subtle tooltip caret when anchored to floating dock */}
        {isDock && arrowOffset !== null && taskbarPosition === 'bottom' && (
          <div
            className="absolute -bottom-1.5 w-3 h-3 rotate-45 border-r border-b pointer-events-none"
            style={{
              left: `${Math.max(16, Math.min(312, arrowOffset - 6))}px`,
              backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
            }}
          />
        )}
        {isDock && arrowOffset !== null && taskbarPosition === 'top' && (
          <div
            className="absolute -top-1.5 w-3 h-3 rotate-45 border-l border-t pointer-events-none"
            style={{
              left: `${Math.max(16, Math.min(312, arrowOffset - 6))}px`,
              backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10 mb-2.5">
          <div className="flex items-center gap-2">
            <IconBellFilled className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
              Notificações ({notifications.length})
            </span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors font-medium"
            >
              <IconTrashFilled className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto pr-0.5 flex flex-col gap-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-xs">
              <IconCircleCheckFilled className="w-6 h-6 text-slate-400 mb-1.5" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="relative group p-2.5 rounded-xl bg-slate-100/90 dark:bg-black/20 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 shrink-0 mt-0.5 shadow-xs">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white truncate text-xs">
                        {item.title}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(item.id)}
                  className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors opacity-60 group-hover:opacity-100"
                  title="Dispensar"
                >
                  <IconX className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
