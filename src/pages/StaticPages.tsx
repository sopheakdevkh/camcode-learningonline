import React, { useState } from 'react';
import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/I18nContext';

export const AboutPage: React.FC = () => {
  const { t, pickText } = useI18n();

  return (
    <div className="container-page py-10 md:py-16 max-w-4xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-h1 text-[#0F172A]">{t.staticPages.aboutTitle}</h1>
        <p className="text-body text-[#64748B]">
          {pickText({
            en: 'CamcodeLearn is a modern bilingual learning and video streaming platform built to serve students, working professionals, corporate teams, instructors, and creators across English and Khmer.',
            km: 'CamcodeLearn គឺជាថ្នាលសិក្សា និងវីដេអូអនឡាញពីរភាសា (អង់គ្លេស និងខ្មែរ) ដែលបង្កើតឡើងសម្រាប់សិស្ស អ្នកជំនាញ ក្រុមហ៊ុន គ្រូបង្រៀន និងអ្នកបង្កើតមាតិកា។',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-[24px] p-6 space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: 'Our Mission', km: 'បេសកកម្មរបស់យើង' })}
          </h2>
          <p className="text-[15px] text-[#475569] leading-relaxed">
            {pickText({
              en: 'Make structured courses and high-signal educational videos accessible with clear pricing, transparent access rules, and seamless localization.',
              km: 'ធ្វើឱ្យវគ្គសិក្សាមានរចនាសម្ព័ន្ធ និងវីដេអូអប់រំមានគុណភាពអាចចូលរៀនបានងាយស្រួល ជាមួយតម្លៃតម្លាភាព និងភាសាច្បាស់លាស់។',
            })}
          </p>
        </div>

        <div className="glass-card rounded-[24px] p-6 space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: 'Three-App Ecosystem', km: 'ប្រព័ន្ធកម្មវិធីទាំង ៣' })}
          </h2>
          <p className="text-[15px] text-[#475569] leading-relaxed">
            {pickText({
              en: 'Our public discovery website (Port 3000) connects seamlessly with our dedicated Learner Workspace (Port 3001) and Operations Console (Port 3002) over a unified API (Port 4000).',
              km: 'គេហទំព័រសាធារណៈ (Port 3000) តភ្ជាប់ជាមួយកម្មវិធីសិក្សា (Port 3001) និងផ្ទាំងគ្រប់គ្រង (Port 3002) តាមរយៈ API រួមមួយ (Port 4000)។',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="container-page py-10 md:py-16 max-w-4xl space-y-8">
      <div>
        <h1 className="text-h1 text-[#0F172A]">{t.staticPages.contactTitle}</h1>
        <p className="text-body text-[#64748B] mt-1">
          {pickText({
            en: 'Have questions about courses, team training, or creator partnerships? Reach out anytime.',
            km: 'មានសំណួរអំពីវគ្គសិក្សា ការបណ្តុះបណ្តាលក្រុមហ៊ុន ឬភាពជាដៃគូ? សូមទាក់ទងមកយើងគ្រប់ពេល។',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-4">
          <div className="glass-card rounded-[24px] p-5 space-y-4 text-[14px]">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0F172A]">Email</p>
                <p className="text-[#64748B]">support@camcodelearn.example</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0F172A]">Phone</p>
                <p className="text-[#64748B]">+855 23 900 123</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#0F172A]">Office</p>
                <p className="text-[#64748B]">Phnom Penh, Cambodia</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:col-span-7 glass-card rounded-[24px] p-6 space-y-4"
        >
          {submitted && (
            <Alert tone="success">
              {pickText({
                en: 'Thank you! Your inquiry has been received and our team will reply within 1 business day.',
                km: 'សូមអរគុណ! សាររបស់អ្នកត្រូវបានទទួល ហើយក្រុមការងារនឹងឆ្លើយតបក្នុងរយៈពេល ១ ថ្ងៃធ្វើការ។',
              })}
            </Alert>
          )}
          <Input
            label={t.auth.fullName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label={t.auth.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div>
            <label className="block text-[14px] font-medium text-[#0F172A] mb-1.5">
              {pickText({ en: 'Message', km: 'សាររបស់អ្នក' })}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full p-3.5 rounded-[8px] border border-[#E2E8F0] bg-white text-[15px] text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>
          <Button type="submit" size="lg">
            {pickText({ en: 'Send Message', km: 'ផ្ញើសារ' })}
          </Button>
        </form>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { t, pickText } = useI18n();
  return (
    <div className="container-page py-10 md:py-16 max-w-3xl space-y-6">
      <h1 className="text-h1 text-[#0F172A]">{t.staticPages.termsTitle}</h1>
      <div className="glass-card rounded-[24px] p-6 md:p-8 space-y-5 text-[15px] text-[#475569] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: '1. Course Purchases & Subscriptions', km: '១. ការទិញវគ្គសិក្សា និងការជាវប្រចាំខែ' })}
          </h2>
          <p>
            {pickText({
              en: 'Individual courses grant ongoing access to the purchased course curriculum. Subscriptions grant access to eligible video libraries and included courses while your membership remains active.',
              km: 'ការទិញវគ្គសិក្សាដាច់ដោយឡែកផ្តល់សិទ្ធិចូលរៀនមេរៀននៃវគ្គនោះ។ ការជាវគម្រោងផ្តល់សិទ្ធិទស្សនាបណ្ណាល័យវីដេអូ និងវគ្គសិក្សាដែលបានកំណត់ក្នុងអំឡុងពេលសមាជិកភាពសកម្ម។',
            })}
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: '2. Payment Verification & Renewal', km: '២. ការផ្ទៀងផ្ទាត់ការបង់ប្រាក់ និងការបន្ត' })}
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
  );
};

export const PrivacyPage: React.FC = () => {
  const { t, pickText } = useI18n();
  return (
    <div className="container-page py-10 md:py-16 max-w-3xl space-y-6">
      <h1 className="text-h1 text-[#0F172A]">{t.staticPages.privacyTitle}</h1>
      <div className="glass-card rounded-[24px] p-6 md:p-8 space-y-5 text-[15px] text-[#475569] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: '1. Data We Collect', km: '១. ទិន្នន័យដែលយើងប្រមូល' })}
          </h2>
          <p>
            {pickText({
              en: 'We collect account details (name, email, preferred language), enrollment records, and watch progress solely to deliver your learning and streaming experience.',
              km: 'យើងប្រមូលព័ត៌មានគណនី (ឈ្មោះ អ៊ីមែល ភាសាដែលពេញចិត្ត) កំណត់ត្រាចុះឈ្មោះ និងវឌ្ឍនភាពសិក្សា ដើម្បីផ្តល់សេវាកម្មសិក្សា និងវីដេអូជូនអ្នក។',
            })}
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-h3 text-[#0F172A]">
            {pickText({ en: '2. Security & Payment Privacy', km: '២. សុវត្ថិភាព និងឯកជនភាពនៃការបង់ប្រាក់' })}
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
    <div className="container-page py-12 md:py-16 max-w-3xl space-y-10">
      <h1 className="text-h1 text-[#0F172A] text-center">{t.staticPages.faqTitle}</h1>
      <div className="space-y-5">
        {faqs.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article key={idx} className="glass-card rounded-[24px] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
              >
                <span className="text-[17px] font-medium text-[#0F172A]">{pickText(item.q)}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#64748B] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-[14px] text-[#64748B] leading-relaxed">
                  {pickText(item.a)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

