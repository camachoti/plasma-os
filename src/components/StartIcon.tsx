import React from 'react';
import { IconBrandDebian, IconLayoutGridFilled } from '@tabler/icons-react';
import { StartIconStyle } from '../utils/desktopConfig';

interface StartIconProps {
  style?: StartIconStyle;
  className?: string;
  size?: number;
}

export const StartIcon: React.FC<StartIconProps> = ({
  style = 'debian',
  className = 'w-5 h-5',
}) => {
  switch (style) {
    case 'debian-swirl':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${className} text-[#D70A53] dark:text-[#f34b7d] transition-transform duration-200 hover:scale-105`}
        >
          {/* Authentic Debian GNU/Linux Spiral Vector */}
          <path d="M15.42 4.41c-2.05-.7-4.44-.35-6.24.89-2.08 1.43-3.23 3.8-3.3 6.32-.07 2.52.88 4.96 2.67 6.74 2.15 2.14 5.37 3.03 8.36 2.3 2.7-.66 5.03-2.58 6.09-5.14.77-1.87.82-3.98.15-5.91-.48-1.39-1.38-2.59-2.55-3.44l-.79 1.05c.98.71 1.73 1.71 2.13 2.87.56 1.62.52 3.39-.12 4.96-.89 2.15-2.85 3.76-5.12 4.31-2.52.61-5.23-.14-7.04-1.94-1.51-1.5-2.31-3.55-2.25-5.67.06-2.12 1.03-4.11 2.78-5.32 1.51-1.04 3.52-1.33 5.24-.74 1.58.54 2.84 1.83 3.36 3.44.41 1.28.26 2.7-.42 3.85-.68 1.15-1.84 1.93-3.15 2.11-1.19.16-2.39-.28-3.18-1.18-.78-.9-.98-2.17-.52-3.27.46-1.1 1.54-1.85 2.73-1.9 1.09-.05 2.16.51 2.71 1.45l1.12-.65c-.77-1.32-2.27-2.11-3.8-2.04-1.68.07-3.21 1.13-3.86 2.68-.65 1.56-.37 3.36.73 4.63 1.12 1.28 2.82 1.9 4.51 1.67 1.86-.25 3.5-1.36 4.46-2.99.96-1.63 1.17-3.64.59-5.45-.73-2.28-2.51-4.09-4.74-4.85z" />
        </svg>
      );

    case 'openkylin':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${className} text-sky-600 dark:text-sky-400`}
        >
          {/* OpenKylin / Silk OS Geometric Emblem */}
          <circle cx="12" cy="12" r="9" className="stroke-sky-500/50" />
          <path d="M12 7v5l3 3" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );

    case 'grid':
      return (
        <IconLayoutGridFilled
          className={`${className} text-slate-800 dark:text-slate-100`}
        />
      );

    case 'debian':
    default:
      return (
        <IconBrandDebian
          className={`${className} text-slate-800 dark:text-slate-100 hover:text-rose-600 dark:hover:text-rose-400 transition-colors`}
          stroke={2}
        />
      );
  }
};
