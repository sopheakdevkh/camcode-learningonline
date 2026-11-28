import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  Phone,
  Plus,
} from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Alert } from '@/components/ui/Alert';
import { useI18n } from '@/i18n/I18nContext';

/** Architectural vector map preview with rounded clip, dashed grid, and accent teardrop pin. */
const DeskMapGraphic: React.FC<{
  variant: 'phnom-penh' | 'siem-reap' | 'regional';
  label: string;
}> = ({ variant, label }) => {
  const clipId = useId();

  const landPath =
    variant === 'phnom-penh'
      ? 'M246 151.9l-7.4-9.5l-9.6-7.8l-11.3-7.5l-10.1-3.7l-9.7-6.8l-22.6-23l-12.5-6.8l-4.3-1.1l-2.4 1.4l-2.7-1.5h-1.6l2.9 2.8l1.2 2.6l0.3 2.2l-1.5 0.2l-2-1.8l0-1.8l-1.4 1l-2.4-6.9l-3.8 0.8l-2 1l-0.9-0.5l-3 2.9l-1.5-0.7l0.6 1.5l-0.9 2.8l1.3 5.7l-2.1-0.2l0.1 1.1l1.2 0.9h-1.4l-1.7 1.1l-1.9-1.6l-10.9-4l-1.5-2.3l-4.6-1l-3.3 1.1l-0.7-1.1l-1.4-0.4l-0.7-3.1l-2.5-4.7l1.2-2.5l2.5-1.7l0.1-1.7l2.6-1.8l0.8-2.9l0.1-4.5l-1.2-2l-9.5-25.6l-7.7-12l-6.3-5.7l-6.1-4l-2.6 0.2l-2.7-0.8l-2.5 1.1l-1.6-0.6l-2.5 0.1l-1.2 0.8l-11.6-0.8l-1.8 0.2l-0.9 1.9l-2.6-0.4l-2.8 0.6l-4.8-0.8l-3.6 0.2l-1.6 1.5l-5.5 0.9l-0.9 0.5l-1.1 3.1l-1.9 0.6l-0.8 1.3l-4.6-5.2l-4.6-3.2l-4.7-0.9l-7.8-0.8l-1.3-0.8l-1.8-0.4l-1.4 0.6l-3.5-1.1l-4.7-2.9l-2.4-0.9l0-18.8h252zM146.2 85.8l1.7-0.6l0.5 2.3l-4 1.3l1.5 5.5l-2.8 1.1l0.9 2.1l-2.4-0.4l-0.7-2.1l0.4-1l3-1.2l-1-3.7l-0.9 0.8l0.5 2.4l-3.5 1.8l-0.5-2.6l0.7-1.8l2.5-2.7l1 0.1l0.9-0.5zM84.5 166l-3.7-0.2l-2.8-1.3l-0.2-2.1l-2.1-1.5l-3.6-4.5l-0.3-1.2l5.2 0.1l2.9 0.7l5.6-1l3.6 4.3l3.7 1.9l0.2 2.2l1.1 0.3l1.8-1.4l1.5-0.1l0.9 1.4l0.9-0.1l3.6 2.5h-18.3z'
      : variant === 'siem-reap'
        ? 'M9.1 166l4.7-3l40.2-4.3l3.4 0.4l2.2 1.3l2.4 2.3l2.3 3.3h-55.2zM79.9 166l-2-1.9l7.9-3.8l4-1.1l13.4 0.6l3.9 1.2l3.6 3.1l-0.7-4.6l-1.9-1.8l-6.5-0.3l-1.6-0.6l-2.7-2.5l-0.7-2.1l-0.5-5.5l0.4-2l2-2.2l2.5-1.1l5.1-0.4l-5.3-4.3l-10.4-3.2l-2.2-3.2l-0.9-8l-2.6-5l-3.6-3.4l-4.2-2.9l-2.9 2.1l-3.8 1.2h-3.8l-2.9 0.8l-0.6 1l-2.5 0.2l-1.4-6.7l4.4-3l9.4-2.9l1.3-1.7l2.9-0.3l5 1.2l4.8 2.4l2.6-0.8l1.9-1.6l-5-7.5l-1.8-1.8l-0.4-1.5l0.3-1.9l1.8-3.1l-0.5-3.7l-4.6-13.6l0.9-1.9l1-1.6l7 1.6l5.8-1l5.1-3.3l21.4-26.2l18.3-26.9l9-16.5h96.4v172zM85.1 141l6.3 1.8l2.8 2l0.3 3.9l-1.5 2.4l-2.5 1.7l-2.6 1.1l-11.5 2.2l-2.7-0.1l-5.6-2.1l-3.2-2.3l-2.4-6.3l-2.3-1.9l-5.9-2.4l-3.2-3.3l-2-0.1l-4.6 5.2l-6.7 0.4l-3-0.9l-2-2.9l0.4-7.8l5.4-3.6l13.2-2l2.5 0.2l2 1.1l14.3 0.4l3.3 0.7l2.5 1.9l7.2 9.5z'
        : 'M244.5-6l1.5 1.7v69.2h-1.5l-1.2 0.8l-2.6 3.5l-1.1 0.8l-11-0.5l-4.8-1l-9.8-3.9l-1.9-1.6l0-7.1l-1.3-3.5l-6.3-4.8l-2.4-2.5l-1.3-8.9l6.5-4.2l9-3.6l5.9-6.7l-4.5-1.1l-4.4 1.1l-14 9.5l-2.3-6.1l-7.7-15.9l-5.7-8.6l-5.5-3.8l-1.4 2.9l2.5 6.6l9.2 14.6l0.1 3.3l-1.3 6.8l2.2 10.4l-0.6 3.7l-8.6 7l-11.6-2.8l-21.1-10.9l-6.2 0.5l-9.7 5l-5.1 1.2l-9.8-0.8l-3.7 0.4l-3.9 2.1l-12.4 15.6l-7.3 5.8l-8.6-1.5l-2.2-3.6l-1.9-1.8l-0.9 1.2l1.7 8.3l-0.6 2.7l-4.4 6.4l-3.4 8.5l-3-4.8l-8.5-7.2l-3.4-4.8l-2.1-4.8l-7.9-26.3l-4.5-9.4l-6.8-7.7l-10.2-6.6l-28.7-10.8l0-12zM159.4 166l-7.8-4.4l-2.5-2.2l-1.6-3l-0.2-3.1l1.4-2.4l2.9-0.4l4.2 2.6l0-2l1.5-4.8l3.1 4.2l3.9 2l8.1 2.4l2.3 2l2.3 3.2l1.4 3.6l-0.1 2.3h-18.9zM51.3 150.9l0.4 3l-0.6 1.2l-1.3 1l-3.2 0.3l-3.9-1.2l-6.6-3.6l-5.5 1.3l-4.1-3.6l-6.3-10.3l0.2-2.8l1.9-4.7l2.5-4.5l2-2.1l5.9-2.7l2.5-0.5l3.2 0.7l0.4 1.9l-1 5.5l2.5 8.6l1.5 2.3l1.4 0.9l3.2 0.3l1.3 0.6l0.8 1.1l0.1 3.5l2.1 2.7zM221.9 115.1l1.4 4.9l-0.1 5l-5 17.2l-1.9-0.3l-4.2-3.7l-0.5 3.3l2.1 3.3l-2 1.1l-2.9 5.7v4.8h-5l-5.5 1.4l-4.2-1.3l-8.7-4.9l-7.1 0.4l-2.6-0.4l-9.2-10.1l-2.7-4.9l-1-4.6l2.7-2.2l2.4 0.9l3.5 4l2.6 0.2l1.8-1.5l-2.4-9.7l-0.8-1.5l0.3-1l2.8-1.4l2.7-0.2l5 1.8l2 0.3l3.7-2.8l1.9-8.3l2.9-2.2l2.5 1.6l7.2 8.6l3.5 3.1l1.5-3l0-3.1l-1.2-3.1l-1.9-2.6l2.9-1.5l3-0.4l3.1 0.6l2.9 1.4l3.6 3.6zM211.8 166l1.9-0.5l0.8 0.5h-2.7zM246 149.8l-1.1-4.4l0.3-5l-2.4-4.8l-0.2-4.3l3.4-2.1v20.6zM176.9 59.1l9.4 2.6l0.9 1.5l-2.8 4.7l-4.1 4.9l-5 4l-5.4 1.6l-6 0.7l-4.8 1.8l-11.8 8.5l-3.1 0.5l-5.9-0.2l-3-0.7l-3.3-4.8l-5-2.3l-6.1-1.4l-5.2-0.6l-10.5 0.3l-4.3-1l-1.7-3.4l1-3.8l7.3-10.3l1-4.6l1.2-2.6l2.7-2.7l3.2-2l2.4-0.4l5.3 0.7l5.4-0.7l6.8-3.2l3.6-1.1l6.4 0.4l6.2 2.1l18.3 9.1zM222 166l-0.1-0.8l0.8-0.7l-0.8-1.5l0.3-0.9l-0.6-1.3l4.4 0.9l2.2-0.5l-0.1 2.5l4.9 2.3h-11zM198.4 166l0.4-3.7l1.2-1.9l5.5 4.9l0.1 0.7h-7.2zM246 160.6l-1.4-1.1l-1.6-0.1l0.8-2.9l2.2-0.8v4.9zM226.9 155.6l-1.1 0.3l-1.4-1.1l0-3.7l1.4-1.2l2.7-0.3l1.8-2.6l1.2 0.9l0.8 2.1l-2.1 2.8v1.3l-2.6 2.1zM138.9 158.5l0.9 3.4l-0.8 1.3l-1.9-1.9l-2.2-1l-1.7-2l-0.8-2.2l-0.4-4.3l-0.8-1.5l-2.6 1.6l-0.9-1l0.7-2.6l-0.4-2l3.5-3.3l0.2-1.5h1.1l2.4 1.1l1-0.5l0.9 0.7l1 3.5l-0.3 4.2zM226.7 146.9l-1.1-3.5l0.9-4.2l3-1.4l2-0.3l-0.7 1.4l2.1 3.2l-0.3 2.1l-4.4 4.2zM140.6 130h0.9l0.9 1.3l-1.5 2l-2.4-0.8l-1.6-2l1.3-3.2l1.8 1.8zM16.8 118l1.9 1.3v1.6l-1.2 3.9l-2.5-0.4l0.7-1.6l-0.2-1.5l0.5-2.1zM159.1 116.8l0.5-1.1l0.6 3.4l-0.9 0.3l-2.4-0.7l1-1.8zM154.3 116.5l-0.2-1.6l1.2 0.5zM40.7 115.7l1.6 1.9l0.5 3.2l-3.9 0.2l-3.5-4.9l3.4-2.7zM44.7 72.5l2.4-1.7l2.6 4.1l-0.8 2.2l-2.1 1.8l-1.5-1.1z';

  const riverPath =
    variant === 'siem-reap'
      ? 'M246 64.2l-1-0.2l-2.7 1.8l-3.4 0.9l-3.5 3.8l-1.5 0.7l-6.2-1.4l-5.2 3.1l-4.2 4.4l-1.5 0.6l-9.8-0.6l-3 0.6l-8.2 5.9l-5.4 1.5l-8.8 4.4h-12.9l-3.5-0.8l-6.5-3.4l-2.9-0.8l-7.1 3.2l-18 2.4l-4.8-0.7l-4.8-3.4l-5.8-1.5l-16.5-15.4l-4.4-1.7M246 106.7l-2.9-0.5l-16 1.5M227.1 107.7l-7.6-1.5h-3.8l-5.8 5.3l-3.7 1.2l-8.3 0.1l-4.3 3.3l-3.2 3.6l-2.1 4.2l-7.5 9M140 135.6l-11.9-4.9l-24.5-17.4l-12.3-10.4M246 129.6l-3.3 0.4l-2.7 2.3l-1.6 0.5l-23.5 0.1l-3.7-1.8l-1.9 1.4l-5.9 1.8M106.2 141l2.1 1.5l3.9 3.7l5 2.6l4.4 1.3l8-2.1l5.8-4l4.6-8.4l15.5 3.2l5.7-0.2l5.2-1.6l6.2-2.9l3.4-1.1l4.8-0.1l9.6-1.4h3.3l7.4 3l2.9 0.2'
      : '';

  return (
    <svg viewBox="0 0 240 160" role="img" aria-label={label} className="w-full rounded-[10px]">
      <defs>
        <clipPath id={clipId}>
          <rect width="240" height="160" rx="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="240" height="160" fill="var(--color-canvas)" />
        <path
          d={landPath}
          fill="var(--color-surface-strong)"
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {riverPath && (
          <path
            d={riverPath}
            fill="none"
            stroke="var(--color-canvas)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <line
          x1="0"
          y1="88"
          x2="240"
          y2="88"
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        <line
          x1="150"
          y1="0"
          x2="150"
          y2="160"
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
      </g>
      <g transform="translate(150 54)">
        <path
          d="M0 34c0 0 13-14.5 13-22.6A13 13 0 1 0-13 11.4C-13 19.5 0 34 0 34z"
          fill="var(--color-accent)"
        />
        <circle cx="0" cy="11" r="4.6" fill="var(--color-canvas)" />
      </g>
    </svg>
  );
};

export const ContactPage: React.FC = () => {
  const { pickText, t } = useI18n();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('course-enrollment');
  const [schedule, setSchedule] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [courseInterest, setCourseInterest] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string>('01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setFullName('');
    setOrganization('');
    setEmail('');
    setPhone('');
    setSchedule('');
    setExperienceLevel('');
    setCourseInterest('');
    setMessage('');
  };

  const desks = [
    {
      label: pickText({ en: 'Admissions', km: 'ការចុះឈ្មោះសិក្សា' }),
      phone: '+855 23 880 240',
      email: 'admissions@camcode.com',
      note: pickText({
        en: 'Mon–Sat · Course paths & cohort dates',
        km: 'ច័ន្ទ–សៅរ៍ · ប្រឹក្សាវគ្គសិក្សា និងកាលវិភាគ',
      }),
    },
    {
      label: pickText({ en: 'Learner Support', km: 'ជំនួយអ្នកសិក្សា' }),
      phone: '+855 23 880 241',
      email: 'support@camcode.com',
      note: pickText({
        en: 'Live Telegram & workspace help desk',
        km: 'ជំនួយបច្ចេកទេសតាម Telegram និងគណនី',
      }),
    },
    {
      label: pickText({ en: 'Partnerships', km: 'ភាពជាដៃគូ' }),
      phone: '+855 23 880 247',
      email: 'partners@camcode.com',
      note: pickText({
        en: 'Corporate upskilling & university workshops',
        km: 'ការបណ្តុះបណ្តាលក្រុមហ៊ុន និងសិក្ខាសាលា',
      }),
    },
  ];

  const offices: Array<{
    variant: 'phnom-penh' | 'siem-reap' | 'regional';
    name: string;
    address: string;
    phone: string;
    hours: string;
  }> = [
    {
      variant: 'phnom-penh',
      name: pickText({ en: 'Phnom Penh HQ', km: 'ស្នាក់ការភ្នំពេញ' }),
      address: pickText({
        en: 'No. 42, Russian Blvd, Toul Kork, Phnom Penh',
        km: 'អគារលេខ ៤២ មហាវិថីសហព័ន្ធរុស្ស៊ី ទួលគោក ភ្នំពេញ',
      }),
      phone: '+855 23 880 240',
      hours: 'Mon–Sat · 08:00–18:00 ICT',
    },
    {
      variant: 'siem-reap',
      name: pickText({ en: 'Siem Reap Hub', km: 'មជ្ឈមណ្ឌលសៀមរាប' }),
      address: pickText({
        en: 'Wat Bo Road, Sala Kamreuk, Siem Reap',
        km: 'ផ្លូវវត្តបូព៌ សាលាកំរើក សៀមរាប',
      }),
      phone: '+855 63 900 182',
      hours: 'Mon–Sat · 08:30–17:30 ICT',
    },
    {
      variant: 'regional',
      name: pickText({ en: 'Live Remote Studio', km: 'ស្ទូឌីយោសិក្សាអនឡាញ' }),
      address: pickText({
        en: 'Online Cohort Studio · Cambodia & APAC',
        km: 'បណ្តាញសិក្សាផ្ទាល់ · កម្ពុជា និងតំបន់អាស៊ី',
      }),
      phone: '+855 23 880 245',
      hours: 'Daily · 18:00–21:00 Live Mentors',
    },
  ];

  const faqs = [
    {
      num: '01',
      q: pickText({
        en: 'How quickly will an advisor reply?',
        km: 'តើក្រុមប្រឹក្សានឹងឆ្លើយតបលឿនប៉ុណ្ណា?',
      }),
      a: pickText({
        en: 'Course and cohort inquiries receive a tailored learning recommendation within 2 hours during business days—not an automated template.',
        km: 'សំណួរអំពីវគ្គសិក្សា និងកាលវិភាគ នឹងទទួលបានការណែនាំច្បាស់លាស់ក្នុងរយៈពេល ២ ម៉ោងក្នុងថ្ងៃធ្វើការ។',
      }),
    },
    {
      num: '02',
      q: pickText({
        en: 'Can I book a live walkthrough before enrolling?',
        km: 'តើខ្ញុំអាចសុំការណែនាំផ្ទាល់មុនចុះឈ្មោះបានទេ?',
      }),
      a: pickText({
        en: 'Yes. Select "Course Enrollment" above and share your preferred time window for a 15-minute curriculum call.',
        km: 'បាន។ សូមជ្រើសរើសប្រធានបទ "Course Enrollment" ហើយបញ្ជាក់ម៉ោងទំនេររបស់អ្នក។',
      }),
    },
    {
      num: '03',
      q: pickText({
        en: 'Do you offer team or corporate billing?',
        km: 'តើមានការគាំទ្រការបណ្តុះបណ្តាលសម្រាប់ក្រុមហ៊ុនទេ?',
      }),
      a: pickText({
        en: 'We issue consolidated KHQR and bank invoices for teams of 5+ learners with progress tracking seats.',
        km: 'យើងផ្តល់វិក្កយបត្ររួមសម្រាប់ក្រុមហ៊ុនចាប់ពី ៥ នាក់ឡើងទៅ ជាមួយការតាមដានវឌ្ឍនភាព។',
      }),
    },
    {
      num: '04',
      q: pickText({
        en: 'What if I am unsure which track matches my level?',
        km: 'ចុះបើខ្ញុំមិនទាន់ប្រាកដថាត្រូវរៀនវគ្គណាមួយ?',
      }),
      a: pickText({
        en: 'Leave your current experience and goal in the form—an instructor will review it and point you to the right starting course.',
        km: 'សូមសរសេរកម្រិត និងគោលដៅរបស់អ្នកក្នុងទម្រង់ គ្រូជំនាញរបស់យើងនឹងជួយណែនាំវគ្គដែលសមស្របបំផុត។',
      }),
    },
    {
      num: '05',
      q: pickText({
        en: 'Are certificates and video lessons bilingual?',
        km: 'តើមេរៀន និងវិញ្ញាបនបត្រមានពីរភាសាមែនទេ?',
      }),
      a: pickText({
        en: 'All core tracks include English and Khmer study resources, and verified completion certificates can be previewed directly in your Learner App.',
        km: 'វគ្គសិក្សាស្នូលទាំងអស់មានឯកសារជាភាសាខ្មែរ និងអង់គ្លេស រួមជាមួយវិញ្ញាបនបត្រផ្លូវការ។',
      }),
    },
  ];

  const topicOptions = [
    { value: 'course-enrollment', label: pickText({ en: 'Course Enrollment & Study Path', km: 'ការចុះឈ្មោះវគ្គសិក្សា និងកម្មវិធីសិក្សា' }) },
    { value: 'corporate-team', label: pickText({ en: 'Team & Corporate Training', km: 'ការបណ្តុះបណ្តាលក្រុមហ៊ុន និងស្ថាប័ន' }) },
    { value: 'mentor-partner', label: pickText({ en: 'Trainer & Partnership Inquiry', km: 'ភាពជាដៃគូ និងគ្រូបង្រៀន' }) },
    { value: 'billing-support', label: pickText({ en: 'Billing, KHQR & Account Support', km: 'ការបង់ប្រាក់ KHQR និងជំនួយបច្ចេកទេស' }) },
  ];

  const fieldClassName =
    'w-full rounded-[10px] border border-[#c2baa8] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] px-4 text-[16px] sm:text-[17px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62] transition-colors duration-200 hover:border-[#AEA595] focus-visible:border-[#1c5b48] dark:focus-visible:border-[#2D7A62] outline-none';

  return (
    <div className="min-h-screen bg-[#f6f3ec] dark:bg-[#101412]">
      {/* 1. Original Project Editorial PageHero */}
      <PageHero
        eyebrow={pickText({ en: 'CONTACT DESK · SUPPORT', km: 'មជ្ឈមណ្ឌលទំនាក់ទំនង' })}
        title={t.staticPages.contactTitle}
        description={pickText({
          en: 'Have questions about courses, team training, or creator partnerships? Reach out anytime.',
          km: 'មានសំណួរអំពីវគ្គសិក្សា ការបណ្តុះបណ្តាលក្រុមហ៊ុន ឬភាពជាដៃគូ? សូមទាក់ទងមកយើងគ្រប់ពេល។',
        })}
      />

      {/* 2 & 3. Direct Desk Channels & Nine-Field Inquiry Form */}
      <section className="surface-paper py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <ul className="grid divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-y border-[#ded8ca] dark:border-[#2A332E] md:grid-cols-3 md:divide-y-0">
            {desks.map((desk, idx) => (
              <li key={desk.label} className="flex items-center gap-6 py-6 md:px-6 md:first:pl-0">
                {idx > 0 && <span aria-hidden="true" className="slash-divider hidden md:block" />}
                <div>
                  <p className="t-method text-[#141312] dark:text-[#f6f3ec]">{desk.label}</p>
                  <a
                    href={`tel:${desk.phone.replace(/\s+/g, '')}`}
                    className="mt-1.5 flex items-center gap-2 font-mono text-[14.5px] font-medium text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] hover:underline"
                  >
                    <Phone className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" aria-hidden="true" />
                    <span>{desk.phone}</span>
                  </a>
                  <a
                    href={`mailto:${desk.email}`}
                    className="mt-1 flex items-center gap-2 text-[14px] text-[#4c4842] dark:text-[#D5D1C8] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
                  >
                    <Mail className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" aria-hidden="true" />
                    <span>{desk.email}</span>
                  </a>
                  <p className="t-method mt-2">{desk.note}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div>
              <span className="inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#4c4842] dark:text-[#D5D1C8] font-mono text-[10.5px] uppercase tracking-[0.12em]">
                <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-[#1c5b48]" />
                {pickText({ en: 'Send an inquiry', km: 'ផ្ញើសំណួរ' })}
              </span>
              <h2 className="mt-5 font-serif-display text-[38px] sm:text-[46px] leading-[1.05] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
                {pickText({
                  en: 'Tell us your goal and skill level',
                  km: 'ប្រាប់យើងពីគោលដៅ និងកម្រិតសិក្សា',
                })}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.65] text-[#4c4842] dark:text-[#D5D1C8]">
                {pickText({
                  en: 'Nine fields. An advisor reads it, not a routing rule.',
                  km: 'បំពេញទម្រង់នេះ ដើម្បីឱ្យទីប្រឹក្សាសិក្សារបស់យើងណែនាំអ្នកដោយផ្ទាល់។',
                })}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              {submitted && (
                <div className="sm:col-span-2">
                  <Alert tone="success">
                    {pickText({
                      en: 'Thank you! Your inquiry has been received and our team will reply within 1 business day.',
                      km: 'សូមអរគុណ! សាររបស់អ្នកត្រូវបានទទួល ហើយក្រុមការងារនឹងឆ្លើយតបក្នុងរយៈពេល ១ ថ្ងៃធ្វើការ។',
                    })}
                  </Alert>
                </div>
              )}

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Name', km: 'ឈ្មោះពេញ' })}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Sokha Chan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-org"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Company', km: 'ក្រុមហ៊ុន / សាលារៀន' })}
                </label>
                <input
                  id="contact-org"
                  type="text"
                  placeholder="Phnom Penh Digital Co."
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Email', km: 'អ៊ីមែល' })}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Phone', km: 'លេខទូរស័ព្ទ' })}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+855 12 889 900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-topic"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Inquiry Topic', km: 'ប្រធានបទ' })}
                </label>
                <div className="relative">
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={`${fieldClassName} h-[52px] appearance-none pr-12 ${
                      topic ? 'text-[#141312] dark:text-[#f6f3ec]' : 'text-[#6e6a62]'
                    }`}
                  >
                    {topicOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6e6a62]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-schedule"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Preferred Schedule', km: 'កាលវិភាគសិក្សា' })}
                </label>
                <input
                  id="contact-schedule"
                  type="text"
                  placeholder={pickText({ en: 'Weeknights · 6:00 PM', km: 'ពេលល្ងាច · ៦:០០' })}
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-level"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Current Level', km: 'កម្រិតបច្ចុប្បន្ន' })}
                </label>
                <input
                  id="contact-level"
                  type="text"
                  placeholder={pickText({ en: 'Beginner / Intermediate', km: 'កម្រិតដំបូង / មធ្យម' })}
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-track"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Course or track interest', km: 'វគ្គសិក្សាដែលចាប់អារម្មណ៍' })}
                </label>
                <input
                  id="contact-track"
                  type="text"
                  placeholder={pickText({
                    en: 'Full-Stack TypeScript, Digital Marketing, UI/UX Systems',
                    km: 'Full-Stack TypeScript, Digital Marketing, UI/UX Systems',
                  })}
                  value={courseInterest}
                  onChange={(e) => setCourseInterest(e.target.value)}
                  className={`${fieldClassName} h-[52px]`}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
                >
                  {pickText({ en: 'Message', km: 'សារលម្អិត' })}
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder={pickText({
                    en: 'Tell us what skills you want to build, team size, or cohort goals.',
                    km: 'ប្រាប់យើងអំពីជំនាញដែលអ្នកចង់អភិវឌ្ឍ ចំនួនសមាជិក ឬគោលដៅសិក្សា។',
                  })}
                  className={`${fieldClassName} min-h-[140px] resize-y py-3.5`}
                />
              </div>

              <div className="sm:col-span-2 sm:justify-self-end">
                <button
                  type="submit"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-body text-[15px] font-semibold transition-[background-color,border-color,color,translate] duration-[0.22s] px-6 bg-[#1c5b48] text-white hover:bg-[#15463a] active:translate-y-px cursor-pointer w-full sm:w-auto"
                >
                  <span>{pickText({ en: 'Send inquiry', km: 'ផ្ញើសំណួរ' })}</span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 transition-transform duration-[0.22s] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Dotted Band: Three Desks + Featured Night/24h Support Card */}
      <section className="surface-dots border-y border-[#ded8ca] dark:border-[#2A332E] py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#4c4842] dark:text-[#D5D1C8] font-mono text-[10.5px] uppercase tracking-[0.12em]">
              <span className="size-[5px] rounded-[1px] bg-[#1c5b48]" aria-hidden="true" />
              {pickText({ en: 'Offices', km: 'ស្នាក់ការ និងមជ្ឈមណ្ឌល' })}
            </span>
            <h2 className="mt-5 font-serif-display text-[36px] sm:text-[46px] leading-[1.06] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
              {pickText({
                en: 'Three desks and a live shift',
                km: 'ទីតាំងទាំង ៣ និងក្រុមជំនួយផ្ទាល់',
              })}
            </h2>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
            {offices.map((office) => (
              <li key={office.name}>
                <article className="card-tile group flex h-full flex-col p-5">
                  <DeskMapGraphic
                    variant={office.variant}
                    label={`${office.name} — ${office.address}`}
                  />
                  <h3 className="mt-4 font-serif-display text-[23px] leading-tight text-[#141312] dark:text-[#f6f3ec]">
                    {office.name}
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-[14px] leading-[1.5] text-[#4c4842] dark:text-[#D5D1C8] flex-1">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1c5b48] dark:text-[#7CD4B5]"
                      aria-hidden="true"
                    />
                    <span>{office.address}</span>
                  </p>
                  <a
                    href={`tel:${office.phone.replace(/\s+/g, '')}`}
                    className="mt-3 flex items-center gap-2 font-mono text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] hover:underline"
                  >
                    <Phone className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                    <span>{office.phone}</span>
                  </a>
                  <p className="mt-2 flex items-center gap-2 font-mono text-[12px] text-[#6e6a62]">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{office.hours}</span>
                  </p>
                </article>
              </li>
            ))}

            {/* Card 4: Featured 24-Hour Support Emerald Card */}
            <li>
              <article className="card-accent surface-accent flex h-full flex-col justify-between rounded-[var(--radius-md)] p-5">
                <div>
                  <h3 className="font-serif-display text-[23px] leading-tight text-[#f6f3ec]">
                    {pickText({ en: '24-Hour Support', km: 'ជំនួយ ២៤ ម៉ោង' })}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[rgb(255_255_255/0.86)]">
                    {pickText({
                      en: 'Every hour of the week, including live Telegram & workspace assistance for enrolled learners.',
                      km: 'ការឆ្លើយតបរហ័សតាម Telegram និងអ៊ីមែលសម្រាប់សិស្សកំពុងសិក្សា និងក្រុមហ៊ុនដៃគូ។',
                    })}
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href="tel:+85523880241"
                    className="flex min-h-11 items-center gap-2 font-mono text-[13.5px] font-medium text-[#f6f3ec] underline-offset-[6px] transition-opacity duration-[0.22s] hover:underline"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>+855 23 880 241</span>
                  </a>
                  <p className="font-mono text-[12px] text-white/75">
                    {pickText({
                      en: 'Answered in under 2 hours',
                      km: 'ឆ្លើយតបក្នុងរយៈពេលក្រោម ២ ម៉ោង',
                    })}
                  </p>
                </div>
              </article>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Five Quick Answers — Clean Divider Accordion inside Dotted Panel */}
      <section className="surface-lanes py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="surface-dots rounded-[28px] border border-[#ded8ca]/80 dark:border-[#2A332E] p-6 md:p-12">
            <div className="max-w-2xl">
              <span className="inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#4c4842] dark:text-[#D5D1C8] font-mono text-[10.5px] uppercase tracking-[0.12em]">
                <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-[#1c5b48]" />
                {pickText({ en: 'Before you write', km: 'មុនពេលទាក់ទងមកយើង' })}
              </span>
              <h2 className="mt-5 font-serif-display text-[36px] sm:text-[46px] leading-[1.06] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec]">
                {pickText({ en: 'Five quick answers', km: 'សំណួរចម្លើយរហ័សទាំង ៥' })}
              </h2>
            </div>

            <div className="mt-10 grid gap-x-8 md:grid-cols-2">
              <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-t border-[#ded8ca] dark:border-[#2A332E]">
                {faqs.slice(0, 3).map((item) => {
                  const isOpen = openFaqId === item.num;
                  return (
                    <div key={item.num}>
                      <h3 className="m-0">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaqId(isOpen ? '' : item.num)}
                          className="flex w-full items-start justify-between gap-5 px-0 py-5 text-left text-[17px] font-semibold text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] md:px-1 cursor-pointer"
                        >
                          <span className="flex items-start gap-4">
                            <span aria-hidden="true" className="index-number mt-1.5">
                              {item.num}
                            </span>
                            <span>{item.q}</span>
                          </span>
                          <Plus
                            aria-hidden="true"
                            className={`mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${
                              isOpen
                                ? 'rotate-45 text-[#1c5b48] dark:text-[#7CD4B5]'
                                : 'text-[#141312] dark:text-[#f6f3ec]'
                            }`}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="pb-5 pl-8 md:pl-9 pr-6 text-[14.5px] leading-[1.65] text-[#4c4842] dark:text-[#D5D1C8]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-t border-[#ded8ca] dark:border-[#2A332E]">
                {faqs.slice(3).map((item) => {
                  const isOpen = openFaqId === item.num;
                  return (
                    <div key={item.num}>
                      <h3 className="m-0">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaqId(isOpen ? '' : item.num)}
                          className="flex w-full items-start justify-between gap-5 px-0 py-5 text-left text-[17px] font-semibold text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] md:px-1 cursor-pointer"
                        >
                          <span className="flex items-start gap-4">
                            <span aria-hidden="true" className="index-number mt-1.5">
                              {item.num}
                            </span>
                            <span>{item.q}</span>
                          </span>
                          <Plus
                            aria-hidden="true"
                            className={`mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 ${
                              isOpen
                                ? 'rotate-45 text-[#1c5b48] dark:text-[#7CD4B5]'
                                : 'text-[#141312] dark:text-[#f6f3ec]'
                            }`}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="pb-5 pl-8 md:pl-9 pr-6 text-[14.5px] leading-[1.65] text-[#4c4842] dark:text-[#D5D1C8]">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#ded8ca] dark:border-[#2A332E] pt-6 text-[15px] text-[#4c4842] dark:text-[#D5D1C8]">
              <span>
                {pickText({
                  en: 'Still deciding? Admissions answers in under 2 hours —',
                  km: 'កំពុងសម្រេចចិត្ត? ក្រុមប្រឹក្សាឆ្លើយតបក្នុងរយៈពេលក្រោម ២ ម៉ោង —',
                })}
              </span>
              <a
                href="tel:+85523880240"
                className="inline-flex min-h-11 items-center gap-2 font-mono text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] transition-colors duration-[0.22s] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] hover:underline"
              >
                <Phone className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
                <span>+855 23 880 240</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 6. Deep Forest Emerald CTA Strip */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] bg-[#1c5b48] text-white p-8 sm:p-12 relative overflow-hidden">
            {/* Geometric connected node lattice on right */}
            <svg
              viewBox="0 0 320 180"
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 w-[300px] h-[170px] opacity-25 pointer-events-none"
              aria-hidden="true"
            >
              <g stroke="#ffffff" strokeWidth="1" fill="none">
                <path d="M20 110 L90 70 L160 110 L230 70 L300 110" />
                <path d="M55 150 L125 110 L195 150 L265 110" />
                <path d="M90 70 L125 110 L195 70 L230 110" />
                <path d="M160 110 L195 150 M230 70 L265 110" />
              </g>
              <g fill="#ffffff">
                <circle cx="90" cy="70" r="3.5" />
                <circle cx="160" cy="110" r="4" />
                <circle cx="230" cy="70" r="3.5" />
                <circle cx="125" cy="110" r="3" />
                <circle cx="195" cy="150" r="3.5" />
                <circle cx="265" cy="110" r="4" />
              </g>
            </svg>

            <div className="relative z-10 max-w-lg space-y-5">
              <h2 className="font-serif-display text-[36px] sm:text-[46px] leading-[1.04] tracking-[-0.025em] text-white">
                {pickText({
                  en: 'Still deciding? Let us map your track.',
                  km: 'កំពុងពិចារណា? ឱ្យយើងជួយរៀបចំផែនការសិក្សាជូនអ្នក។',
                })}
              </h2>
              <p className="text-[14.5px] leading-[1.6] text-white/80">
                {pickText({
                  en: 'Share what you want to learn and get a tailored roadmap in one reply.',
                  km: 'ចែករំលែកគោលដៅសិក្សារបស់អ្នក និងទទួលបានការណែនាំវគ្គសិក្សាដែលសមស្រប។',
                })}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-white text-[#141312] hover:bg-[#f6f3ec] text-[13.5px] font-semibold transition-colors"
                >
                  <span>{pickText({ en: 'Browse courses', km: 'ស្វែងរកវគ្គសិក្សា' })}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full border border-white/35 text-white hover:bg-white/10 text-[13.5px] font-semibold transition-colors"
                >
                  <span>{pickText({ en: 'Explore membership plans', km: 'មើលគម្រោងសមាជិកភាព' })}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

