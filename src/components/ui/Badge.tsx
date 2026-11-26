import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[#F1F5F9] dark:bg-slate-800 text-[#334155] dark:text-slate-200 border-[#CBD5E1] dark:border-slate-700',
  primary: 'bg-[#EFF6FF] dark:bg-blue-950/70 text-primary-hover dark:text-blue-200 border-[#BFDBFE] dark:border-blue-700/70',
  success: 'bg-[#F0FDF4] dark:bg-emerald-950/70 text-[#166534] dark:text-emerald-200 border-[#86EFAC] dark:border-emerald-700/70',
  warning: 'bg-[#FFFBEB] dark:bg-amber-950/70 text-[#92400E] dark:text-amber-200 border-[#FCD34D] dark:border-amber-700/70',
  error: 'bg-[#FEF2F2] dark:bg-red-950/70 text-[#991B1B] dark:text-red-200 border-[#FCA5A5] dark:border-red-700/70',
  info: 'bg-[#ECFEFF] dark:bg-cyan-950/70 text-[#155E75] dark:text-cyan-200 border-[#67E8F9] dark:border-cyan-700/70',
  dark: 'bg-secondary text-white border-secondary dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[12px] font-medium whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

