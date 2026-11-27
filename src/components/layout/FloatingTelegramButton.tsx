import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';

const TELEGRAM_GROUP_URL =
  import.meta.env.VITE_TELEGRAM_GROUP_URL || 'https://t.me/camcodelearn';

/** Fixed bottom-right floating Telegram community pill styled to match Havenline glass & pine tokens. */
export const FloatingTelegramButton: React.FC = () => {
  const { locale } = useI18n();
  const { pathname } = useLocation();

  // Keep clear of sticky bottom bars on Checkout and Course Detail mobile views
  const hasMobileStickyBar =
    pathname === '/checkout' || /^\/courses\/[^/]+/.test(pathname);

  return (
    <a
      href={TELEGRAM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={locale === 'km' ? 'ចូលរួមក្រុម Telegram ឥតគិតថ្លៃ' : 'Join free Telegram group'}
      className={`group floating-telegram-enter fixed right-4 sm:right-6 z-40 inline-flex items-center sm:gap-3 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[rgb(250_248_244/0.9)] dark:bg-[rgb(21_26_23/0.92)] p-1.5 sm:py-2 sm:pl-2.5 sm:pr-4 text-[#141312] dark:text-[#f6f3ec] [backdrop-filter:blur(14px)] shadow-[0_14px_34px_-12px_rgba(23,28,25,0.16)] transition-[transform,border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[#1c5b48]/60 dark:hover:border-[#7CD4B5]/55 hover:bg-[#efebe1] dark:hover:bg-[#151A17] hover:shadow-[0_18px_40px_-14px_rgba(27,77,62,0.24)] active:translate-y-px ${
        hasMobileStickyBar ? 'bottom-20 lg:bottom-6' : 'bottom-4 sm:bottom-6'
      }`}
    >
      {/* Circular Pine Green Telegram Emblem + Live Sonar Pulse */}
      <span className="relative inline-flex size-10 sm:size-9 shrink-0 items-center justify-center rounded-full bg-[#1c5b48] dark:bg-[#2D7A62] text-white shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="-translate-x-[0.5px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[0.5px] group-hover:-translate-y-[0.5px]"
        >
          <path d="M21.94 4.62a1.48 1.48 0 0 0-1.52-.23L3.16 11.16a1.44 1.44 0 0 0 .08 2.7l4.26 1.43 1.63 5.14a1.1 1.1 0 0 0 1.83.46l2.44-2.36 4.46 3.29a1.48 1.48 0 0 0 2.33-.88L22.4 6.08a1.48 1.48 0 0 0-.46-1.46ZM18.4 8.3l-7.77 6.99a.75.75 0 0 0-.23.43l-.39 2.26-1.08-3.42 9.47-6.26Z" />
        </svg>
        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex size-2.5">
          <span className="telegram-sonar-ring absolute inline-flex h-full w-full rounded-full bg-[#22C55E]" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#efebe1] dark:ring-[#151A17]" />
        </span>
      </span>

      {/* Bilingual Labels (Desktop / Tablet only) */}
      <span className="hidden sm:flex flex-col text-left leading-tight">
        <span className="text-[13.5px] font-semibold tracking-[-0.01em] text-[#141312] dark:text-[#f6f3ec] whitespace-nowrap">
          {locale === 'km' ? 'ចូលរួមក្រុមឥតគិតថ្លៃ' : 'Join free group'}
        </span>
        <span className="font-mono-tech text-[10.5px] uppercase tracking-[0.06em] font-medium text-[#1c5b48] dark:text-[#7CD4B5] whitespace-nowrap">
          {locale === 'km' ? 'Telegram · ឥតគិតថ្លៃ' : 'Telegram · free'}
        </span>
      </span>

      <ArrowUpRight className="hidden sm:inline-block h-3.5 w-3.5 text-[#6e6a62] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] swiss-arrow-shift shrink-0" />
    </a>
  );
};
