import React, { useState, useEffect } from 'react';
import {
  IconCalendarFilled,
  IconClock,
  IconCircleCheckFilled,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { TaskbarPosition, TaskbarMode } from '../utils/desktopConfig';

interface CalendarFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  taskbarPosition: TaskbarPosition;
  taskbarMode?: TaskbarMode;
  isDark: boolean;
  accentColor: string;
}

export const CalendarFlyout: React.FC<CalendarFlyoutProps> = ({
  isOpen,
  onClose,
  taskbarPosition,
  taskbarMode = 'dock',
  isDark,
}) => {
  const [currentDate] = useState(new Date());
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

      const calBtn = document.querySelector('button[aria-label="Abrir Calendário do Sistema"]');
      if (calBtn) {
        const btnRect = calBtn.getBoundingClientRect();
        const popoverWidth = 304; // w-76 = 19rem = 304px
        const margin = 10;

        if (taskbarPosition === 'bottom') {
          let targetLeft = btnRect.left + btnRect.width / 2 - popoverWidth / 2;
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
          let targetLeft = btnRect.left + btnRect.width / 2 - popoverWidth / 2;
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
          targetBottom = Math.max(16, Math.min(window.innerHeight - 380, targetBottom));

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
          targetBottom = Math.max(16, Math.min(window.innerHeight - 380, targetBottom));

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
    panelAnchorClasses = 'bottom-15 right-12';
  } else if (taskbarPosition === 'top') {
    panelAnchorClasses = 'top-15 right-12';
  } else if (taskbarPosition === 'left') {
    panelAnchorClasses = 'bottom-12 left-15';
  } else if (taskbarPosition === 'right') {
    panelAnchorClasses = 'bottom-12 right-15';
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = currentDate.getDate();

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const events = [
    { time: '14:00', title: 'Atualização do Kernel Debian 6.12', done: true },
    { time: '18:30', title: 'Backup Incremental /home/debian', done: false },
    { time: '21:00', title: 'Sincronização de Pacotes Trixie', done: false },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className={`fixed z-50 w-76 rounded-2xl glass-acrylic p-3.5 shadow-2xl border select-none animate-in fade-in zoom-in-95 duration-100 ${
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
        {isDock && arrowOffset !== null && taskbarPosition === 'bottom' && (
          <div
            className="absolute -bottom-1.5 w-3 h-3 rotate-45 border-r border-b pointer-events-none"
            style={{
              left: `${Math.max(16, Math.min(280, arrowOffset - 6))}px`,
              backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
            }}
          />
        )}
        {isDock && arrowOffset !== null && taskbarPosition === 'top' && (
          <div
            className="absolute -top-1.5 w-3 h-3 rotate-45 border-l border-t pointer-events-none"
            style={{
              left: `${Math.max(16, Math.min(280, arrowOffset - 6))}px`,
              backgroundColor: isDark ? 'rgba(20, 26, 38, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(148, 163, 184, 0.3)',
            }}
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-white/10 mb-2.5">
          <div className="flex items-center gap-2">
            <IconCalendarFilled className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
              {monthName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
              <IconChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
              <IconChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
          {daysOfWeek.map((d) => (
            <span key={d} className="text-[10px] font-semibold text-slate-500 py-0.5">
              {d}
            </span>
          ))}

          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <span key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === todayDate;
            return (
              <span
                key={dayNum}
                className={`py-1 text-[11px] rounded-lg transition-colors cursor-pointer ${
                  isToday
                    ? 'bg-accent text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-white/10'
                }`}
              >
                {dayNum}
              </span>
            );
          })}
        </div>

        {/* Agenda Events */}
        <div className="border-t border-slate-200/80 dark:border-white/10 pt-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Tarefas do Sistema
            </span>
            <IconClock className="w-3 h-3 text-slate-400" />
          </div>

          <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto pr-0.5">
            {events.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100/90 dark:bg-black/20 text-xs border border-slate-200/80 dark:border-white/5"
              >
                <IconCircleCheckFilled
                  className={`w-3.5 h-3.5 shrink-0 ${
                    evt.done ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 text-[11px] truncate font-medium">
                    {evt.title}
                  </p>
                  <span className="text-[9px] text-slate-500 font-mono">{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
