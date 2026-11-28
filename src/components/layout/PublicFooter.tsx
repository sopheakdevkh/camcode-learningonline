import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { BrandMark } from './PublicHeader';

export const PublicFooter: React.FC = () => {
  const { t, pickText } = useI18n();
  const [openCol, setOpenCol] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const mainLinks = [
    { to: '/', label: t.nav.home },
    { to: '/courses', label: t.nav.courses },
    { to: '/videos', label: t.nav.videos },
    { to: '/categories', label: t.nav.categories },
    { to: '/trainers', label: t.nav.trainers },
    { to: '/pricing', label: t.nav.pricing },
  ];

  const categoryLinks = [
    {
      to: '/courses?category=digital-marketing',
      label: pickText({ en: 'Digital Marketing', km: 'ទីផ្សារឌីជីថល' }),
    },
    {
      to: '/courses?category=software-engineering',
      label: pickText({ en: 'Software Engineering', km: 'អភិវឌ្ឍន៍កម្មវិធី' }),
    },
    {
      to: '/courses?category=ui-ux-design',
      label: pickText({ en: 'UI/UX Design', km: 'រចនា UI/UX' }),
    },
    {
      to: '/courses?category=business-finance',
      label: pickText({ en: 'Business & Finance', km: 'ធុរកិច្ច និងហិរញ្ញវត្ថុ' }),
    },
    {
      to: '/courses?category=data-ai',
      label: pickText({ en: 'Data & AI', km: 'ទិន្នន័យ និង AI' }),
    },
  ];

  const companyLinks = [
    { to: '/about', label: t.footer.about },
    { to: '/faq', label: t.footer.faq },
    { to: '/contact', label: t.footer.contact },
    { to: '/terms', label: t.footer.terms },
    { to: '/privacy', label: t.footer.privacy },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative z-10 border-t border-[#ded8ca] dark:border-[#2A332E] bg-[#EFECE5] dark:bg-[#141916] pt-16 md:pt-20 transition-colors">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        {/* 4-Column Top Grid: Col 1 (2fr) Brand+Newsletter | Col 2-4 (1fr each) Sitemap | Row 2 Col 1 Get in Touch */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Child 1: Brand + Description + Pill Newsletter */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 text-[#141312] dark:text-[#f6f3ec]">
              <BrandMark />
              <span className="font-serif-display text-[24px] leading-none font-normal tracking-[-0.02em]">
                {t.brand.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-[1.6] text-[#6e6a62]">
              {t.footer.aboutDesc}
            </p>

            <div className="mt-6">
              {subscribed ? (
                <p className="font-mono-tech text-[12px] font-medium text-[#1c5b48] dark:text-[#7CD4B5] py-2">
                  ✓ {t.footer.newsletterSuccess}
                </p>
              ) : (
                <form onSubmit={handleSubscribe} noValidate>
                  <label htmlFor="footer-newsletter" className="sr-only">
                    {t.footer.newsletterPlaceholder}
                  </label>
                  <div className="flex max-w-sm items-center gap-3">
                    <input
                      id="footer-newsletter"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.footer.newsletterPlaceholder}
                      className="h-[52px] flex-1 min-w-0 rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] px-4 text-[16px] sm:text-[17px] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-200 placeholder:text-[#6e6a62] hover:border-[#AEA595] focus-visible:border-[#1c5b48] dark:focus-visible:border-[#2D7A62] outline-none"
                    />
                    <button
                      type="submit"
                      aria-label={t.footer.subscribeBtn}
                      className="group grid size-[52px] shrink-0 place-items-center rounded-full bg-[#1c5b48] hover:bg-[#15463a] dark:bg-[#2D7A62] dark:hover:bg-[#23634F] text-white transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="h-5 w-5 swiss-arrow-shift" />
                    </button>
                  </div>
                  <p className="mt-3 max-w-sm text-[12.5px] text-[#6e6a62]">
                    {t.footer.newsletterDesc}
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Child 2 (Desktop): Platform Column */}
          <div className="hidden md:block">
            <h2 className="font-mono-tech text-[10.5px] uppercase tracking-[0.12em] text-[#6e6a62] m-0">
              {t.footer.platformCol}
            </h2>
            <ul className="mt-5 grid gap-3">
              {mainLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-7 items-center text-[14.5px] text-[#6e6a62] transition-colors hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Child 3 (Desktop): Disciplines Column */}
          <div className="hidden md:block">
            <h2 className="font-mono-tech text-[10.5px] uppercase tracking-[0.12em] text-[#6e6a62] m-0">
              {t.footer.companyCol}
            </h2>
            <ul className="mt-5 grid gap-3">
              {categoryLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-7 items-center text-[14.5px] text-[#6e6a62] transition-colors hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Child 4 (Desktop): Legal & Company Column */}
          <div className="hidden md:block">
            <h2 className="font-mono-tech text-[10.5px] uppercase tracking-[0.12em] text-[#6e6a62] m-0">
              {t.footer.legalCol}
            </h2>
            <ul className="mt-5 grid gap-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex min-h-7 items-center text-[14.5px] text-[#6e6a62] transition-colors hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Accordion Columns */}
          <div className="md:hidden divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-y border-[#ded8ca] dark:border-[#2A332E]">
            {[
              { id: 'main', title: t.footer.platformCol, links: mainLinks },
              { id: 'cats', title: t.footer.companyCol, links: categoryLinks },
              { id: 'legal', title: t.footer.legalCol, links: companyLinks },
            ].map((col) => {
              const isOpen = openCol === col.id;
              return (
                <div key={col.id}>
                  <button
                    type="button"
                    onClick={() => setOpenCol(isOpen ? null : col.id)}
                    className="w-full py-3.5 flex items-center justify-between text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec]"
                  >
                    <span>{col.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6e6a62] transition-transform ${
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
                            className="text-[14px] text-[#6e6a62] hover:text-[#1c5b48]"
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

          {/* Child 5: Get in Touch (wraps cleanly into Row 2, Column 1 under Newsletter on Desktop) */}
          <div className="md:pt-2">
            <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.12em] text-[#6e6a62]">
              Get in touch
            </p>
            <ul className="mt-5 grid gap-4">
              <li className="pl-[14px]">
                <p className="font-mono-tech text-[11px] text-[#6e6a62]">
                  {pickText({ en: 'Admissions', km: 'ការចុះឈ្មោះ' })}
                </p>
                <a
                  href="tel:+85523900123"
                  className="font-mono-tech text-[13px] mt-1 flex items-center gap-2 text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>+855 23 900 123</span>
                </a>
                <a
                  href="mailto:admissions@camcodelearn.example"
                  className="mt-1 flex items-center gap-2 text-[13.5px] text-[#6e6a62] hover:text-[#1c5b48]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>admissions@camcodelearn.example</span>
                </a>
              </li>

              <li className="border-l-2 border-[#1c5b48] dark:border-[#2D7A62] pl-3">
                <p className="font-mono-tech text-[11px] text-[#6e6a62]">
                  {pickText({ en: 'Learner Support Desk', km: 'មជ្ឈមណ្ឌលជំនួយសិស្ស' })}
                </p>
                <a
                  href="tel:+85523900124"
                  className="font-mono-tech text-[13px] mt-1 flex items-center gap-2 text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>+855 23 900 124</span>
                </a>
                <a
                  href="mailto:support@camcodelearn.example"
                  className="mt-1 flex items-center gap-2 text-[13.5px] text-[#6e6a62] hover:text-[#1c5b48]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>support@camcodelearn.example</span>
                </a>
              </li>

              <li className="pl-[14px]">
                <p className="font-mono-tech text-[11px] text-[#6e6a62]">
                  {pickText({ en: 'Partnerships', km: 'ភាពជាដៃគូ' })}
                </p>
                <a
                  href="tel:+85523900125"
                  className="font-mono-tech text-[13px] mt-1 flex items-center gap-2 text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>+855 23 900 125</span>
                </a>
                <a
                  href="mailto:partners@camcodelearn.example"
                  className="mt-1 flex items-center gap-2 text-[13.5px] text-[#6e6a62] hover:text-[#1c5b48]"
                >
                  <Mail className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>partners@camcodelearn.example</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Social Icons */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#ded8ca] dark:border-[#2A332E] py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] text-[#6e6a62]">
              © {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}
            </p>
          </div>
          <ul aria-label="Social media" className="flex items-center gap-2">
            {[
              { label: 'LinkedIn', icon: <Linkedin className="h-[18px] w-[18px]" /> },
              { label: 'Instagram', icon: <Instagram className="h-[18px] w-[18px]" /> },
              { label: 'X', icon: <Twitter className="h-[18px] w-[18px]" /> },
              { label: 'YouTube', icon: <Youtube className="h-[18px] w-[18px]" /> },
            ].map((social) => (
              <li key={social.label}>
                <Link
                  to="/contact"
                  aria-label={social.label}
                  className="grid size-11 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] text-[#6e6a62] transition-colors hover:border-[#141312] hover:text-[#141312] dark:hover:text-[#f6f3ec]"
                >
                  {social.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
