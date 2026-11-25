import React from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'dark';

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
  primary: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
  success: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
  warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  error: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
  info: 'bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]',
  dark: 'bg-[#0F172A] text-white border-[#0F172A]',
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

