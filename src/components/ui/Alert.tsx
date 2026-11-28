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
    wrap: 'bg-[#e5dfd2]/80 border-[#ded8ca] border-l-[3px] border-l-[#1c5b48] text-[#141312] dark:bg-[#181E1B] dark:border-[#2A332E] dark:border-l-[#2D7A62] dark:text-[#f6f3ec]',
    icon: <Info className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0 mt-0.5" />,
  },
  success: {
    wrap: 'bg-[#e4ede7] border-[#B8D8C8] border-l-[3px] border-l-[#1c5b48] text-[#15463a] dark:bg-[#1B3028] dark:border-[#2D7A62]/40 dark:text-[#A7E8CE]',
    icon: <CheckCircle2 className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0 mt-0.5" />,
  },
  warning: {
    wrap: 'bg-[#FEF6EA] border-[#FDE68A] border-l-[3px] border-l-[#8a5008] text-[#78350F] dark:bg-[#8a5008]/15 dark:border-[#8a5008]/40 dark:text-[#FDE68A]',
    icon: <AlertTriangle className="h-4 w-4 text-[#8a5008] shrink-0 mt-0.5" />,
  },
  error: {
    wrap: 'bg-[#FEF2F2] border-[#FECACA] border-l-[3px] border-l-[#a5331f] text-[#991B1B] dark:bg-[#a5331f]/15 dark:border-[#a5331f]/40 dark:text-[#FCA5A5]',
    icon: <AlertCircle className="h-4 w-4 text-[#a5331f] shrink-0 mt-0.5" />,
  },
};

export const Alert: React.FC<AlertProps> = ({ tone = 'info', title, children, className = '' }) => {
  const s = styles[tone];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${s.wrap} ${className}`}
    >
      {s.icon}
      <div className="text-[14px] leading-relaxed">
        {title && <p className="font-semibold mb-0.5 tracking-[-0.01em]">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};
