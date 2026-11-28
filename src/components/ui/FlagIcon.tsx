import React from 'react';
import type { Locale } from '@/types';

interface FlagIconProps {
  lang: Locale;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ lang, className = 'h-4 w-4' }) => {
  if (lang === 'km') {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`${className} rounded-full shrink-0 overflow-hidden ring-1 ring-black/10 dark:ring-white/15`}
      >
        <rect width="24" height="6" y="0" fill="#032EA1" />
        <rect width="24" height="12" y="6" fill="#E00025" />
        <rect width="24" height="6" y="18" fill="#032EA1" />
        {/* Simplified Angkor Wat silhouette */}
        <path
          d="M6.5 16h11v-1.2h-.9v-2.1h-.9v1.3h-1.2v-2.5l-.8-1.2-.8 1.2v2.5h-.9V9.6L12 8l-.9 1.6V14h-.9v-2.5l-.8-1.2-.8 1.2v2.5H7.4v-1.3h-.9v2.1h-.9V16z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${className} rounded-full shrink-0 overflow-hidden ring-1 ring-black/10 dark:ring-white/15`}
    >
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0l24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="4.5" />
      <path d="M0 0l24 24M24 0L0 24" stroke="#C8102E" strokeWidth="2.2" />
      <path d="M12 0v24M0 12h24" stroke="#FFFFFF" strokeWidth="6.5" />
      <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="3.8" />
    </svg>
  );
};
