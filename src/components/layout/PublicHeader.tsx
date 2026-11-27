import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  Globe,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';

export const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1c5b48] dark:bg-[#2D7A62] text-white shrink-0 shadow-xs ${className}`}
    aria-hidden="true"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 5.5H13M3 10.5C5.2 8.9 6.8 12.1 9 10.5C10.5 9.4 11.7 9.6 13 10.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export const PublicHeader: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        rafId = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/courses', label: t.nav.courses },
    { to: '/videos', label: t.nav.videos },
    { to: '/categories', label: t.nav.categories },
    { to: '/trainers', label: t.nav.trainers },
    { to: '/pricing', label: t.nav.pricing },
    { to: '/contact', label: t.nav.contact },
  ];

  const handleLanguageChange = (next: 'en' | 'km') => {
    setLocale(next);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-5 z-50 px-4 pointer-events-none">
        <nav
          aria-label="Main"
          className={`pointer-events-auto mx-auto rounded-full [backdrop-filter:blur(14px)] border px-4 md:px-5 flex items-center justify-between gap-4 transition-[max-width,height,border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled
              ? 'max-w-[980px] h-[56px] md:h-[60px] bg-[rgb(246_243_236/0.94)] dark:bg-[rgb(21_26_23/0.94)] border-[#c2baa8] dark:border-[#3A4740] shadow-[0_14px_34px_-12px_rgba(23,28,25,0.16)]'
              : 'max-w-[1100px] h-[60px] md:h-[68px] bg-[rgb(246_243_236/0.82)] dark:bg-[rgb(21_26_23/0.82)] border-[#ded8ca] dark:border-[#2A332E] shadow-[0_10px_30px_-12px_rgba(23,28,25,0.1)]'
          }`}
        >
          {/* Left: Havenline-inspired Rounded Pine Emblem + Editorial Serif Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#141312] dark:text-[#f6f3ec] shrink-0 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BrandMark />
            <span className="hidden min-[360px]:inline font-serif-display text-[22px] leading-none font-normal tracking-[-0.02em] whitespace-nowrap">
              {t.brand.name}
            </span>
          </Link>

          {/* Center: Clean Horizontal Nav Links */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `relative inline-flex min-h-11 items-center text-[15px] whitespace-nowrap transition-colors duration-[0.22s] ${
                      isActive
                        ? 'text-[#141312] dark:text-[#f6f3ec] font-semibold'
                        : 'text-[#6e6a62] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right: Desktop Utility Controls + Pine Green Pill CTA */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              title={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec]/70 dark:bg-[#181E1B] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] dark:hover:border-[#2D7A62] cursor-pointer transition-colors shrink-0"
            >
              {isDark ? (
                <Sun className="h-3.5 w-3.5 text-[#7CD4B5]" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-[#6e6a62]" />
              )}
            </button>

            {/* Language Switcher EN / ខ្មែរ */}
            <button
              type="button"
              onClick={() => handleLanguageChange(locale === 'en' ? 'km' : 'en')}
              aria-label="Switch language (EN / ខ្មែរ)"
              title={locale === 'en' ? 'Switch to Khmer (ខ្មែរ)' : 'Switch to English (EN)'}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec]/70 dark:bg-[#181E1B] font-mono-tech text-[11px] font-semibold uppercase tracking-[0.06em] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] cursor-pointer transition-colors shrink-0 whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
              <span>{locale === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Primary Green CTA after Language */}
            <Link
              to="/login"
              className="group inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#1c5b48] hover:bg-[#15463a] dark:bg-[#2D7A62] dark:hover:bg-[#23634F] text-white text-[13px] font-semibold whitespace-nowrap transition-colors shrink-0"
            >
              <span>{t.nav.getStart}</span>
              <ArrowUpRight className="h-3.5 w-3.5 swiss-arrow-shift" />
            </Link>
          </div>

          {/* Mobile & Tablet Header Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec]/70 dark:bg-[#181E1B] text-[#141312] dark:text-[#f6f3ec] cursor-pointer shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-[#7CD4B5]" />
              ) : (
                <Moon className="h-4 w-4 text-[#6e6a62]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange(locale === 'en' ? 'km' : 'en')}
              className="h-9 px-2.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec]/70 dark:bg-[#181E1B] font-mono-tech text-[11px] font-semibold text-[#141312] dark:text-[#f6f3ec] cursor-pointer inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
              aria-label="Switch language"
            >
              <Globe className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
              <span>{locale === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t.nav.menu}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-[#1c5b48] text-white cursor-pointer shrink-0"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-Screen Right-to-Left Smooth Mobile & Tablet Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? 'pointer-events-auto opacity-100 visible'
            : 'pointer-events-none opacity-0 invisible'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
      >
        {/* Subtle dim backdrop behind full-screen slide panel */}
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-[#141312]/40 backdrop-blur-[2px] transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Sliding Full-Screen Panel (Right -> Left) */}
        <div
          className={`relative ml-auto flex h-dvh w-full flex-col justify-between overflow-y-auto bg-[#f6f3ec] dark:bg-[#101412] px-6 py-6 sm:px-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            aria-hidden="true"
            className="deco-ring right-[-180px] top-[-220px] size-[460px]"
          />

          <div className="relative z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-5 border-b border-[#ded8ca] dark:border-[#2A332E]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2.5 font-serif-display text-[22px] font-medium tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]"
              >
                <BrandMark />
                <span>{t.brand.name}</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="grid size-10 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] cursor-pointer transition-colors hover:border-[#1c5b48]"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t.nav.close}
                  className="grid size-10 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] cursor-pointer transition-colors hover:border-[#1c5b48]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Full-Screen Staggered Nav Links (Compact Original Size) */}
            <nav className="mt-4 flex flex-col divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-b border-[#ded8ca] dark:border-[#2A332E]">
              {navItems.map((item, idx) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${70 + idx * 40}ms` : '0ms',
                  }}
                  className={({ isActive }) =>
                    `px-2 py-3.5 flex items-center justify-between text-[15px] font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-6 opacity-0'
                    } ${
                      isActive
                        ? 'text-[#1c5b48] dark:text-[#7CD4B5]'
                        : 'text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span className="font-mono-tech text-[11px] text-[#6e6a62]">
                    0{idx + 1}
                  </span>
                </NavLink>
              ))}
            </nav>

            {/* Language Switcher */}
            <div className="mt-6 space-y-2.5">
              <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] text-[#6e6a62]">
                {t.common.language}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`h-11 rounded-full border text-[13.5px] font-medium cursor-pointer transition-colors ${
                    locale === 'en'
                      ? 'border-[#1c5b48] bg-[#1c5b48] text-white'
                      : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec]'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('km')}
                  className={`h-11 rounded-full border text-[13.5px] font-medium cursor-pointer transition-colors ${
                    locale === 'km'
                      ? 'border-[#1c5b48] bg-[#1c5b48] text-white'
                      : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec]'
                  }`}
                >
                  ភាសាខ្មែរ (KM)
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-5 mt-6 border-t border-[#ded8ca] dark:border-[#2A332E]">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="group w-full inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1c5b48] hover:bg-[#15463a] dark:bg-[#2D7A62] dark:hover:bg-[#23634F] px-5 text-[14px] font-semibold text-white transition-colors"
            >
              <span>{t.nav.getStart}</span>
              <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
