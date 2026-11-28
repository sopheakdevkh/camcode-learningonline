import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    'bg-[#e5dfd2] text-[#6e6a62] border-[#ded8ca] dark:bg-[#181E1B] dark:text-[#A3ACA6] dark:border-[#2A332E]',
  primary:
    'bg-[#e4ede7] text-[#1c5b48] border-[#c5d6cb] dark:bg-[#1B3028] dark:text-[#7CD4B5] dark:border-[#2D7A62]/40',
  success:
    'bg-[#e4ede7] text-[#1c5b48] border-[#B8D8C8] dark:bg-[#1B3028] dark:text-[#7CD4B5] dark:border-[#2D7A62]/40',
  warning:
    'bg-[#FEF6EA] text-[#92400E] border-[#FDE68A] dark:bg-[#8a5008]/15 dark:text-[#FBBF24] dark:border-[#8a5008]/40',
  error:
    'bg-[#FEF2F2] text-[#a5331f] border-[#FECACA] dark:bg-[#a5331f]/15 dark:text-[#F87171] dark:border-[#a5331f]/40',
  info:
    'bg-[#E6F2F0] text-[#0F766E] border-[#B8DDD7] dark:bg-[#0F766E]/15 dark:text-[#5EEAD4] dark:border-[#0F766E]/40',
  dark:
    'bg-[#1C2420] text-[#f6f3ec] border-[#1C2420] dark:bg-[#f6f3ec] dark:text-[#141312] dark:border-[#f6f3ec]',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', children, className = '' }) => {
  return (
    <span
      className={`font-mono-tech inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-medium uppercase tracking-[0.08em] whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};
