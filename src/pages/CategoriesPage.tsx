import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Check,
  GitBranch,
  Minus,
} from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Category } from '@/types';

export const CategoriesPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  const planRows = [
    {
      feature: pickText({ en: 'Bilingual EN / KM curriculum', km: 'កម្មវិធីសិក្សាពីរភាសា (អង់គ្លេស / ខ្មែរ)' }),
      free: true,
      basic: true,
      premium: true,
      typical: false,
    },
    {
      feature: pickText({ en: 'Curated video streaming library', km: 'បណ្ណាល័យវីដេអូសិក្សាពេញលេញ' }),
      free: false,
      basic: true,
      premium: true,
      typical: false,
    },
    {
      feature: pickText({ en: 'Downloadable templates & labs', km: 'ឯកសារគំរូ និងលំហាត់អនុវត្ត' }),
      free: true,
      basic: true,
      premium: true,
      typical: false,
    },
    {
      feature: pickText({ en: 'Mentor Q&A & cohort check-ins', km: 'ការណែនាំផ្ទាល់ពីគ្រូបង្រៀន' }),
      free: false,
      basic: true,
      premium: true,
      typical: false,
    },
    {
      feature: pickText({ en: 'Team seats & API progress sync', km: 'របាយការណ៍ក្រុម និង API សិក្សា' }),
      free: false,
      basic: false,
      premium: true,
      typical: false,
    },
    {
      feature: pickText({ en: 'Verified completion certificates', km: 'វិញ្ញាបនបត្របញ្ជាក់ការសិក្សាផ្លូវការ' }),
      free: true,
      basic: true,
      premium: true,
      typical: false,
    },
  ];

  const avatars = ['SC', 'AP', 'CL', 'DV', 'SM', 'BK'];

  const testimonials = [
    {
      quote: pickText({
        en: 'Clear weekly structure with exercises you actually use on the job. My team completed the analytics track without falling behind.',
        km: 'មេរៀនមានរចនាសម្ព័ន្ធច្បាស់លាស់ និងអនុវត្តផ្ទាល់ក្នុងការងារ។ ក្រុមការងារខ្ញុំបានបញ្ចប់វគ្គវិភាគទិន្នន័យយ៉ាងមានប្រសិទ្ធភាព។',
      }),
      author: 'Sokha Chan',
      role: pickText({ en: 'Marketing Lead, Phnom Penh Digital', km: 'ប្រធានផ្នែកទីផ្សារ · Phnom Penh Digital' }),
      track: 'Digital Marketing Track',
    },
    {
      quote: pickText({
        en: 'Having bilingual transcripts alongside real TypeScript architecture walkthroughs saved our junior engineers months of guesswork.',
        km: 'ការមានអត្ថបទពន្យល់ពីរភាសា រួមជាមួយគម្រោង TypeScript ពិតប្រាកដ បានជួយក្រុមវិស្វករថ្មីរបស់យើងយល់ដឹងលឿនជាងមុន។',
      }),
      author: 'Sovannarith Phan',
      role: pickText({ en: 'Engineering Manager, Mekong Tech', km: 'ប្រធានក្រុមវិស្វករ · Mekong Tech' }),
      track: 'Full-Stack Engineering Track',
    },
    {
      quote: pickText({
        en: 'UI systems clear or confuse every product we ship. Camcode walks through real accessibility and design tokens step by step.',
        km: 'Camcode បង្ហាញពីការរចនា Design System និង UI/UX ជាជំហានៗ ច្បាស់លាស់ និងងាយស្រួលអនុវត្ត។',
      }),
      author: 'Channary Ly',
      role: pickText({ en: 'Product Designer, Angkor Cloud', km: 'អ្នករចនាផលិតផល · Angkor Cloud' }),
      track: 'UI/UX & Design Systems Track',
    },
  ];

  const partnerMarks = [
    { label: 'Phnom Penh Digital', cls: 'font-body text-[15px] font-semibold uppercase tracking-[0.2em]' },
    { label: 'Mekong Lab', cls: 'font-serif-display text-[23px] leading-none' },
    { label: 'Angkor Cloud', cls: 'font-body text-[15px] font-semibold uppercase tracking-[0.06em]' },
    { label: 'Khmer UX', cls: 'font-body text-[17px] font-medium uppercase tracking-[0.04em]' },
    { label: 'Kampuchea Dev', cls: 'font-body text-[15px] font-normal tracking-[0.08em]' },
    { label: 'Tonle Studio', cls: 'font-serif-display text-[20px] uppercase tracking-[0.1em] leading-none' },
  ];

  return (
    <div className="min-h-screen bg-[#f6f3ec] dark:bg-[#101412]">
      {/* 1. Original Project Editorial Hero */}
      <PageHero
        eyebrow={`LEARNING TRACKS · ${String(categories.length || 6).padStart(2, '0')} DISCIPLINES`}
        title={t.home.categoriesTitle}
        description={t.home.categoriesSub}
      />

      {/* 2. Sticky Left Overview + Stacked Discipline / Service Cards (Exact /services layout & card colors) */}
      <section className="surface-paper py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
            <div className="md:sticky md:top-[120px] md:self-start">
              <span className="t-eyebrow inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-line bg-canvas text-body dark:border-[#2A332E] dark:bg-[#151A17] dark:text-[#D5D1C8]">
                <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-accent" />
                {pickText({ en: 'Discipline tracks', km: 'ជំនាញសិក្សាស្នូល' })}
              </span>

              <h2 className="t-h2 mt-5">
                {pickText({
                  en: 'Six disciplines, one workspace',
                  km: 'ជំនាញទាំង ៦ ក្នុងកម្មវិធីសិក្សាតែមួយ',
                })}
              </h2>

              <p className="mt-4 max-w-md text-[17px] leading-[1.65] text-body">
                {pickText({
                  en: 'Each discipline is taught by industry practitioners and connected seamlessly inside your learner workspace.',
                  km: 'ជំនាញនីមួយៗបង្រៀនដោយអ្នកជំនាញអនុវត្តផ្ទាល់ និងរៀបចំរចនាសម្ព័ន្ធច្បាស់លាស់ក្នុងប្រព័ន្ធសិក្សាតែមួយ។',
                })}
              </p>

              <div className="mt-8 hidden md:block">
                <Link
                  to="/contact"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-body text-[15px] font-semibold transition-[background-color,border-color,color,translate] duration-[0.22s] ease-[var(--x-ease)] px-6 bg-accent text-on-accent hover:bg-accent-deep active:translate-y-px"
                >
                  <span>{pickText({ en: 'Request guidance', km: 'ស្នើសុំការណែនាំ' })}</span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-[0.22s] ease-[var(--x-ease)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>

            <ul className="grid gap-4">
              {categories.map((cat, idx) => (
                <li key={cat.id}>
                  <article className="card-note group p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="t-h3">
                        {pickText(cat.name)}
                      </h3>
                      <span aria-hidden="true" className="index-number mt-1.5 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="mt-3 text-[15px] leading-[1.6] text-body">
                      {pickText(cat.description)}
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      <li>
                        <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[13px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#42524A]">
                          {cat.courseCount} {t.nav.courses}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[13px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#42524A]">
                          {cat.videoCount} {t.nav.videos}
                        </span>
                      </li>
                      <li>
                        <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[13px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#42524A]">
                          EN · ខ្មែរ
                        </span>
                      </li>
                    </ul>

                    <Link
                      to={`/courses?category=${cat.slug}`}
                      className="group inline-flex min-h-11 items-center gap-2 font-body text-[15px] font-semibold underline-offset-[6px] transition-colors duration-[0.22s] hover:underline text-ink hover:text-accent mt-4"
                    >
                      <span>
                        {pickText({
                          en: `Explore ${cat.name.en}`,
                          km: `មើលវគ្គ ${cat.name.km}`,
                        })}
                      </span>
                      <ArrowUpRight
                        className="h-[18px] w-[18px] shrink-0 transition-transform duration-[0.22s] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </article>
                </li>
              ))}
            </ul>

            <div className="md:hidden">
              <Link
                to="/contact"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-body text-[15px] font-semibold transition-[background-color,border-color,color,translate] duration-[0.22s] ease-[var(--x-ease)] px-6 bg-accent text-on-accent hover:bg-accent-deep active:translate-y-px"
              >
                <span>{pickText({ en: 'Request guidance', km: 'ស្នើសុំការណែនាំ' })}</span>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 transition-transform duration-[0.22s] ease-[var(--x-ease)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dotted Band: Track Builder Showcase + Stats & Quote */}
      <section className="surface-dots border-y border-[#ded8ca] dark:border-[#2A332E] py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#4c4842] dark:text-[#D5D1C8] font-mono text-[10.5px] uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-[#1c5b48]" />
              {pickText({ en: 'Inside the path', km: 'រចនាសម្ព័ន្ធកម្មវិធីសិក្សា' })}
            </span>
            <h2 className="mt-5 font-serif-display text-[36px] sm:text-[46px] leading-[1.06] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
              {pickText({
                en: 'How a Camcode learning track is built',
                km: 'របៀបរៀបចំផែនការសិក្សាលើ Camcode',
              })}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2">
            {/* Left Showcase Card: Track Builder */}
            <div className="min-w-0">
              <div className="flex h-full flex-col rounded-[28px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] p-5 shadow-[0_1px_2px_rgba(20,19,18,0.05)]">
                <p className="t-method flex items-center gap-2 text-[#141312] dark:text-[#f6f3ec]">
                  <GitBranch className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                  <span>{pickText({ en: 'Track builder', km: 'កម្មវិធីរៀបចំវគ្គសិក្សា' })}</span>
                </p>

                <div className="mt-5 grid gap-3.5">
                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-[#6e6a62]">
                      {pickText({ en: 'Discipline', km: 'មុខវិជ្ជា' })}
                    </p>
                    <div className="flex h-12 items-center rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-3.5">
                      <span className="font-mono text-[13.5px] truncate text-[#141312] dark:text-[#f6f3ec]">
                        Full-Stack Software Engineering
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                      {pickText({ en: 'Target milestone', km: 'គោលដៅជំនាញ' })}
                    </p>
                    <div className="flex h-12 items-center rounded-[10px] border border-[#1c5b48] bg-[#f6f3ec] dark:bg-[#101412] px-3.5 [box-shadow:0_0_0_2px_#f6f3ec,0_0_0_4px_#1c5b48] dark:[box-shadow:0_0_0_2px_#151A17,0_0_0_4px_#2D7A62]">
                      <span className="font-mono text-[13.5px] truncate text-[#141312] dark:text-[#f6f3ec]">
                        Production TypeScript &amp; API Architecture
                      </span>
                      <span aria-hidden="true" className="ml-1 inline-block h-4 w-px bg-[#1c5b48] dark:bg-[#7CD4B5]" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-[#6e6a62]">
                      {pickText({ en: 'Format', km: 'ទម្រង់សិក្សា' })}
                    </p>
                    <div className="flex h-12 items-center rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-3.5">
                      <span className="font-mono text-[13.5px] truncate text-[#141312] dark:text-[#f6f3ec]">
                        Bilingual video + hands-on labs
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-[#6e6a62]">
                      {pickText({ en: 'Weekly cadence', km: 'ល្បឿនសិក្សាប្រចាំសប្តាហ៍' })}
                    </p>
                    <div className="flex h-12 items-center rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-3.5">
                      <span className="font-mono text-[13.5px] truncate text-[#141312] dark:text-[#f6f3ec]">
                        4 – 6 hours · Self-paced + Mentor Q&amp;A
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[13px] font-medium text-[#6e6a62]">
                      {pickText({ en: 'Credential', km: 'វិញ្ញាបនបត្រ' })}
                    </p>
                    <div className="flex h-12 items-center rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412] px-3.5">
                      <span className="font-mono text-[13.5px] truncate text-[#141312] dark:text-[#f6f3ec]">
                        Verified QR Certificate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dual KPI Box + Quote Card with Partner Rail */}
            <div className="grid min-w-0 gap-4">
              <div className="grid min-w-0 grid-cols-2 rounded-[18px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17]">
                <div className="p-6 border-r border-[#ded8ca] dark:border-[#2A332E]">
                  <AnimatedNumber
                    value={120}
                    suffix="+"
                    className="t-number-md block text-[#141312] dark:text-[#f6f3ec]"
                  />
                  <p className="mt-2 text-[15px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                    {pickText({ en: 'Structured courses', km: 'វគ្គសិក្សាមានរចនាសម្ព័ន្ធ' })}
                  </p>
                  <p className="t-method mt-1">2026 Catalog</p>
                </div>

                <div className="p-6">
                  <AnimatedNumber
                    value={450}
                    suffix="+"
                    className="t-number-md block text-[#141312] dark:text-[#f6f3ec]"
                  />
                  <p className="mt-2 text-[15px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                    {pickText({ en: 'Streaming lessons', km: 'មេរៀនវីដេអូស៊ីជម្រៅ' })}
                  </p>
                  <p className="t-method mt-1">EN · ខ្មែរ Bilingual</p>
                </div>
              </div>

              <figure className="min-w-0 rounded-[18px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <blockquote>
                    <p className="font-serif-display text-[clamp(22px,2.2vw,28px)] leading-[1.28] text-[#141312] dark:text-[#f6f3ec]">
                      {pickText({
                        en: 'Six out of ten students complete multiple consecutive tracks within a single year. That is the metric we actually watch.',
                        km: 'សិស្សភាគច្រើនបន្តសិក្សាច្រើនជំនាញជាប់គ្នាក្នុងរយៈពេលមួយឆ្នាំ ព្រោះមេរៀនតភ្ជាប់ផ្ទាល់ទៅនឹងការងារជាក់ស្តែង។',
                      })}
                    </p>
                  </blockquote>
                  <figcaption className="mt-5">
                    <p className="text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                      Dara Chea
                    </p>
                    <p className="text-[13px] text-[#4c4842] dark:text-[#D5D1C8]">
                      {pickText({ en: 'Principal Instructor & Curriculum Lead', km: 'គ្រូបង្រៀនជាន់ខ្ពស់ និងអ្នករៀបចំកម្មវិធីសិក្សា' })}
                    </p>
                  </figcaption>
                </div>

                <ul
                  aria-label="Teams using Camcode tracks"
                  className="mt-6 flex items-center gap-6 overflow-x-auto no-scrollbar border-t border-[#ded8ca] dark:border-[#2A332E] pt-5"
                >
                  {partnerMarks.map((p) => (
                    <li key={p.label} className="shrink-0">
                      <span className="inline-flex h-6 items-center text-[#6e6a62] scale-[0.78] origin-left whitespace-nowrap">
                        <span className={p.cls}>{p.label}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: What each plan includes */}
      <section className="surface-paper py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#4c4842] dark:text-[#D5D1C8] font-mono text-[10.5px] uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-[#1c5b48]" />
              {pickText({ en: 'Compare', km: 'ប្រៀបធៀប' })}
            </span>
            <h2 className="mt-5 font-serif-display text-[36px] sm:text-[46px] leading-[1.06] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
              {pickText({ en: 'What each plan includes', km: 'អត្ថប្រយោជន៍តាមគម្រោងនីមួយៗ' })}
            </h2>
          </div>

          {/* Desktop Comparison Table */}
          <div className="mt-10 hidden md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Feature comparison across Free, Basic, Premium and unmanaged self-study
              </caption>
              <thead>
                <tr className="border-b border-[#c2baa8] dark:border-[#2A332E]">
                  <th scope="col" className="w-[34%] py-4 text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]" />
                  <th scope="col" className="py-4 text-center text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    {pickText({ en: 'Free', km: 'ឥតគិតថ្លៃ' })}
                  </th>
                  <th scope="col" className="py-4 text-center text-[15px] font-semibold bg-[#e4ede7] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5]">
                    {pickText({ en: 'Basic', km: 'មូលដ្ឋាន' })}
                  </th>
                  <th scope="col" className="py-4 text-center text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    {pickText({ en: 'Premium', km: 'កម្រិតខ្ពស់' })}
                  </th>
                  <th scope="col" className="py-4 text-center text-[15px] font-semibold bg-[#efebe1] dark:bg-[#181E1B] text-[#6e6a62]">
                    {pickText({ en: 'Ad-hoc tutorials', km: 'វីដេអូទូទៅ' })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {planRows.map((row) => (
                  <tr key={row.feature} className="border-b border-[#ded8ca] dark:border-[#2A332E]">
                    <th scope="row" className="py-4 pr-6 text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                      {row.feature}
                    </th>
                    <td className="py-4 text-center">
                      <span className="inline-grid size-7 place-items-center">
                        {row.free ? (
                          <Check className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                        ) : (
                          <Minus className="h-5 w-5 text-[#c2baa8]" aria-hidden="true" />
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-center bg-[#e4ede7] dark:bg-[#1B3028]">
                      <span className="inline-grid size-7 place-items-center">
                        {row.basic ? (
                          <Check className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                        ) : (
                          <Minus className="h-5 w-5 text-[#c2baa8]" aria-hidden="true" />
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="inline-grid size-7 place-items-center">
                        {row.premium ? (
                          <Check className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                        ) : (
                          <Minus className="h-5 w-5 text-[#c2baa8]" aria-hidden="true" />
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-center bg-[#efebe1] dark:bg-[#181E1B]">
                      <span className="inline-grid size-7 place-items-center">
                        {row.typical ? (
                          <Check className="h-5 w-5 text-[#1c5b48]" aria-hidden="true" />
                        ) : (
                          <Minus className="h-5 w-5 text-[#c2baa8]" aria-hidden="true" />
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison Cards */}
          <ul className="mt-8 grid gap-4 md:hidden">
            {[
              {
                name: pickText({ en: 'Free', km: 'ឥតគិតថ្លៃ' }),
                key: 'free' as const,
                cardClass: 'border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17]',
              },
              {
                name: pickText({ en: 'Basic', km: 'មូលដ្ឋាន' }),
                key: 'basic' as const,
                cardClass: 'border-[#1c5b48] bg-[#e4ede7] dark:bg-[#1B3028]',
              },
              {
                name: pickText({ en: 'Premium', km: 'កម្រិតខ្ពស់' }),
                key: 'premium' as const,
                cardClass: 'border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17]',
              },
              {
                name: pickText({ en: 'Ad-hoc tutorials', km: 'វីដេអូទូទៅ' }),
                key: 'typical' as const,
                cardClass: 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#181E1B]',
              },
            ].map((tier) => (
              <li key={tier.name}>
                <article className={`rounded-[18px] border p-5 ${tier.cardClass}`}>
                  <h3 className="font-serif-display text-[24px] text-[#141312] dark:text-[#f6f3ec]">
                    {tier.name}
                  </h3>
                  <ul className="mt-4 divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-t border-[#ded8ca] dark:border-[#2A332E]">
                    {planRows.map((row) => (
                      <li key={row.feature} className="flex items-center justify-between gap-4 py-2.5">
                        <span className="text-[14.5px] text-[#4c4842] dark:text-[#D5D1C8]">
                          {row.feature}
                        </span>
                        <span className="inline-grid size-7 place-items-center shrink-0">
                          {row[tier.key] ? (
                            <Check className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                          ) : (
                            <Minus className="h-5 w-5 text-[#c2baa8]" aria-hidden="true" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Dark Ink Social Proof Band (Exact /services surface-ink + AnimatedNumber + ph-portrait) */}
      <section className="surface-ink py-[96px] md:py-[160px]">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <AnimatedNumber
                value={48000}
                suffix="+"
                inverse
                className="block text-[clamp(56px,7vw,112px)] font-semibold leading-[0.9] tracking-[-0.02em] tabular-nums"
              />
              <p className="mt-4 text-[19px] font-medium text-[#f6f3ec]">
                {pickText({
                  en: 'Learners enrolled across Cambodia',
                  km: 'អ្នកសិក្សាដែលបានចុះឈ្មោះទូទាំងប្រទេស',
                })}
              </p>
              <p className="t-method mt-1">
                {pickText({
                  en: 'Verified progress & certificates issued',
                  km: 'តាមដានវឌ្ឍនភាព និងវិញ្ញាបនបត្រផ្លូវការ',
                })}
              </p>

              <ul aria-label="Featured graduates" className="mt-6 flex items-center">
                {avatars.map((initials, i) => (
                  <li key={initials} className={i > 0 ? '-ml-3' : ''}>
                    <div
                      role="img"
                      aria-label={`Portrait of graduate ${initials}`}
                      className="ph-portrait shrink-0 rounded-full size-10 ring-2 ring-[var(--x-ink)]"
                    >
                      <span aria-hidden="true" className="ph-initials">
                        {initials}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p
              data-reveal="true"
              className="text-[19px] leading-[1.6] text-[var(--x-muted-on-dark)] md:justify-self-end md:text-right"
            >
              {pickText({
                en: 'Three learners who switched from scattered tutorials, and what changed in their first quarter.',
                km: 'អ្នកសិក្សា ៣ នាក់ដែលបានផ្លាស់ប្តូរពីការរៀនរាយប៉ាយ និងលទ្ធផលក្នុងត្រីមាសដំបូង។',
              })}
            </p>
          </div>

          <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
            {testimonials.map((item) => (
              <li key={item.author} data-reveal="true">
                <figure className="h-full rounded-[var(--radius-lg)] border border-[rgb(255_255_255/0.12)] bg-[rgb(255_255_255/0.06)] p-6 flex flex-col justify-between">
                  <blockquote>
                    <p className="text-[17px] leading-[1.6] text-[#f6f3ec]">{item.quote}</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-[rgb(255_255_255/0.12)] pt-4">
                    <p className="text-[15px] font-semibold text-[#f6f3ec]">{item.author}</p>
                    <p className="mt-0.5 text-[13px] text-[var(--x-muted-on-dark)]">{item.role}</p>
                    <span className="t-data mt-3 block text-[var(--x-muted-on-dark)]">
                      {item.track}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Deep Forest Emerald CTA Card with Constellation Mesh SVG */}
      <section className="surface-paper py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="surface-accent relative overflow-hidden rounded-[28px] px-6 py-10 md:px-12 md:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.22] md:bottom-[-60px] md:left-auto md:right-[-90px] md:top-[-60px] md:w-[520px] md:opacity-100"
            >
              <svg viewBox="0 0 620 390" className="h-full w-full">
                <g transform="scale(-1 1) translate(-620 0)">
                  <g transform="rotate(-8 310 195)" stroke="#ffffff">
                    <line x1="40" y1="96" x2="108" y2="48" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="40" y1="96" x2="126" y2="158" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="108" y1="48" x2="188" y2="104" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="126" y1="158" x2="188" y2="104" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="126" y1="158" x2="206" y2="226" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="188" y1="104" x2="252" y2="42" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="188" y1="104" x2="268" y2="164" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="206" y1="226" x2="296" y2="290" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="252" y1="42" x2="318" y2="96" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="268" y1="164" x2="318" y2="96" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="268" y1="164" x2="342" y2="220" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="296" y1="290" x2="342" y2="220" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="318" y1="96" x2="368" y2="34" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="318" y1="96" x2="392" y2="150" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="342" y1="220" x2="392" y2="150" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="342" y1="220" x2="406" y2="300" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="368" y1="34" x2="436" y2="72" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="392" y1="150" x2="436" y2="72" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="392" y1="150" x2="456" y2="238" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="406" y1="300" x2="456" y2="238" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="436" y1="72" x2="478" y2="132" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="456" y1="238" x2="498" y2="348" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="478" y1="132" x2="512" y2="46" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="478" y1="132" x2="524" y2="200" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="498" y1="348" x2="548" y2="290" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="524" y1="200" x2="548" y2="290" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="512" y1="46" x2="566" y2="110" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="524" y1="200" x2="566" y2="110" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="548" y1="290" x2="588" y2="236" strokeWidth="1" strokeOpacity="0.3" />
                    <line x1="566" y1="110" x2="588" y2="236" strokeWidth="1" strokeOpacity="0.3" />
                    <circle cx="40" cy="96" r="5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="108" cy="48" r="8" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="126" cy="158" r="6" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="188" cy="104" r="11" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="206" cy="226" r="4.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="252" cy="42" r="5.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="268" cy="164" r="7" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="296" cy="290" r="5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="318" cy="96" r="6.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="342" cy="220" r="9" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="368" cy="34" r="4" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="392" cy="150" r="10" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="406" cy="300" r="6" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="436" cy="72" r="7.5" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="456" cy="238" r="5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="478" cy="132" r="6" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="498" cy="348" r="4.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="512" cy="46" r="5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="524" cy="200" r="8.5" fill="#ffffff" fillOpacity="0.5" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="548" cy="290" r="5.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="566" cy="110" r="6.5" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                    <circle cx="588" cy="236" r="4" fill="#ffffff" fillOpacity="0.28" strokeOpacity="0.55" strokeWidth="1" />
                  </g>
                </g>
              </svg>
            </div>

            <div className="relative max-w-xl md:w-[52%]">
              <h2 className="font-serif-display text-[36px] sm:text-[46px] leading-[1.06] tracking-[-0.02em] text-[#f6f3ec]">
                {pickText({
                  en: 'Pick one track. Build real momentum today.',
                  km: 'ជ្រើសរើសជំនាញមួយ ហើយចាប់ផ្តើមអភិវឌ្ឍជំនាញថ្ងៃនេះ។',
                })}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-[rgb(255_255_255/0.86)]">
                {pickText({
                  en: 'Six disciplines, bilingual guidance, one workspace to watch your skills grow.',
                  km: 'ជំនាញទាំង ៦ ការណែនាំពីរភាសា និងកន្លែងសិក្សាតែមួយដើម្បីតាមដានវឌ្ឍនភាព។',
                })}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to="/courses"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-body text-[15px] font-semibold transition-colors duration-[0.22s] px-6 bg-[#f6f3ec] text-[#15463a] hover:bg-white w-full sm:w-auto"
                >
                  <span>{pickText({ en: 'Explore courses', km: 'ស្វែងរកវគ្គសិក្សា' })}</span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-[0.22s] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/pricing"
                  className="group inline-flex min-h-11 items-center gap-2 font-body text-[15px] font-semibold underline-offset-[6px] transition-colors duration-[0.22s] hover:underline text-[#f6f3ec] sm:ml-2"
                >
                  <span>{pickText({ en: 'See pricing & plans', km: 'មើលតម្លៃ និងគម្រោង' })}</span>
                  <ArrowUpRight
                    className="h-4.5 w-4.5 shrink-0 transition-transform duration-[0.22s] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
