import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home, PlayCircle } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import { DotPattern } from '@/components/ui/DotPattern';
import { useI18n } from '@/i18n/I18nContext';

export const NotFoundPage: React.FC = () => {
  const { t, pickText } = useI18n();

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <DotPattern
        width={22}
        height={22}
        className="[mask-image:radial-gradient(500px_circle_at_50%_40%,white,transparent)] opacity-50 dark:opacity-35"
      />
      <div className="container-page relative z-10">
        <div className="max-w-xl mx-auto geist-card rounded-[16px] p-8 md:p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ds-gray-100)] border border-[var(--color-border)] font-mono-custom text-[12px] font-semibold text-[var(--text-muted)]">
            404 · {pickText({ en: 'Page Not Found', km: 'រកមិនឃើញទំព័រ' })}
          </div>

          <div className="space-y-2.5">
            <h1 className="text-h1 text-[var(--text-main)]">
              {pickText({ en: 'We could not find that page', km: 'មិនអាចស្វែងរកទំព័រនេះបានទេ' })}
            </h1>
            <p className="text-body text-[var(--text-muted)]">
              {pickText({
                en: 'The page may have moved or the link is outdated.',
                km: 'ទំព័រនេះប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬតំណភ្ជាប់មិនត្រឹមត្រូវ។',
              })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <Link to="/" className={buttonClasses({ variant: 'primary', size: 'md' })}>
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>{t.nav.home}</span>
            </Link>
            <Link to="/courses" className={buttonClasses({ variant: 'outline', size: 'md' })}>
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>{t.nav.courses}</span>
            </Link>
            <Link to="/videos" className={buttonClasses({ variant: 'outline', size: 'md' })}>
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              <span>{t.nav.videos}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
