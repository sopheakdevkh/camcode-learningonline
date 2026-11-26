import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ExternalLink,
  GraduationCap,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserCheck,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
import { Button } from '@/components/ui/Button';
import { FlagIcon } from '@/components/ui/FlagIcon';
import { SearchPanel } from './SearchPanel';

export const PublicHeader: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, switchDemoPreset } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState('');
  const [browseTarget, setBrowseTarget] = useState<'courses' | 'videos'>('courses');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
    setDemoMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!demoMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!demoMenuRef.current?.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDemoMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [demoMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/courses', label: t.nav.courses },
    { to: '/videos', label: t.nav.videos },
    { to: '/categories', label: t.nav.categories },
    { to: '/pricing', label: t.nav.pricing },
  ];

  const handleLanguageChange = (next: 'en' | 'km') => {
    setLocale(next);
  };

  const handleInlineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = headerQuery.trim();
    const base = browseTarget === 'videos' ? '/videos' : '/courses';
    navigate(q ? `${base}?q=${encodeURIComponent(q)}` : base);
  };

  const demoPresets = [
    ['visitor', 'Visitor (Logged Out)'],
    ['free', 'Logged In · Free Plan'],
    ['basic', 'Logged In · Basic Plan'],
    ['premium', 'Logged In · Premium Plan'],
    ['purchased', 'Logged In · Purchased Course'],
  ] as const;

  const firstName = user?.fullName.trim().split(/\s+/)[0] || '';
  const demoLabel = user ? user.activePlan.toUpperCase() : 'Visitor';

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-18 bg-white/75 dark:bg-[#0b1120]/75 backdrop-blur-md border-b border-border/80 dark:border-slate-700/50 transition-colors">
        <div className="container-page h-full flex items-center justify-between gap-2 xl:gap-4 min-w-0">
          {/* Left: Logo + Desktop Nav Links */}
          <div className="flex items-center gap-2 xl:gap-4 min-w-0 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-secondary dark:text-slate-100 min-w-0 shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="h-8 w-8 rounded-[8px] bg-linear-to-br from-primary to-[#60A5FA] text-white flex items-center justify-center shadow-xs shrink-0">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="text-[15px] min-[380px]:text-[17px] lg:text-[15.5px] xl:text-[18px] font-bold tracking-tight whitespace-nowrap truncate">
                {t.brand.name}
              </span>
            </Link>

            <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-1.5 xl:px-2.5 py-1.5 rounded-[8px] text-[12.5px] xl:text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-primary dark:text-blue-400 font-semibold'
                        : 'text-[#475569] dark:text-slate-300 hover:text-secondary dark:hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Desktop Actions (fluid inline search >=1280px, modal search button 1024-1279px) */}
          <div className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-1.5 xl:gap-2">
            <form
              onSubmit={handleInlineSearch}
              className="hidden xl:flex flex-1 min-w-35 max-w-65 items-center h-9 rounded-[8px] border border-border dark:border-slate-700 bg-background/90 dark:bg-slate-900/90 overflow-hidden"
            >
              <div className="relative flex items-center border-r border-border dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 h-full shrink-0 max-w-21">
                <select
                  id="header-browse-target"
                  name="browseTarget"
                  aria-label={t.nav.browse}
                  value={browseTarget}
                  onChange={(e) => setBrowseTarget(e.target.value as 'courses' | 'videos')}
                  className="appearance-none bg-transparent pl-2.5 pr-6 h-full w-full text-[12px] font-medium text-secondary dark:text-slate-100 outline-none cursor-pointer truncate"
                >
                  <option value="courses">{t.nav.browse}</option>
                  <option value="videos">{t.nav.videos}</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-muted dark:text-slate-400 pointer-events-none absolute right-1.5" />
              </div>
              <input
                id="header-search-input"
                name="q"
                type="search"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                placeholder={t.nav.searchShortPlaceholder}
                className="flex-1 min-w-0 px-2.5 h-full bg-transparent text-[13px] text-secondary dark:text-slate-100 placeholder:text-muted dark:placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                aria-label={t.nav.search}
                className="px-2 h-full text-muted dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 cursor-pointer shrink-0"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Compact Search trigger for 1024px–1279px so nav never collides */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              title={t.nav.search}
              className="xl:hidden inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-border dark:border-slate-700 bg-white/85 dark:bg-slate-900/90 text-muted dark:text-slate-300 hover:text-secondary dark:hover:text-white cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                <a
                  href={API_CONFIG.userAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`${user.fullName} · ${t.nav.myLearning}`}
                  className="inline-flex items-center h-9 max-w-35 xl:max-w-[185px] px-2.5 xl:px-3 rounded-[8px] bg-[#EFF6FF] dark:bg-blue-950/60 text-primary-hover dark:text-blue-300 text-[12px] xl:text-[13px] font-medium hover:bg-[#DBEAFE] dark:hover:bg-blue-900/70 whitespace-nowrap overflow-hidden"
                >
                  <span className="truncate">
                    {firstName} · {t.nav.myLearning}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label={t.nav.logout}
                  title={t.nav.logout}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-border dark:border-slate-700 text-muted dark:text-slate-400 hover:text-error dark:hover:text-red-400 hover:bg-[#FEF2F2] dark:hover:bg-red-950/40 cursor-pointer shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to="/login"
                  state={{ from: location.pathname + location.search }}
                  className="shrink-0"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-2 xl:px-3 rounded-[8px] border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-secondary dark:text-slate-100 text-[12px] xl:text-[13px] whitespace-nowrap"
                  >
                    {t.nav.login}
                  </Button>
                </Link>
                <Link to="/register" className="shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-9 px-2 xl:px-3 rounded-[8px] bg-primary hover:bg-primary-hover text-white text-[12px] xl:text-[13px] whitespace-nowrap"
                  >
                    {t.nav.signUp}
                  </Button>
                </Link>
              </div>
            )}

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              title={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-secondary dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 cursor-pointer transition-colors shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-[#475569]" />
              )}
            </button>

            {/* Language Switcher EN / ខ្មែរ with Flag Icon */}
            <button
              type="button"
              onClick={() => handleLanguageChange(locale === 'en' ? 'km' : 'en')}
              aria-label="Switch language (EN / ខ្មែរ)"
              title={locale === 'en' ? 'Switch to Khmer (ខ្មែរ)' : 'Switch to English (EN)'}
              className="inline-flex items-center gap-1.5 h-9 px-2 xl:px-2.5 rounded-full border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-[12px] font-semibold text-secondary dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 cursor-pointer transition-colors shrink-0 whitespace-nowrap"
            >
              <FlagIcon lang={locale} className="h-4 w-4" />
              <span>{locale === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Demo State Switcher (mock mode only) */}
            {API_CONFIG.useMock && (
              <div ref={demoMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setDemoMenuOpen((o) => !o)}
                  aria-expanded={demoMenuOpen}
                  aria-haspopup="menu"
                  className="relative inline-flex items-center justify-center h-9 w-9 rounded-[8px] border border-border dark:border-slate-700 bg-white/80 dark:bg-slate-900/90 text-muted dark:text-slate-300 hover:text-secondary dark:hover:text-white cursor-pointer"
                  title={`${t.nav.demoAccess}: ${demoLabel}`}
                  aria-label={`${t.nav.demoAccess}: ${demoLabel}`}
                >
                  <UserCheck className="h-4 w-4 text-primary dark:text-blue-400 shrink-0" />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                      user ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                </button>
                {demoMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-[12px] border border-border dark:border-slate-700 shadow-lg p-2 z-50"
                  >
                    <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-slate-400">
                      {t.nav.demoAccess}
                    </p>
                    {demoPresets.map(([preset, label]) => (
                      <button
                        key={preset}
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          switchDemoPreset(preset);
                          setDemoMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-[8px] text-[13px] text-secondary dark:text-slate-100 hover:bg-background dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile & Tablet Header Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1 min-[380px]:gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              className="hidden min-[380px]:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-secondary dark:text-slate-200 cursor-pointer shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-[#475569]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange(locale === 'en' ? 'km' : 'en')}
              className="h-9 px-2 min-[380px]:px-2.5 rounded-full border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-[12px] font-semibold text-secondary dark:text-slate-200 cursor-pointer inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              aria-label="Switch language"
            >
              <FlagIcon lang={locale === 'en' ? 'km' : 'en'} className="h-4 w-4" />
              <span>{locale === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-secondary dark:text-slate-200 cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={mobileMenuOpen}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-secondary dark:text-slate-200 cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-secondary/45 dark:bg-black/65 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="ml-auto w-75 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-l border-border dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border dark:border-slate-800">
                <span className="font-bold text-[17px] text-secondary dark:text-slate-100">{t.brand.name}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t.nav.close}
                  className="p-1.5 rounded-[8px] text-muted dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile navigation" className="mt-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3.5 py-2.5 rounded-[8px] text-[15px] font-medium ${
                        isActive
                          ? 'bg-[#EFF6FF] dark:bg-blue-950/60 text-primary dark:text-blue-400'
                          : 'text-secondary dark:text-slate-100 hover:bg-background dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-5 pt-4 border-t border-border dark:border-slate-800 space-y-3">
                <p className="text-[12px] font-semibold text-muted dark:text-slate-400">
                  {t.common.language}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`h-10 px-2.5 rounded-[8px] border text-[13px] font-medium cursor-pointer inline-flex items-center justify-center gap-2 ${
                      locale === 'en'
                        ? 'border-primary dark:border-blue-500 bg-[#EFF6FF] dark:bg-blue-950/60 text-primary dark:text-blue-300'
                        : 'border-border dark:border-slate-700 text-secondary dark:text-slate-200'
                    }`}
                  >
                    <FlagIcon lang="en" className="h-4 w-4" />
                    <span>English (EN)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('km')}
                    className={`h-10 px-2.5 rounded-[8px] border text-[13px] font-medium cursor-pointer inline-flex items-center justify-center gap-2 ${
                      locale === 'km'
                        ? 'border-primary dark:border-blue-500 bg-[#EFF6FF] dark:bg-blue-950/60 text-primary dark:text-blue-300'
                        : 'border-border dark:border-slate-700 text-secondary dark:text-slate-200'
                    }`}
                  >
                    <FlagIcon lang="km" className="h-4 w-4" />
                    <span>ភាសាខ្មែរ (KM)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full h-10 px-3 rounded-[8px] border border-border dark:border-slate-700 text-[13px] font-medium text-secondary dark:text-slate-200 hover:bg-background dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <span>{isDark ? t.nav.switchToLight : t.nav.switchToDark}</span>
                  {isDark ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-[#475569]" />
                  )}
                </button>
              </div>

              {API_CONFIG.useMock && (
                <div className="mt-5 pt-4 border-t border-border dark:border-slate-800 space-y-2">
                  <p className="text-[12px] font-semibold text-muted dark:text-slate-400">{t.nav.demoAccess}</p>
                  <div className="flex flex-col gap-1">
                    {demoPresets.map(([preset, label]) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          switchDemoPreset(preset);
                          setMobileMenuOpen(false);
                        }}
                        className="text-left px-3 py-1.5 rounded-[8px] text-[13px] text-[#475569] dark:text-slate-300 hover:bg-background dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-5 mt-5 border-t border-border dark:border-slate-800 space-y-2.5">
              {isAuthenticated && user ? (
                <>
                  <p className="text-[13px] text-muted dark:text-slate-400 truncate">
                    {user.fullName} ({user.activePlan.toUpperCase()})
                  </p>
                  <a
                    href={API_CONFIG.userAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-10 px-3 rounded-[8px] bg-[#EFF6FF] dark:bg-blue-950/60 text-primary-hover dark:text-blue-300 text-[13px] font-medium hover:bg-[#DBEAFE] dark:hover:bg-blue-900/70 inline-flex items-center justify-center gap-2"
                  >
                    <span className="truncate">{t.nav.myLearning}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    state={{ from: location.pathname + location.search }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="outline" fullWidth>
                      {t.nav.login}
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" fullWidth>
                      {t.nav.signUp}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
