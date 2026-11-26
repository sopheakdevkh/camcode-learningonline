import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, GraduationCap, Mail, MessageCircle, Phone, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/I18nContext';

export const PublicFooter: React.FC = () => {
  const { t, pickText } = useI18n();
  const [openCol, setOpenCol] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const mainLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.footer.about },
    { to: '/courses', label: t.nav.courses },
    { to: '/videos', label: t.nav.videos },
    { to: '/pricing', label: t.nav.pricing },
  ];

  const categoryLinks = [
    {
      to: '/courses?category=digital-marketing',
      label: pickText({ en: 'Digital Marketing', km: 'ទីផ្សារឌីជីថល' }),
    },
    {
      to: '/courses?category=software-engineering',
      label: pickText({ en: 'Software Dev', km: 'អភិវឌ្ឍន៍កម្មវិធី' }),
    },
    {
      to: '/courses?category=ui-ux-design',
      label: pickText({ en: 'Design & Style', km: 'រចនា UI/UX' }),
    },
    {
      to: '/courses?category=business-finance',
      label: pickText({ en: 'Business', km: 'ធុរកិច្ច' }),
    },
    {
      to: '/courses?category=data-ai',
      label: pickText({ en: 'Data & AI', km: 'ទិន្នន័យ និង AI' }),
    },
    {
      to: '/courses?category=creative-video',
      label: pickText({ en: 'Video Studio', km: 'ផលិតវីដេអូ' }),
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return;
    setSubscribed(true);
    setEmail('');
    toast.success(t.footer.newsletterSuccess);
  };

  return (
    <footer className="relative z-10 border-t border-border dark:border-slate-700/60 bg-white/75 dark:bg-[#0b1120]/80 backdrop-blur-md mt-16 transition-colors">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brand + Contact + Socials (matching Known footer left) */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-secondary">
              <span className="h-8 w-8 rounded-[8px] bg-linear-to-br from-primary to-[#60A5FA] text-white flex items-center justify-center">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <span className="text-[18px] font-bold">{t.brand.name}</span>
            </Link>
            <div className="space-y-2 text-[13px] text-[#475569]">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted" />
                <span>support@camcodelearn.example</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted" />
                <span>+855 23 900 123</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { label: 'Website & Community', icon: <Globe className="h-4 w-4" /> },
                { label: 'Video Channel', icon: <PlayCircle className="h-4 w-4" /> },
                { label: 'Contact Support', icon: <MessageCircle className="h-4 w-4" /> },
              ].map((social) => (
                <Link
                  key={social.label}
                  to="/contact"
                  aria-label={social.label}
                  className="h-9 w-9 rounded-full border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-primary flex items-center justify-center hover:border-primary transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Center Navigation Columns (Main + Categories) */}
          <div className="hidden md:grid md:col-span-5 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-[14px] font-semibold text-secondary mb-3.5">
                {t.footer.platformCol}
              </h4>
              <ul className="space-y-2.5">
                {mainLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2">
              <h4 className="text-[14px] font-semibold text-secondary mb-3.5">
                {t.footer.companyCol}
              </h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {categoryLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-[13px] text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile Accordion Links */}
          <div className="md:hidden divide-y divide-border border-y border-border">
            {[
              { id: 'main', title: t.footer.platformCol, links: mainLinks },
              { id: 'cats', title: t.footer.companyCol, links: categoryLinks },
            ].map((col) => {
              const isOpen = openCol === col.id;
              return (
                <div key={col.id}>
                  <button
                    type="button"
                    onClick={() => setOpenCol(isOpen ? null : col.id)}
                    className="w-full py-3.5 flex items-center justify-between text-[14px] font-semibold text-secondary"
                  >
                    <span>{col.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="pb-4 space-y-2">
                      {col.links.map((link) => (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="text-[14px] text-muted hover:text-primary"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          {/* Newsletter Card (matching Known template's soft pastel card) */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-linear-to-br from-[#FDE2E4]/95 via-[#FAF0CA]/80 to-[#D8F3DC]/95 dark:from-slate-800/95 dark:via-slate-800/90 dark:to-slate-900/95 border border-white/80 dark:border-slate-700/60 p-5 space-y-3 shadow-sm">
              <h4 className="text-[16px] font-semibold text-secondary">
                {t.footer.newsletterTitle}
              </h4>
              <p className="text-[13px] text-[#475569] leading-relaxed">
                {t.footer.newsletterDesc}
              </p>

              {subscribed ? (
                <p className="text-[13px] font-medium text-success">
                  ✓ {t.footer.newsletterSuccess}
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2 pt-1">
                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.footer.newsletterPlaceholder}
                    aria-label={t.footer.newsletterPlaceholder}
                    className="flex-1 min-w-0 h-10 px-3 rounded-[8px] bg-white dark:bg-slate-900/90 border border-white dark:border-slate-700 text-[13px] text-secondary placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-[8px] bg-primary hover:bg-primary-hover text-white text-[13px] font-medium shrink-0 cursor-pointer transition-colors"
                  >
                    {t.footer.subscribeBtn}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-muted">
          <p>
            © {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/faq" className="hover:text-primary">
              {t.footer.faq}
            </Link>
            <Link to="/terms" className="hover:text-primary">
              {t.footer.terms}
            </Link>
            <Link to="/privacy" className="hover:text-primary">
              {t.footer.privacy}
            </Link>
            <Link to="/contact" className="hover:text-primary">
              {t.footer.contact}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
