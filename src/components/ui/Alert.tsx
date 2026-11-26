import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const styles: Record<AlertTone, { wrap: string; icon: React.ReactNode }> = {
  info: {
    wrap: 'bg-[#ECFEFF] dark:bg-cyan-950/60 border-[#67E8F9] dark:border-cyan-500/40 text-[#155E75] dark:text-cyan-100',
    icon: <Info className="h-5 w-5 text-[#0E7490] dark:text-cyan-300 shrink-0 mt-0.5" />,
  },
  success: {
    wrap: 'bg-[#F0FDF4] dark:bg-emerald-950/60 border-[#86EFAC] dark:border-emerald-500/40 text-[#166534] dark:text-emerald-100',
    icon: <CheckCircle2 className="h-5 w-5 text-[#15803D] dark:text-emerald-300 shrink-0 mt-0.5" />,
  },
  warning: {
    wrap: 'bg-[#FFFBEB] dark:bg-amber-950/60 border-[#FCD34D] dark:border-amber-500/40 text-[#92400E] dark:text-amber-100',
    icon: <AlertTriangle className="h-5 w-5 text-[#B45309] dark:text-amber-300 shrink-0 mt-0.5" />,
  },
  error: {
    wrap: 'bg-[#FEF2F2] dark:bg-red-950/65 border-[#FCA5A5] dark:border-red-500/45 text-[#991B1B] dark:text-red-100',
    icon: <AlertCircle className="h-5 w-5 text-[#B91C1C] dark:text-red-300 shrink-0 mt-0.5" />,
  },
};

export const Alert: React.FC<AlertProps> = ({ tone = 'info', title, children, className = '' }) => {
  const s = styles[tone];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-[12px] border ${s.wrap} ${className}`}
    >
      {s.icon}
      <div className="text-[14px] leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};

