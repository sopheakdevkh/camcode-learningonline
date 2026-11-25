import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Globe,
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
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] bg-white/75 dark:bg-[#0b1120]/75 backdrop-blur-md border-b border-[#E2E8F0]/80 dark:border-slate-700/50 transition-colors">
        <div className="container-page h-full flex items-center justify-between gap-3">
          {/* Left: Logo + Desktop Nav Links */}
          <div className="flex items-center gap-4 min-[1400px]:gap-7 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#0F172A] shrink-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="h-8 w-8 rounded-[8px] bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white flex items-center justify-center shadow-xs shrink-0">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="hidden min-[360px]:inline text-[17px] xl:text-[18px] font-bold tracking-tight whitespace-nowrap">
                {t.brand.name}
              </span>
            </Link>

            <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-2.5 xl:px-3 py-1.5 rounded-[8px] text-[13.5px] xl:text-[14px] font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-[#2563EB] font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Desktop Actions (wide inline search >=1400px, modal search button 1024-1399px) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <form
              onSubmit={handleInlineSearch}
              className="hidden min-[1400px]:flex items-center h-9 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC]/90 overflow-hidden"
            >
              <div className="relative flex items-center border-r border-[#E2E8F0] bg-white/80 h-full">
                <select
                  aria-label={t.nav.browse}
                  value={browseTarget}
                  onChange={(e) => setBrowseTarget(e.target.value as 'courses' | 'videos')}
                  className="appearance-none bg-transparent pl-3 pr-7 h-full text-[12px] font-medium text-[#0F172A] outline-none cursor-pointer"
                >
                  <option value="courses">{t.nav.browse}</option>
                  <option value="videos">{t.nav.videos}</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-[#64748B] pointer-events-none absolute right-2" />
              </div>
              <input
                type="search"
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                placeholder={t.nav.searchShortPlaceholder}
                className="w-36 2xl:w-44 px-3 h-full bg-transparent text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              />
              <button
                type="submit"
                aria-label={t.nav.search}
                className="px-2.5 h-full text-[#64748B] hover:text-[#2563EB] cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Compact Search trigger for 1024px–1399px so nav never collides */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              className="min-[1400px]:hidden inline-flex items-center gap-1.5 h-9 px-2.5 xl:px-3 rounded-[8px] border border-[#E2E8F0] bg-white/85 text-[13px] text-[#64748B] hover:text-[#0F172A] cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">{t.nav.search}</span>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={API_CONFIG.userAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center h-9 px-3 rounded-[8px] bg-[#EFF6FF] text-[#2563EB] text-[13px] font-medium hover:bg-[#DBEAFE] whitespace-nowrap"
                >
                  {user.fullName.split(' ')[0]} · {t.nav.myLearning}
                </a>
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label={t.nav.logout}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-[#E2E8F0] text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer shrink-0"
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
                    className="h-9 px-3 xl:px-3.5 rounded-[8px] border-[#E2E8F0] bg-white/90 text-[#0F172A] whitespace-nowrap"
                  >
                    {t.nav.login}
                  </Button>
                </Link>
                <Link to="/register" className="shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-9 px-3 xl:px-3.5 rounded-[8px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white whitespace-nowrap"
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
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[#E2E8F0] bg-white/90 text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer transition-colors shrink-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-[#475569]" />
              )}
            </button>

            {/* Globe Language Switcher EN / ខ្មែរ */}
            <button
              type="button"
              onClick={() => handleLanguageChange(locale === 'en' ? 'km' : 'en')}
              aria-label="Switch language (EN / ខ្មែរ)"
              title={locale === 'en' ? 'Switch to Khmer (ខ្មែរ)' : 'Switch to English (EN)'}
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-full border border-[#E2E8F0] bg-white/90 text-[12px] font-semibold text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer transition-colors shrink-0 whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 text-[#475569]" />
              <span>{locale === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Demo State Switcher */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDemoMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1 h-9 px-2 xl:px-2.5 rounded-[8px] border border-[#E2E8F0] bg-white/80 text-[11px] font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer whitespace-nowrap"
                title="Switch test persona state"
                aria-label={t.nav.demoAccess}
              >
                <UserCheck className="h-3.5 w-3.5 text-[#2563EB] shrink-0" />
                <span className="hidden xl:inline">
                  {user ? `${user.activePlan.toUpperCase()}` : 'Visitor'}
                </span>
              </button>
              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-[12px] border border-[#E2E8F0] shadow-lg p-2 z-50"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <p className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {t.nav.demoAccess}
                  </p>
                  {demoPresets.map(([preset, label]) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        switchDemoPreset(preset);
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-[8px] text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile & Tablet Header Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t.nav.switchToLight : t.nav.switchToDark}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#E2E8F0] bg-white/90 text-[#0F172A] cursor-pointer shrink-0"
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
              className="h-9 px-2.5 rounded-full border border-[#E2E8F0] bg-white/90 text-[12px] font-semibold text-[#0F172A] cursor-pointer inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
              aria-label="Switch language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{locale === 'en' ? 'ខ្មែរ' : 'EN'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white/90 text-[#0F172A] cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t.nav.menu}
              className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white/90 text-[#0F172A] cursor-pointer shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-[#0F172A]/45 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="ml-auto w-[300px] max-w-[85vw] h-full bg-white border-l border-[#E2E8F0] p-5 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <span className="font-bold text-[17px] text-[#0F172A]">{t.brand.name}</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t.nav.close}
                  className="p-1.5 rounded-[8px] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3.5 py-2.5 rounded-[8px] text-[15px] font-medium ${
                        isActive
                          ? 'bg-[#EFF6FF] text-[#2563EB]'
                          : 'text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-3">
                <p className="text-[12px] font-semibold text-[#64748B]">
                  {t.common.language}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('en')}
                    className={`h-10 rounded-[8px] border text-[13px] font-medium cursor-pointer ${
                      locale === 'en'
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange('km')}
                    className={`h-10 rounded-[8px] border text-[13px] font-medium cursor-pointer ${
                      locale === 'km'
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                        : 'border-[#E2E8F0] text-[#0F172A]'
                    }`}
                  >
                    ភាសាខ្មែរ (KM)
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E2E8F0] space-y-2">
                <p className="text-[12px] font-semibold text-[#64748B]">{t.nav.demoAccess}</p>
                <div className="flex flex-col gap-1">
                  {demoPresets.map(([preset, label]) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        switchDemoPreset(preset);
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-3 py-1.5 rounded-[8px] text-[13px] text-[#475569] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[#E2E8F0] space-y-2.5">
              {isAuthenticated && user ? (
                <>
                  <p className="text-[13px] text-[#64748B]">
                    {user.fullName} ({user.activePlan.toUpperCase()})
                  </p>
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
