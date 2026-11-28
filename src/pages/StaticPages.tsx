import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { useI18n } from '@/i18n/I18nContext';

export { ContactPage } from './ContactPage';

export const AboutPage: React.FC = () => {
  const { t, pickText } = useI18n();

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="ABOUT US · COMPANY"
        title={t.staticPages.aboutTitle}
        description={pickText({
          en: 'Camcode is a modern bilingual learning and video streaming platform built to serve students, working professionals, corporate teams, instructors, and creators across English and Khmer.',
          km: 'Camcode គឺជាថ្នាលសិក្សា និងវីដេអូអនឡាញពីរភាសា (អង់គ្លេស និងខ្មែរ) ដែលបង្កើតឡើងសម្រាប់សិស្ស អ្នកជំនាញ ក្រុមហ៊ុន គ្រូបង្រៀន និងអ្នកបង្កើតមាតិកា។',
        })}
      />

      <div className="surface-dots py-12 md:py-16">
      <div className="container-page max-w-5xl space-y-10">

      {/* Havenline-style Numbers Band */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="swiss-surface p-6 space-y-2">
          <span className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] text-[#6e6a62]">
            LEARNERS
          </span>
          <AnimatedNumber
            value={48000}
            suffix="+"
            className="t-number-md block text-[#141312] dark:text-[#f6f3ec]"
          />
        </div>
        <div className="swiss-surface p-6 space-y-2">
          <span className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] text-[#6e6a62]">
            COURSES & VIDEOS
          </span>
          <AnimatedNumber
            value={570}
            suffix="+"
            className="t-number-md block !text-[#1c5b48] dark:!text-[#7CD4B5]"
          />
        </div>
        <div className="swiss-surface p-6 space-y-2">
          <span className="font-mono-tech text-[10.5px] uppercase tracking-[0.08em] text-[#6e6a62]">
            BILINGUAL TRACKS
          </span>
          <p className="t-number-md text-[#141312] dark:text-[#f6f3ec]">
            06
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="swiss-surface p-6 sm:p-8 space-y-3">
          <span className="font-mono-tech text-[11px] text-[#1c5b48] dark:text-[#7CD4B5]">01 / MISSION</span>
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {pickText({ en: 'Our Mission', km: 'បេសកកម្មរបស់យើង' })}
          </h2>
          <p className="text-[15px] text-[#6e6a62] leading-relaxed">
            {pickText({
              en: 'Make structured courses and high-signal educational videos accessible with clear pricing, transparent access rules, and seamless localization.',
              km: 'ធ្វើឱ្យវគ្គសិក្សាមានរចនាសម្ព័ន្ធ និងវីដេអូអប់រំមានគុណភាពអាចចូលរៀនបានងាយស្រួល ជាមួយតម្លៃតម្លាភាព និងភាសាច្បាស់លាស់។',
            })}
          </p>
        </div>

        <div className="rounded-xl bg-[#1c5b48] text-white p-6 sm:p-8 space-y-3">
          <span className="font-mono-tech text-[11px] text-[#A7E8CE]">02 / ECOSYSTEM</span>
          <h2 className="text-h3 text-white">
            {pickText({ en: 'Three-App Ecosystem', km: 'ប្រព័ន្ធកម្មវិធីទាំង ៣' })}
          </h2>
          <p className="text-[15px] text-white/85 leading-relaxed">
            {pickText({
              en: 'Our public discovery website (Port 3000) connects seamlessly with our dedicated Learner Workspace (Port 3001) and Operations Console (Port 3002) over a unified API (Port 4000).',
              km: 'គេហទំព័រសាធារណៈ (Port 3000) តភ្ជាប់ជាមួយកម្មវិធីសិក្សា (Port 3001) និងផ្ទាំងគ្រប់គ្រង (Port 3002) តាមរយៈ API រួមមួយ (Port 4000)។',
            })}
          </p>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="LEGAL · TERMS"
        title={t.staticPages.termsTitle}
        description={pickText({
          en: 'Clear terms governing course purchases, active memberships, billing verification, and learner access.',
          km: 'លក្ខខណ្ឌច្បាស់លាស់សម្រាប់ការទិញវគ្គសិក្សា សមាជិកភាពសកម្ម និងការផ្ទៀងផ្ទាត់ការបង់ប្រាក់។',
        })}
      />
      <div className="surface-dots py-12 md:py-16">
      <div className="container-page max-w-3xl space-y-6">
      <div className="swiss-surface p-6 md:p-8 space-y-6 text-[15px] text-[#6e6a62] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {pickText({
              en: '1. Course Purchases & Subscriptions',
              km: '១. ការទិញវគ្គសិក្សា និងការជាវប្រចាំខែ',
            })}
          </h2>
          <p>
            {pickText({
              en: 'Individual courses grant ongoing access to the purchased course curriculum. Subscriptions grant access to eligible video libraries and included courses while your membership remains active.',
              km: 'ការទិញវគ្គសិក្សាដាច់ដោយឡែកផ្តល់សិទ្ធិចូលរៀនមេរៀននៃវគ្គនោះ។ ការជាវគម្រោងផ្តល់សិទ្ធិទស្សនាបណ្ណាល័យវីដេអូ និងវគ្គសិក្សាដែលបានកំណត់ក្នុងអំឡុងពេលសមាជិកភាពសកម្ម។',
            })}
          </p>
        </section>
        <section className="space-y-2 pt-4 border-t border-[#ded8ca] dark:border-[#2A332E]">
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {pickText({
              en: '2. Payment Verification & Renewal',
              km: '២. ការផ្ទៀងផ្ទាត់ការបង់ប្រាក់ និងការបន្ត',
            })}
          </h2>
          <p>
            {pickText({
              en: 'Access activates only upon backend confirmation of a verified payment event or webhook. Recurring subscriptions renew automatically unless cancelled prior to the billing date.',
              km: 'សិទ្ធិប្រើប្រាស់បើកដំណើរការក្រោយពេល Backend បញ្ជាក់ការបង់ប្រាក់តាម Webhook ប៉ុណ្ណោះ។ គម្រោងប្រចាំខែ/ឆ្នាំបន្តដោយស្វ័យប្រវត្តិលុះត្រាតែមានការបោះបង់មុនថ្ងៃកំណត់។',
            })}
          </p>
        </section>
      </div>
      </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  const { t, pickText } = useI18n();
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="LEGAL · PRIVACY"
        title={t.staticPages.privacyTitle}
        description={pickText({
          en: 'How we protect account credentials, course activity records, and payment processing privacy.',
          km: 'របៀបដែលយើងការពារទិន្នន័យគណនី ប្រវត្តិការសិក្សា និងសុវត្ថិភាពនៃការទូទាត់ប្រាក់។',
        })}
      />
      <div className="surface-dots py-12 md:py-16">
      <div className="container-page max-w-3xl space-y-6">
      <div className="swiss-surface p-6 md:p-8 space-y-6 text-[15px] text-[#6e6a62] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {pickText({ en: '1. Data We Collect', km: '១. ទិន្នន័យដែលយើងប្រមូល' })}
          </h2>
          <p>
            {pickText({
              en: 'We collect account details (name, email, preferred language), enrollment records, and watch progress solely to deliver your learning and streaming experience.',
              km: 'យើងប្រមូលព័ត៌មានគណនី (ឈ្មោះ អ៊ីមែល ភាសាដែលពេញចិត្ត) កំណត់ត្រាចុះឈ្មោះ និងវឌ្ឍនភាពសិក្សា ដើម្បីផ្តល់សេវាកម្មសិក្សា និងវីដេអូជូនអ្នក។',
            })}
          </p>
        </section>
        <section className="space-y-2 pt-4 border-t border-[#ded8ca] dark:border-[#2A332E]">
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {pickText({
              en: '2. Security & Payment Privacy',
              km: '២. សុវត្ថិភាព និងឯកជនភាពនៃការបង់ប្រាក់',
            })}
          </h2>
          <p>
            {pickText({
              en: 'Payment credentials are handled exclusively by certified payment processors. We never store raw card numbers on application servers.',
              km: 'ព័ត៌មានកាតបង់ប្រាក់ត្រូវបានគ្រប់គ្រងដោយក្រុមហ៊ុនទូទាត់ដែលមានស្តង់ដារសុវត្ថិភាព។ យើងមិនរក្សាទុកលេខកាតពេញលេញលើម៉ាស៊ីនមេទេ។',
            })}
          </p>
        </section>
      </div>
      </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        en: 'What is the difference between buying a course and subscribing?',
        km: 'តើការទិញវគ្គសិក្សា និងការជាវគម្រោងខុសគ្នាដូចម្តេច?',
      },
      a: {
        en: 'Buying an individual course gives you permanent access to that structured curriculum and certificate. A subscription unlocks the curated video library and eligible plan courses.',
        km: 'ការទិញវគ្គសិក្សាផ្តល់សិទ្ធិរៀនមេរៀនវគ្គនោះជាអចិន្ត្រៃយ៍ និងទទួលវិញ្ញាបនបត្រ។ ការជាវគម្រោងផ្តល់សិទ្ធិទស្សនាបណ្ណាល័យវីដេអូ និងវគ្គសិក្សាដែលរួមបញ្ចូលក្នុងគម្រោង។',
      },
    },
    {
      q: {
        en: 'Can I switch between English and Khmer anytime?',
        km: 'តើខ្ញុំអាចប្តូររវាងភាសាអង់គ្លេស និងភាសាខ្មែរបានគ្រប់ពេលឬទេ?',
      },
      a: {
        en: 'Yes. Use the EN / ខ្មែរ language switcher in the top navigation bar on any page.',
        km: 'បាន។ អ្នកអាចប្រើប៊ូតុងប្តូរភាសា EN / ខ្មែរ នៅផ្នែកខាងលើនៃទំព័រណាមួយក៏បាន។',
      },
    },
    {
      q: {
        en: 'How does payment verification work?',
        km: 'តើការផ្ទៀងផ្ទាត់ការបង់ប្រាក់ដំណើរការដូចម្តេច?',
      },
      a: {
        en: 'After you submit payment at checkout, our backend verifies the transaction event/webhook before activating your course or membership.',
        km: 'ក្រោយពេលអ្នកបញ្ជូនការបង់ប្រាក់លើទំព័រ Checkout ប្រព័ន្ធ Backend នឹងផ្ទៀងផ្ទាត់ប្រតិបត្តិការតាម Webhook មុននឹងបើកសិទ្ធិជូនអ្នក។',
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="KNOWLEDGE BASE · FAQ"
        title={t.staticPages.faqTitle}
        description={pickText({
          en: 'Answers on individual courses, active subscriptions, bilingual mode, and verified payments.',
          km: 'ចម្លើយច្បាស់លាស់អំពីវគ្គសិក្សា ការជាវគម្រោង ភាសាពីរ និងការផ្ទៀងផ្ទាត់ការបង់ប្រាក់។',
        })}
      />
      <div className="surface-dots py-12 md:py-16">
      <div className="container-page max-w-3xl space-y-8">

      <div className="space-y-3">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="rounded-xl border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#e5dfd2]/40 dark:hover:bg-[#181E1B] transition-colors"
              >
                <span className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                  <span className="font-mono-tech text-[11px] text-[#1c5b48] dark:text-[#7CD4B5] mr-3">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {pickText(item.q)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#6e6a62] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pl-12 text-[14px] text-[#6e6a62] leading-relaxed">
                  {pickText(item.a)}
                </div>
              )}
            </article>
          );
        })}
      </div>
      </div>
      </div>
    </div>
  );
};
