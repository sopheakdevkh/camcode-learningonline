import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  Film,
  Globe,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Palette,
  Phone,
  PlayCircle,
  Plus,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
import { catalogService } from '@/services/catalogService';
import { pricingService, type PricingConfiguration } from '@/services/pricingService';
import type {
  BillingCycle,
  Category,
  Course,
  SubscriptionPlan,
  Testimonial,
  VideoItem,
} from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="h-5 w-5" />,
  Code2: <Code2 className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Briefcase: <Briefcase className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Film: <Film className="h-5 w-5" />,
};

export const HomePage: React.FC = () => {
  const { t, locale, pickText, formatNumber } = useI18n();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularVideos, setPopularVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [faqs, setFaqs] = useState<PricingConfiguration['faqs']>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero interactive centerpiece state (mode selector + 3D tilt/drag physics)
  const [heroMode, setHeroMode] = useState<'course' | 'video' | 'plan'>('course');
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tx: 0, ty: 0, dragging: false });
  const dragOrigin = useRef<{ x: number; y: number } | null>(null);

  // Interactive sections state
  const [featuredCourseIdx, setFeaturedCourseIdx] = useState(0);
  const [featuredTrackOffset, setFeaturedTrackOffset] = useState(0);
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [coverageTab, setCoverageTab] = useState<'all' | 'courses' | 'videos' | 'bilingual'>('all');
  const [homeBilling, setHomeBilling] = useState<BillingCycle>('monthly');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const driftLeftRef = useRef<HTMLDivElement | null>(null);
  const driftRightRef = useRef<HTMLDivElement | null>(null);
  const kpiPinSectionRef = useRef<HTMLDivElement | null>(null);
  const kpiTrackRef = useRef<HTMLDivElement | null>(null);
  const portraitParallaxRef = useRef<HTMLDivElement | null>(null);
  const constellationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let rafId = 0;
    const updateScrollChoreography = () => {
      rafId = 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // 1. Staggered trust-strip horizontal drift
      const scrollRatio = Math.min(2, Math.max(0, window.scrollY / 900));
      const driftOffset = (scrollRatio - 0.5) * 32;
      if (driftLeftRef.current) {
        driftLeftRef.current.style.transform = `translate3d(${-driftOffset}px, 0, 0)`;
      }
      if (driftRightRef.current) {
        driftRightRef.current.style.transform = `translate3d(${driftOffset}px, 0, 0)`;
      }

      // 2. Pinned horizontal KPI showcase on desktop (Havenline pin-spacer effect)
      if (kpiPinSectionRef.current && kpiTrackRef.current) {
        if (vw >= 768) {
          const rect = kpiPinSectionRef.current.getBoundingClientRect();
          const scrollable = Math.max(1, kpiPinSectionRef.current.offsetHeight - vh);
          const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
          const containerW = kpiTrackRef.current.parentElement?.clientWidth ?? vw;
          const maxShift = Math.max(0, kpiTrackRef.current.scrollWidth - containerW);
          kpiTrackRef.current.style.transform = `translate3d(${-progress * maxShift}px, 0, 0)`;
        } else {
          kpiTrackRef.current.style.transform = 'none';
        }
      }

      // 3. Arched portrait subtle vertical parallax
      if (portraitParallaxRef.current) {
        const rect = portraitParallaxRef.current.getBoundingClientRect();
        const progress = (vh * 0.5 - (rect.top + rect.height * 0.5)) / vh;
        const shiftY = Math.max(-18, Math.min(18, progress * 24));
        portraitParallaxRef.current.style.transform = `translate3d(0, ${shiftY}px, 0)`;
      }

      // 4. Bottom CTA constellation subtle parallax
      if (constellationRef.current) {
        const rect = constellationRef.current.getBoundingClientRect();
        const progress = (vh - rect.top) / (vh + rect.height);
        const clamped = Math.min(1, Math.max(0, progress));
        const shiftY = (clamped - 0.5) * -36;
        constellationRef.current.style.transform = `translate3d(0, ${shiftY}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollChoreography);
      }
    };

    updateScrollChoreography();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      catalogService.getFeaturedCourses(),
      catalogService.listVideos(),
      catalogService.getCategories(),
      pricingService.getPricingConfig(),
      catalogService.getTestimonials(),
    ]).then(([courses, videos, cats, pricing, tests]) => {
      if (!active) return;
      setFeaturedCourses(courses.slice(0, 3));
      setPopularVideos(videos.slice(0, 3));
      setCategories(cats);
      setPlans(pricing.plans);
      setFaqs(pricing.faqs);
      if (pricing.faqs.length > 0) setOpenFaqId(pricing.faqs[0].id);
      setTestimonials(tests);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Measure active split-card offset for pixel-accurate Havenline carousel slide
  useEffect(() => {
    const syncOffset = () => {
      const track = featuredTrackRef.current;
      if (!track) return;
      const slideEl = track.children[featuredCourseIdx] as HTMLElement | undefined;
      if (slideEl) {
        setFeaturedTrackOffset(slideEl.offsetLeft);
      }
    };
    syncOffset();
    window.addEventListener('resize', syncOffset);
    return () => window.removeEventListener('resize', syncOffset);
  }, [featuredCourseIdx, featuredCourses.length, loading]);

  const splitHeroLines = (raw: string): [string, string] => {
    const clean = raw.replace(/[.។]+$/, '').trim();
    if (clean.includes('. ')) {
      const idx = clean.indexOf('. ');
      return [clean.slice(0, idx + 1), clean.slice(idx + 2)];
    }
    const words = clean.split(' ');
    if (words.length >= 2) {
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }
    return [clean, ''];
  };

  const [heroLine1, heroLine2] = splitHeroLines(t.home.heroTitle);

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (dragOrigin.current) {
      const dx = Math.max(-14, Math.min(14, (e.clientX - dragOrigin.current.x) * 0.2));
      const dy = Math.max(-10, Math.min(10, (e.clientY - dragOrigin.current.y) * 0.2));
      setTilt({ rx: -ny * 7, ry: nx * 7, tx: dx, ty: dy, dragging: true });
      return;
    }

    setTilt({ rx: -ny * 4, ry: nx * 4, tx: 0, ty: 0, dragging: false });
  };

  const handleCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    setTilt((prev) => ({ ...prev, dragging: true }));
  };

  const handleCardPointerReset = () => {
    dragOrigin.current = null;
    setTilt({ rx: 0, ry: 0, tx: 0, ty: 0, dragging: false });
  };

  const benefits = [
    {
      index: '01',
      icon: <Award className="h-5 w-5" />,
      title: t.home.benefit1Title,
      desc: t.home.benefit1Desc,
    },
    {
      index: '02',
      icon: <PlayCircle className="h-5 w-5" />,
      title: t.home.benefit2Title,
      desc: t.home.benefit2Desc,
    },
    {
      index: '03',
      icon: <Layers className="h-5 w-5" />,
      title: t.home.benefit3Title,
      desc: t.home.benefit3Desc,
    },
    {
      index: '04',
      icon: <Globe className="h-5 w-5" />,
      title: t.home.benefit4Title,
      desc: t.home.benefit4Desc,
    },
  ];

  const workflowSteps = [
    {
      num: '01',
      step: 'DISCOVER',
      title: pickText({ en: 'Select a track', km: 'ជ្រើសរើសមុខវិជ្ជា' }),
      desc: pickText({
        en: 'Filter structured courses and streaming workshops by discipline, level, and bilingual language.',
        km: 'ស្វែងរកវគ្គសិក្សា និងវីដេអូតាមប្រភេទមុខវិជ្ជា កម្រិត និងភាសា។',
      }),
      meta: '/courses · /videos',
    },
    {
      num: '02',
      step: 'ENROLL',
      title: pickText({ en: 'Verified checkout', km: 'ការបញ្ជាក់ការបង់ប្រាក់' }),
      desc: pickText({
        en: 'Enroll in open courses or complete transparent checkout via Card, KHQR, or bank transfer.',
        km: 'ចុះឈ្មោះរៀនឥតគិតថ្លៃ ឬបង់ប្រាក់តាមកាត KHQR និងធនាគារដោយតម្លាភាព។',
      }),
      meta: 'WEBHOOK VERIFIED',
    },
    {
      num: '03',
      step: 'LEARN',
      title: pickText({ en: 'Stream & practice', km: 'សិក្សា និងអនុវត្ត' }),
      desc: pickText({
        en: 'Launch lessons inside the dedicated Learner Workspace with synced video progress and watchlists.',
        km: 'ចូលរៀនក្នុងកម្មវិធីសិក្សា ជាមួយការរក្សាទុកវឌ្ឍនភាពដោយស្វ័យប្រវត្តិ។',
      }),
      meta: 'LEARNER APP · 3001',
    },
    {
      num: '04',
      step: 'CERTIFY',
      title: pickText({ en: 'Earn credentials', km: 'ទទួលវិញ្ញាបនបត្រ' }),
      desc: pickText({
        en: 'Complete assessments and receive verified completion certificates across English and Khmer.',
        km: 'បញ្ចប់ការវាយតម្លៃ និងទទួលបានវិញ្ញាបនបត្របញ្ជាក់សមត្ថភាព។',
      }),
      meta: 'VERIFIED CREDENTIAL',
    },
  ];

  const heroCourse = featuredCourses[0];
  const heroVideo = popularVideos[0];
  const heroPlan = plans.find((p) => p.highlighted) ?? plans[1] ?? plans[0];

  const activeTestimonial = testimonials[testimonialIdx] ?? testimonials[0];

  const kpiShowcase = [
    {
      label: pickText({ en: 'Learner satisfaction', km: 'ការពេញចិត្តរបស់អ្នកសិក្សា' }),
      numValue: 98.2,
      suffix: '%',
      smallSuffix: false,
      value: '98.2',
      unit: '%',
      sub: pickText({ en: '2026 YTD across tracks', km: 'ឆមាសឆ្នាំ ២០២៦' }),
      variant: 'accent' as const,
    },
    {
      label: pickText({ en: 'Active learners', km: 'អ្នកសិក្សាសកម្ម' }),
      numValue: 48000,
      suffix: '+',
      smallSuffix: false,
      value: '48,000+',
      unit: '',
      sub: t.home.statsLearners,
      variant: 'surface' as const,
    },
    {
      label: pickText({ en: 'Structured courses', km: 'វគ្គសិក្សាមានរចនាសម្ព័ន្ធ' }),
      numValue: 120,
      suffix: '+ tracks',
      smallSuffix: true,
      value: '120+',
      unit: 'tracks',
      sub: t.home.statsCourses,
      variant: 'strong' as const,
    },
    {
      label: pickText({ en: 'Streaming videos', km: 'វីដេអូសិក្សា' }),
      numValue: 450,
      suffix: '+ sessions',
      smallSuffix: true,
      value: '450+',
      unit: 'sessions',
      sub: t.home.statsVideos,
      variant: 'canvas' as const,
    },
    {
      label: pickText({ en: 'Bilingual disciplines', km: 'មុខវិជ្ជាពីរភាសា' }),
      numValue: null,
      suffix: '',
      smallSuffix: false,
      value: categories.length > 0 ? String(categories.length).padStart(2, '0') : '06',
      unit: '',
      sub: locale === 'km' ? 'EN + ខ្មែរ' : 'EN / ខ្មែរ Ready',
      variant: 'surface' as const,
    },
    {
      label: pickText({ en: 'Support response', km: 'ការឆ្លើយតបជំនួយ' }),
      numValue: null,
      suffix: '',
      smallSuffix: false,
      value: '24/7',
      unit: '',
      sub: pickText({ en: 'Bilingual learner desk', km: 'ក្រុមជំនួយពីរភាសា' }),
      variant: 'strong' as const,
    },
  ];

  const renderHeroHeadline = () => {
    if (!heroLine2) {
      return <span>{heroLine1}</span>;
    }
    const words = heroLine2.trim().split(' ');
    const lastWordRaw = words.pop() ?? '';
    const punctMatch = lastWordRaw.match(/^(.+?)([.។!?]+)$/);
    const lastWord = punctMatch ? punctMatch[1] : lastWordRaw;
    const trailingPunct = punctMatch ? punctMatch[2] : '.';
    const prefix = words.join(' ');

    return (
      <>
        {heroLine1}{' '}
        {prefix ? `${prefix} ` : ''}
        <span className="hero-word-highlight">{lastWord}</span>
        {trailingPunct}
      </>
    );
  };

  const heroRecordCode =
    heroMode === 'course'
      ? `CRS-${heroCourse ? heroCourse.id.slice(-4).toUpperCase() : '1042'}`
      : heroMode === 'video'
        ? `VID-${heroVideo ? heroVideo.id.slice(-4).toUpperCase() : '4471'}`
        : `PLN-${heroPlan ? heroPlan.tier.toUpperCase() : 'BASIC'}`;

  const heroStatusLabel =
    heroMode === 'course'
      ? pickText({ en: 'Enrolling now', km: 'កំពុងបើកចុះឈ្មោះ' })
      : heroMode === 'video'
        ? pickText({ en: 'Streaming HD', km: 'កំពុងចាក់ផ្សាយ HD' })
        : t.pricing.mostPopular;

  const heroOriginLabel =
    heroMode === 'course'
      ? pickText({ en: 'Track', km: 'វគ្គសិក្សា' })
      : heroMode === 'video'
        ? pickText({ en: 'Session', km: 'វីដេអូ' })
        : pickText({ en: 'Membership', km: 'គម្រោងសមាជិក' });

  const heroOriginTitle =
    heroMode === 'course'
      ? heroCourse
        ? pickText(heroCourse.title)
        : pickText({
            en: 'Complete Digital Marketing Course',
            km: 'វគ្គសិក្សា Digital Marketing ពេញលេញ',
          })
      : heroMode === 'video'
        ? heroVideo
          ? pickText(heroVideo.title)
          : t.home.popularVideosTitle
        : heroPlan
          ? pickText(heroPlan.name)
          : 'Basic Membership';

  const heroDestinationLabel =
    heroMode === 'course'
      ? pickText({ en: 'Outcome', km: 'លទ្ធផល' })
      : heroMode === 'video'
        ? pickText({ en: 'Library', km: 'បណ្ណាល័យ' })
        : pickText({ en: 'Access', km: 'សិទ្ធិប្រើប្រាស់' });

  const heroDestinationTitle =
    heroMode === 'course'
      ? pickText({ en: 'Verified Certificate', km: 'វិញ្ញាបនបត្រផ្លូវការ' })
      : heroMode === 'video'
        ? pickText({ en: '450+ Sessions', km: '៤៥០+ វីដេអូ' })
        : pickText({ en: 'Full Catalog', km: 'មាតិកាទាំងអស់' });

  const heroMilestones =
    heroMode === 'course'
      ? [
          {
            state: 'done' as const,
            title: pickText({ en: 'Discover', km: 'ស្វែងរក' }),
            sub: heroCourse ? `${heroCourse.durationHours} ${t.common.hours}` : `12 ${t.common.hours}`,
          },
          {
            state: 'done' as const,
            title: pickText({ en: 'Syllabus', km: 'កម្មវិធីសិក្សា' }),
            sub: heroCourse
              ? `${formatNumber(heroCourse.lessonsCount)} ${t.common.lessons}`
              : `42 ${t.common.lessons}`,
          },
          {
            state: 'live' as const,
            title: pickText({ en: 'In progress · Workspace', km: 'កំពុងរៀន · Workspace' }),
            sub: pickText({ en: 'Live now', km: 'សកម្មឥឡូវ' }),
          },
          {
            state: 'pending' as const,
            title: pickText({ en: 'Assessments', km: 'ការវាយតម្លៃ' }),
            sub: 'EN / ខ្មែរ',
          },
          {
            state: 'pending' as const,
            title: pickText({ en: 'Certified', km: 'ទទួលវិញ្ញាបនបត្រ' }),
            sub: pickText({ en: 'Credential issued', km: 'បញ្ជាក់សមត្ថភាព' }),
          },
        ]
      : heroMode === 'video'
        ? [
            {
              state: 'done' as const,
              title: pickText({ en: 'Curated', km: 'ជ្រើសរើសរួច' }),
              sub: heroVideo ? `${heroVideo.durationMinutes} ${t.common.minutes}` : '28 min',
            },
            {
              state: 'done' as const,
              title: pickText({ en: 'Queued', km: 'រួចរាល់' }),
              sub: heroVideo ? `${formatNumber(heroVideo.viewsCount)} views` : '12,400 views',
            },
            {
              state: 'live' as const,
              title: pickText({ en: 'Streaming · On-demand', km: 'កំពុងទស្សនា' }),
              sub: pickText({ en: 'Live now', km: 'សកម្មឥឡូវ' }),
            },
            {
              state: 'pending' as const,
              title: pickText({ en: 'Watchlist synced', km: 'រក្សាទុកក្នុងបញ្ជី' }),
              sub: 'Port 3001',
            },
            {
              state: 'pending' as const,
              title: pickText({ en: 'Completed', km: 'បានបញ្ចប់' }),
              sub: 'EN / ខ្មែរ',
            },
          ]
        : [
            {
              state: 'done' as const,
              title: pickText({ en: 'Choose tier', km: 'ជ្រើសគម្រោង' }),
              sub: heroPlan ? `$${heroPlan.monthlyPrice.toFixed(2)}/mo` : '$9.99/mo',
            },
            {
              state: 'done' as const,
              title: pickText({ en: 'Verified billing', km: 'ទូទាត់សុវត្ថិភាព' }),
              sub: 'Card · KHQR',
            },
            {
              state: 'live' as const,
              title: pickText({ en: 'Active · Instant unlock', km: 'ដំណើរការភ្លាមៗ' }),
              sub: pickText({ en: 'Live now', km: 'សកម្មឥឡូវ' }),
            },
            {
              state: 'pending' as const,
              title: pickText({ en: 'Sync workspace', km: 'ភ្ជាប់កម្មវិធីសិក្សា' }),
              sub: 'Port 3001',
            },
            {
              state: 'pending' as const,
              title: pickText({ en: 'Cancel anytime', km: 'បោះបង់បានគ្រប់ពេល' }),
              sub: '10% VAT clear',
            },
          ];

  const heroSpecs =
    heroMode === 'course'
      ? [
          {
            label: t.common.duration,
            value: heroCourse ? `${heroCourse.durationHours} ${t.common.hours}` : `12 ${t.common.hours}`,
          },
          {
            label: t.marketplace.lessonLabel,
            value: heroCourse
              ? `${formatNumber(heroCourse.lessonsCount)} ${t.common.lessons}`
              : `42 ${t.common.lessons}`,
          },
          {
            label: t.common.rating,
            value: `★ ${heroCourse ? heroCourse.rating.toFixed(1) : '4.9'}`,
          },
          {
            label: t.common.price,
            value: heroCourse
              ? heroCourse.price === 0
                ? t.common.free
                : `$${heroCourse.price.toFixed(2)}`
              : '$29.00',
          },
        ]
      : heroMode === 'video'
        ? [
            {
              label: t.common.duration,
              value: heroVideo ? `${heroVideo.durationMinutes} ${t.common.minutes}` : '28 min',
            },
            {
              label: t.common.views,
              value: heroVideo ? formatNumber(heroVideo.viewsCount) : '12,400',
            },
            {
              label: 'Archive',
              value: '450+ Sessions',
            },
            {
              label: 'Access',
              value: heroVideo?.accessType ?? 'Member',
            },
          ]
        : [
            {
              label: 'Monthly',
              value: `$${heroPlan ? heroPlan.monthlyPrice.toFixed(2) : '9.99'}`,
            },
            {
              label: 'Billing',
              value: 'Cancel anytime',
            },
            {
              label: 'Language',
              value: 'EN + ខ្មែរ',
            },
            {
              label: 'Checkout',
              value: 'Card · KHQR',
            },
          ];

  const heroCardTarget =
    heroMode === 'course'
      ? heroCourse
        ? `/courses/${heroCourse.slug}`
        : '/courses'
      : heroMode === 'video'
        ? heroVideo
          ? `/videos/${heroVideo.slug}`
          : '/videos'
        : '/pricing';

  const heroCardActionText =
    heroMode === 'course'
      ? t.marketplace.startCourseAction
      : heroMode === 'video'
        ? t.videos.watchNow
        : t.videos.viewPlans;

  return (
    <div className="bg-[#f6f3ec] dark:bg-[#101412]">
      {/* 1. HERO SECTION — Matching Havenline Big Editorial Proportions + Deco Rings + Milestone Record Card */}
      <section className="surface-mist relative overflow-hidden pb-16 pt-[132px] md:pb-24 md:pt-[180px] border-b border-[#ded8ca] dark:border-[#2A332E]">
        <span aria-hidden="true" className="deco-ring left-[-240px] top-[-320px] size-[760px]" />
        <span aria-hidden="true" className="deco-ring bottom-[-620px] right-[-360px] size-[1180px]" />

        <div className="mx-auto w-full max-w-[760px] relative px-5 text-center">
          <span className="t-eyebrow inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-line dark:border-[#2A332E] bg-canvas dark:bg-[#151A17] text-body dark:text-[#D5D1C8]">
            <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-accent" />
            <span>{t.home.badge}</span>
          </span>

          <h1 className="text-hero-editorial mt-6 text-[#141312] dark:text-[#f6f3ec]">
            {renderHeroHeadline()}
          </h1>

          <p className="mx-auto mt-6 max-w-[34rem] text-[18px] sm:text-[19px] leading-[1.6] text-[#6e6a62]">
            {t.home.heroDesc}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/courses">
              <Button size="lg" className="min-h-12 px-6 text-[15px]" rightIcon={<ArrowUpRight className="h-5 w-5" />}>
                {t.home.exploreCourses}
              </Button>
            </Link>
            <Link
              to="/videos"
              className="group inline-flex min-h-11 items-center gap-2 px-3 text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] transition-colors duration-[0.22s] hover:underline hover:text-[#1c5b48] dark:hover:text-[#7CD4B5]"
            >
              <span>{t.home.exploreVideos}</span>
              <ArrowUpRight className="h-[18px] w-[18px] shrink-0 transition-transform duration-[0.22s] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Big 980px Havenline-Style Manifest / Track Record Card */}
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 relative mt-12 md:mt-16">
          <div className="mx-auto max-w-[980px]">
            <div
              onPointerMove={handleCardPointerMove}
              onPointerDown={handleCardPointerDown}
              onPointerUp={handleCardPointerReset}
              onPointerLeave={handleCardPointerReset}
              style={{
                transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translate3d(${tilt.tx}px, ${tilt.ty}px, 0)`,
                transition: tilt.dragging
                  ? 'none'
                  : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="overflow-hidden rounded-[20px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] shadow-[0_28px_70px_-24px_rgba(23,28,25,0.14)] cursor-grab active:cursor-grabbing select-none"
            >
              {/* Top Record Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ded8ca] dark:border-[#2A332E] px-5 py-4 md:px-7">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-9 w-9 rounded-[8px] bg-[#e4ede7] dark:bg-[#1B3028] text-[#1c5b48] dark:text-[#7CD4B5] flex items-center justify-center shrink-0"
                  >
                    {heroMode === 'course' ? (
                      <BookOpen className="h-[18px] w-[18px]" />
                    ) : heroMode === 'video' ? (
                      <PlayCircle className="h-[18px] w-[18px]" />
                    ) : (
                      <Layers className="h-[18px] w-[18px]" />
                    )}
                  </span>
                  <div>
                    <p className="font-mono-tech text-[10px] uppercase tracking-[0.09em] text-[#6e6a62]">
                      {t.brand.name} · {heroMode.toUpperCase()}
                    </p>
                    <p className="font-mono-tech text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec] tabular-nums">
                      {heroRecordCode}
                    </p>
                  </div>
                </div>

                {/* Mode Switcher Pills */}
                <div className="inline-flex items-center p-1 rounded-full bg-[#e5dfd2] dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E]">
                  {(
                    [
                      ['course', t.nav.courses],
                      ['video', t.nav.videos],
                      ['plan', t.nav.pricing],
                    ] as const
                  ).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setHeroMode(mode)}
                      className={`font-mono-tech px-3 py-1 rounded-full text-[10.5px] uppercase tracking-[0.06em] font-medium cursor-pointer transition-colors ${
                        heroMode === mode
                          ? 'bg-[#1c5b48] text-white dark:bg-[#2D7A62]'
                          : 'text-[#6e6a62] hover:text-[#141312] dark:hover:text-[#f6f3ec]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center rounded-md bg-[#FBEFD8] dark:bg-[#8a5008]/20 px-2.5 py-1 text-[12px] font-semibold text-[#8a5008] dark:text-[#FBBF24]">
                    {heroStatusLabel}
                  </span>
                  <Link
                    to={heroCardTarget}
                    className="group hidden sm:inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline"
                  >
                    <span>{heroCardActionText}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 swiss-arrow-shift" />
                  </Link>
                </div>
              </div>

              {/* Split Origin -> Destination Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 px-5 pb-5 pt-6 md:px-7">
                <div className="max-w-lg">
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.09em] text-[#6e6a62]">
                    {heroOriginLabel}
                  </p>
                  <p className="font-serif-display text-[22px] sm:text-[26px] font-medium text-[#141312] dark:text-[#f6f3ec] leading-tight mt-1">
                    {heroOriginTitle}
                  </p>
                </div>
                <div aria-hidden="true" className="mb-2 hidden h-px flex-1 bg-[#ded8ca] dark:bg-[#2A332E] sm:block" />
                <div className="sm:text-right shrink-0">
                  <p className="font-mono-tech text-[10px] uppercase tracking-[0.09em] text-[#6e6a62]">
                    {heroDestinationLabel}
                  </p>
                  <p className="font-serif-display text-[22px] sm:text-[26px] font-medium text-[#141312] dark:text-[#f6f3ec] leading-tight mt-1">
                    {heroDestinationTitle}
                  </p>
                </div>
              </div>

              {/* 5-Step Horizontal Milestone Timeline (Desktop) */}
              <ol className="hidden grid-cols-5 gap-3 border-t border-[#ded8ca] dark:border-[#2A332E] px-7 py-6 md:grid">
                {heroMilestones.map((ms, idx) => (
                  <li key={idx} className="relative">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={
                          ms.state === 'done'
                            ? 'block size-2 rounded-full bg-[#1c5b48] dark:bg-[#7CD4B5]'
                            : ms.state === 'live'
                              ? 'milestone-live block size-2'
                              : 'block size-2 rounded-full border border-[#9CA39D] bg-[#efebe1] dark:bg-[#151A17]'
                        }
                      />
                      {idx < heroMilestones.length - 1 && (
                        <span aria-hidden="true" className="h-px flex-1 bg-[#ded8ca] dark:bg-[#2A332E]" />
                      )}
                    </div>
                    <p
                      className={`mt-3 text-[13px] font-semibold ${
                        ms.state === 'pending'
                          ? 'text-[#6e6a62]'
                          : 'text-[#141312] dark:text-[#f6f3ec]'
                      }`}
                    >
                      {ms.title}
                    </p>
                    <p className="font-mono-tech text-[10.5px] text-[#6e6a62] mt-1">{ms.sub}</p>
                  </li>
                ))}
              </ol>

              {/* Vertical Milestone Timeline (Mobile) */}
              <ol className="border-t border-[#ded8ca] dark:border-[#2A332E] px-5 py-5 md:hidden">
                {heroMilestones.map((ms, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center pt-1.5">
                      <span
                        aria-hidden="true"
                        className={
                          ms.state === 'done'
                            ? 'block size-2 rounded-full bg-[#1c5b48] dark:bg-[#7CD4B5]'
                            : ms.state === 'live'
                              ? 'milestone-live block size-2'
                              : 'block size-2 rounded-full border border-[#9CA39D] bg-[#efebe1] dark:bg-[#151A17]'
                        }
                      />
                      {idx < heroMilestones.length - 1 && (
                        <span aria-hidden="true" className="w-px flex-1 bg-[#ded8ca] dark:bg-[#2A332E]" />
                      )}
                    </div>
                    <div className="pb-3.5">
                      <p
                        className={`text-[14px] font-semibold ${
                          ms.state === 'pending'
                            ? 'text-[#6e6a62]'
                            : 'text-[#141312] dark:text-[#f6f3ec]'
                        }`}
                      >
                        {ms.title}
                      </p>
                      <p className="font-mono-tech text-[11px] text-[#6e6a62] mt-0.5">{ms.sub}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Bottom 4-Column Spec Bar */}
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-[#ded8ca] dark:border-[#2A332E] bg-[#e5dfd2]/55 dark:bg-[#181E1B] px-5 py-5 sm:grid-cols-2 md:grid-cols-4 md:px-7">
                {heroSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-3 md:block"
                  >
                    <dt className="font-mono-tech text-[10px] uppercase tracking-[0.09em] text-[#6e6a62]">
                      {spec.label}
                    </dt>
                    <dd className="font-mono-tech text-[13.5px] font-semibold mt-0 whitespace-nowrap text-right text-[#141312] dark:text-[#f6f3ec] tabular-nums md:mt-1 md:text-left">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / DISCIPLINES STAGGERED STRIP (Havenline "Moving freight for") */}
      <section
        aria-label={t.home.categoriesTitle}
        className="surface-mist border-y border-[#ded8ca] dark:border-[#2A332E] py-10 md:py-14"
      >
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <p className="font-mono-tech text-[10.5px] uppercase tracking-[0.14em] text-center text-[#6e6a62]">
            {pickText({
              en: 'BUILT FOR LEARNERS & TEAMS ACROSS',
              km: 'បង្កើតឡើងសម្រាប់អ្នកសិក្សា និងក្រុមការងារលើ',
            })}
          </p>
        </div>

        {/* Desktop Two Staggered Rows with Edge Fades & Smooth Scroll Drift */}
        <div className="relative mt-8 hidden overflow-hidden md:block">
          <span aria-hidden="true" className="fade-left" />
          <span aria-hidden="true" className="fade-right" />
          <div ref={driftLeftRef} className="flex items-center justify-center gap-16 pl-24 will-change-transform">
            {categories.slice(0, 3).map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="inline-flex h-7 items-center gap-2.5 text-[#6e6a62] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] transition-colors"
              >
                {idx === 2 && <span className="text-[#1c5b48] dark:text-[#7CD4B5]">{categoryIcons[cat.icon]}</span>}
                <span
                  className={
                    idx === 0
                      ? 'whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.2em]'
                      : idx === 1
                        ? 'whitespace-nowrap font-serif-display text-[24px] leading-none'
                        : 'whitespace-nowrap text-[16px] font-semibold uppercase tracking-[0.05em]'
                  }
                >
                  {pickText(cat.name)}
                </span>
              </Link>
            ))}
          </div>
          <div ref={driftRightRef} className="mt-8 flex items-center justify-center gap-16 pr-24 will-change-transform">
            {categories.slice(3, 6).map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="inline-flex h-7 items-center gap-2.5 text-[#6e6a62] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] transition-colors"
              >
                {idx === 1 && <span className="text-[#1c5b48] dark:text-[#7CD4B5]">{categoryIcons[cat.icon]}</span>}
                <span
                  className={
                    idx === 0
                      ? 'whitespace-nowrap text-[17px] font-medium uppercase tracking-[0.04em]'
                      : idx === 1
                        ? 'whitespace-nowrap text-[16px] font-normal tracking-[0.06em]'
                        : 'whitespace-nowrap font-serif-display text-[21px] uppercase tracking-[0.08em] leading-none'
                  }
                >
                  {pickText(cat.name)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Rail */}
        <div className="relative mt-7 md:hidden">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar px-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.slug}`}
                className="inline-flex h-6 items-center gap-2 text-[#6e6a62] hover:text-[#1c5b48] shrink-0"
              >
                <span className="whitespace-nowrap font-serif-display text-[18px]">
                  {pickText(cat.name)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE OFFERINGS — 4-Tile Dot-Grid Band (Havenline "Three ways + Accent card") */}
      <section className="surface-dots relative py-20 md:py-28 border-b border-[#ded8ca] dark:border-[#2A332E]">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <h2 className="sr-only">{t.home.benefitsTitle}</h2>
          <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible no-scrollbar pt-1.5 pb-3 md:pt-0 md:pb-0 snap-x">
            {benefits.map((b, idx) => {
              const isAccent = idx === 3;
              if (isAccent) {
                return (
                  <article
                    key={b.index}
                    data-reveal="true"
                    style={{ '--reveal-delay': `${idx * 70}ms` } as React.CSSProperties}
                    className="card-accent surface-accent rounded-[var(--radius-md)] p-6 md:p-7 min-w-[80vw] sm:min-w-[300px] md:min-w-0 snap-start flex flex-col justify-between"
                  >
                    <div>
                      <span aria-hidden="true" className="icon-box">
                        {b.icon}
                      </span>
                      <h3 className="font-serif-display text-[25px] leading-[1.15] tracking-[-0.015em] font-normal mt-6 text-white">
                        {b.title}
                      </h3>
                      <p className="mt-2.5 text-[14.5px] leading-[1.6] text-white/85">{b.desc}</p>
                    </div>
                    <div className="mt-7">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-[14.5px] font-semibold tracking-[-0.01em] text-white underline-offset-[6px] hover:underline tabular-nums"
                      >
                        <Phone className="h-3.5 w-3.5 opacity-90" />
                        <span>+855 23 900 123</span>
                      </Link>
                      <p className="text-[12.5px] text-white/80 mt-1">
                        {pickText({ en: 'EN / ខ្មែរ · Switch anytime', km: 'EN / ខ្មែរ · ប្តូរបានគ្រប់ពេល' })}
                      </p>
                    </div>
                  </article>
                );
              }

              const tileRoutes = [
                { to: '/courses', label: pickText({ en: '120+ Courses →', km: '១២០+ វគ្គសិក្សា →' }) },
                { to: '/videos', label: pickText({ en: '450+ Videos →', km: '៤៥០+ វីដេអូ →' }) },
                { to: '/pricing', label: pickText({ en: 'Free · Basic · Premium', km: 'ឥតគិតថ្លៃ · Basic · Premium' }) },
              ];

              return (
                <article
                  key={b.index}
                  data-reveal="true"
                  style={{ '--reveal-delay': `${idx * 70}ms` } as React.CSSProperties}
                  className="card-tile group p-6 md:p-7 min-w-[80vw] sm:min-w-[300px] md:min-w-0 snap-start flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span aria-hidden="true" className="icon-box">
                        {b.icon}
                      </span>
                      <span aria-hidden="true" className="index-number">
                        {b.index}
                      </span>
                    </div>
                    <h3 className="font-serif-display text-[25px] leading-[1.15] tracking-[-0.015em] font-normal mt-6 text-[#141312] dark:text-[#f6f3ec]">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#5c5852] dark:text-[#A3ACA6]">
                      {b.desc}
                    </p>
                  </div>
                  <Link
                    to={tileRoutes[idx].to}
                    className="font-mono-tech mt-7 inline-block text-[12px] text-[#6e6a62] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] transition-colors"
                  >
                    {tileRoutes[idx].label}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 mt-12 md:mt-16">
          <div className="flex justify-center">
            <Link
              to="/categories"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 border border-[#c2baa8] dark:border-[#2A332E] bg-transparent text-[14px] font-medium text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] hover:bg-[#f6f3ec] dark:hover:bg-[#151A17] transition-colors"
            >
              <span>
                {pickText({
                  en: 'See all six disciplines',
                  km: 'មើលមុខវិជ្ជាទាំង ៦',
                })}
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CAPABILITY BENTO SHOWCASE ("What our platform actually delivers") */}
      <section className="surface-paper py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <div className="max-w-2xl">
            <span className="t-eyebrow inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-line dark:border-[#2A332E] bg-canvas dark:bg-[#151A17] text-body dark:text-[#D5D1C8]">
              <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-accent" />
              <span>Capability</span>
            </span>
            <h2 className="text-h1 mt-5 text-[#141312] dark:text-[#f6f3ec]">
              {pickText({ en: 'What we can actually ', km: 'អ្វីដែលថ្នាលរបស់យើង ' })}
              <span className="hero-word-highlight">
                {pickText({ en: 'deliver', km: 'ផ្តល់ជូន' })}
              </span>
            </h2>
          </div>

          <div data-reveal="true" className="gradient-frame surface-dots mt-10 grid gap-3 p-3 md:mt-14 md:grid-cols-12 md:grid-rows-[auto_auto_auto] md:gap-4 md:p-5">
            {/* Top-Left (7 cols, 2 rows): Coverage & World Map */}
            <article className="card-cell flex flex-col p-5 md:col-span-7 md:col-start-1 md:row-span-2 md:row-start-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="t-method text-[#141312] dark:text-[#f6f3ec]">
                    Coverage
                  </p>
                  <p className="mt-1 text-[15px] text-[#4c4842] dark:text-[#A3ACA6]">
                    {pickText({
                      en: 'Six core disciplines across courses & video workshops.',
                      km: 'មុខវិជ្ជាស្នូលទាំង ៦ សម្រាប់វគ្គសិក្សា និងវីដេអូ។',
                    })}
                  </p>
                </div>

                <div
                  role="tablist"
                  aria-label="Filter disciplines"
                  className="inline-flex gap-1 rounded-full bg-[#e5dfd2] dark:bg-[#181E1B] p-1"
                >
                  {(
                    [
                      ['all', pickText({ en: 'All tracks', km: 'ទាំងអស់' })],
                      ['courses', t.nav.courses],
                      ['videos', t.nav.videos],
                      ['bilingual', 'EN / ខ្មែរ'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={coverageTab === key}
                      onClick={() => setCoverageTab(key)}
                      className={`inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 text-[13px] font-semibold transition-colors cursor-pointer ${
                        coverageTab === key
                          ? 'bg-[#f6f3ec] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] shadow-[0_1px_2px_rgba(20,19,18,0.06)]'
                          : 'text-[#4c4842] dark:text-[#A3ACA6] hover:text-[#141312] dark:hover:text-[#f6f3ec]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Havenline World Map SVG (Clean Landmass + Curved Green Routes) */}
              <div className="mt-4 flex flex-1 items-center">
                <svg
                  viewBox="0 0 620 316"
                  role="img"
                  aria-label="Global bilingual curriculum network map"
                  className="w-full"
                >
                  <defs>
                    <clipPath id="camcode-map-clip">
                      <rect width="620" height="316" />
                    </clipPath>
                  </defs>
                  <path
                    d="M361.7 225.6l-0.8 0.8l0.6 0.2l-2.4 0.1l2.6-1.1zM298.3 218.2l0.9 4.2l1.3-0.2l1.4 1.2l1.9 7.2l4.1 2.3l1.6 3.9l0.6-0.5l1.1 0.5l0.3 1.9l1.7 1.2l2.3 3.3l0.7 5.1l-1.1 5.2l-2.9 4.1l-1.9 4.4l-0.4 3.3l-3.6 0.8l-2.8 1.6l0.3 0.9l-1.7-1.3l0.1-0.6l-1.3 0.2l0.7-0.5l-0.4-0.3l-2.3 1.8l-3.7-0.9l-2.8-2.2l-0.1-1.8l-1.3-1.5l0.5-0.4l-1.8 0.4l0.5-1.1l-0.7-1.7l-0.7 1.9l-1.4 0.2l0.9-0.6l0.9-2.6l-0.2-1.9l-1 2l-2.7 2.5l-0.9-0.7h0.5l-0.4-1.2l-1.5-1.5l-0.2-1.2l-5.3-2l-9 1.5l-2.9 1.4l-1.2 1.7l-6.3 0.2l-3.4 2.1l-2.4-0.2l-2.6-1.4l0-1.4l0.6 0.2l0.6-0.9l0-2.8l-1.4-4.9l-2.9-5.5l1.1 0.6l-0.6-1.6l1.3 1.2l-1.4-3.4l1-4.6l0.2 1.1l4.5-3.3l7.4-1.9l2.3-2.7l-0.2-1.7l1.2-1.2l1.1 1.9l0.5-1.1l-0.5-1.2l2.1 0.3l-0.7-0.2l0.1-1.4l1.1-0.1l-0.4-0.5l0.9-0.1l-0.3-0.7l0.7-0.8l0.7 0.4l0.1-0.9l0.8 0.4l0.6-0.8l1 0.5l1.3 1.3l-0.3 1l0.9-1l1.8 0.7l0.4-0.6l-0.8-0.7l2.1-3.5l1.2-0.6l2.4 0.1l0-0.8l-1.3-0.9l5.3 1.8l1.6-0.6l-0.4 0.6l0.6 0.4l0.8-0.8l0.7 0.7l-0.8 1.5l-0.9 0.2l-0.9 2.8l6.6 4.3l2.2 0.5l1.5-2.8l0.1-4l0.8-1.8l-0.4-0.7l1.3-2.9l1.1 2.1zM358.7 227.7l0.7 1.3h-2.3l0.3-1l1.2-0.3zM334.5 232.9l4.7 3.7l-2.9-1.4l-2.1-2.5zM271.7 196.1l1.6-1.3l-0.7 1.4l1.1 0.9l-1.8-0.1l0.9 2l-1.2-1.1l-0.5-2.4l1.1-1.8l-0.6 2.3zM170.8 289.6l2.4 0.2l-1.4 0.5l0.6 0.6h-2.2l0.4-2.3v1zM301.5 271.9l2.2 0.8l3.2-0.7l0.2 2.8l-0.2-0.5l-0.4 2.5l-1.2-0.8l-0.7 1.7l-1.4-0.1l0.3-0.5l-1.3-0.8l-0.5-1.4l0.6 0.2l-1.3-1.9l0.1-1.4zM294.9 121.9l1.3 4l-1.8 2.6l-0.6 3.8l0.5 1l-0.9 1l-0.9 0.5l0-1.4l-1.7 2l-0.2-1l-0.9 1.1h-2l0.4-0.4l-0.7 0.1l-0.1-0.6l-0.5 0.7l0.6 0.7l-2 1.6l-1-1l0.5-1.2l-1.2-0.3l-4.2 0.9l-0.2 0.9l-2.2-0.2l0.2-0.8l3.3-2.2l5.1-0.2l1.6-3.5l0.9-0.3l-0.8 0.8l0.6 0.7l1.9-0.9l2.5-3.3l0.3-3.6l0.7-1.2l0.7 0.8l0.7-0.2l0-0.6l-0.6 0.2l0.5-0.6zM530.7 156.9l3.5 0.5l9.8 4.9l-6.2 0.6l0.9-1.4l-1.6-0.3l-1-1.5l-5.4-1.1l0-0.8l-5.2 1.5l1.4-1.5l3.4-0.9zM620 3.7l-3.5 0.7l3.5-0.5v52.6l-1.7 0.7l-2.3-1.1l0.3 1.3l-1.7 1l-2.6 3.5l-0.9 0.6l-1.2-0.6l0.4 0.9l-3.7 1.5l-0.4-0.3l1.3-1.7l-1.5-0.2l0.6 0.3l-0.6 1.1l-0.7-0.3l0.6 0.8l-3.4 0.4l1 0.6l-1.2 0.9l-1.4-0.2l1.6 1.8l-1.1 0.7l-1.3-0.2l1.6 0.4l0.1 1.1l-1.4 1.8l-1.4-0.4l1 0.7l-0.5 0.6l-1.8 0.1l1.4 0.4v1.9l-0.8 0.3l0.4 0.3l-1.2 2.9l-1.5-0.2l1.3 0.7l-0.2 1l-1.9 0.1l0.3-1l-0.7 0.7l-1.3-0.5l1.1-1.2l-1.1 0.6l-1.1-0.5l0.3-1.6l-1.8 1.1l-2.1 0.2l0.6-0.7h-1.1l-1.5-1.5l-0.2-0.8l1-0.5l-1.4 0.2l0.1-0.6l-1.3-0.7l0.9-1.5l-1 0.6l-2-2.6l0-0.6l2.2-0.6l-2.3 0.3l0.3-1l1.6-0.6l0.8 0.6l-0.2-0.7l-1.4-1.4l0.3 1.3h-0.8l-1 1.4l-0.4-0.3l-0.8-2.7l2.5-1.3l-2.2 0.9l-1.5-0.4l-0.2-1.3l3.6-2.3l-4.1 2l0.4-1.4l1.7-0.6l-2.2-0.4l-0.2-1.2l2.2-1l3.3 0.7l-1-0.5l0.4-0.4h-2.4l-2.4 0.8l1-1.9l2.7 0.4l0.7-1l-3.8 0.3l0.6-0.9h3.3l0.6-0.6l-0.8 0.2l0.3-1.2l1.3-0.1l-1.3-0.1l1.3-2.5l-3.3-0.1l-3.9-2l2.9-0.2l3.7 1.1l-1.9-1.9h1.3l-3.4-0.5l0.2-0.9l1.9-0.7l-2.9 0.3l0.5-0.7l-0.8-1.8l-0.5 0.1l0.8 1.4l-0.9 1.4l-2.8-0.3l1.3-2.6l-1.3 0.6l0.5-0.6l-0.5-0.3l1.2-0.4l0.3-1l-1.6-0.4l0.6-1.1l-1.4-0.7l0.5-0.7l-0.7-1.3l-1.7 0.1l1.7-1.4l-4-2.8l0.5-0.6l-0.4-0.6l-8.2-2.4l-3.6 0.8l-3-0.2l0.5 0.8l-2.6-0.4l-2-1.1l2.4-0.9l-2.7-0.3l-0.1-1l-1.5 0.7l-1-1l5.2-1.1l3 0.4l0.2-1l-0.9-0.5l-4.4 0.8l-2.1-0.9l0.8-0.5l-3.5-0.4l-1.1-0.7l0.1-0.8l7.5-2.6l4.4-0.5l1.8-3.2l1-0.4l-4.6 0.1l-0.6-0.6l0.4-0.7l4.3-2.4l1.3-0.2l1.2 0.7l0.1-1.3l2.7 0.3l0.4-2.5l1.3-0.8l2 0.2l4.6 2.1l-4.6-2.6l8.1-1.5l1.5 0.8l0.2 2.1l0.9-0.9l0.1-1.8l3.6 1.7l2.3-0.1l-2.4-2.2l1.6-0.1l9.1 2.9l0.7-2.9l-2.1-1.1l7.2-0.1l-8.2-0.4l-0.6-0.4l0.6-0.5l5.4-0.9l2.9 0.7l1.7-1l3.8 1.5l0.3-0.7l-1.2-1.1l9.8-0.8l5.1 0.1v1.8zM0 3.9l8.4-0.2l1.1 1.2l4.8 0.8l0.1 0.6l-2.5 0.9l-11.7 1.2l0.6 0.5l7.6-0.3l1.4 1.2l1.4-0.3l0.7-0.9l3-0.3l0.2 2l-3.2 3.3l6-3.5l3.7 1l2.3-1.6l3.2-0.1l4.9 1.4l-2.9 1.6l-2.3 0.3l-0.1 1l-3.9 0.7l1.4 0.6l-0.9 0.7h-5.1l-1.2 1l0.1 0.9l1.2 0.1l-0.1 1.5l0.8 0.7l-3.7 2l-1.1 3.5l1.5-0.7l2.4 0.7l0.3 0.5l-2.4-0.2l0.8 1l3.1 0.4l0.2 1.2l-0.5 0.6l-3.2-0.6l-3.7 0.9l1.3 0.3l0.7 1.1l2.8 0.6l0.5 3.2l-1.6-0.4l-2 1l-1-0.3l0.9 0.5l1.2-0.4l0.2 1.5l0.8-1.1h0.7l1.3 2.1l-3.2 0.8l-1.4-0.4l-0.1-1.1l-0.6 1.7l3.4 0.7l-0.5 1.3l-2.9 0.6l-3.1-1.6l-0.9 0.5l-1.5-0.8l1.3 1.1l-2.2 0.9l-2.1-0.6l1.3 0.6l-1.8 0.3l5.9-0.9l3.6 1.7l-0.4 2.6l-3.1-1.3l-1-1.7l-3.4 1l3.1-0.6l0.3 1.1l-0.8 0.7l0.9-0.2l4.5 2.2l-0.8 1.1l1.2-0.3l0.4 3l-1.5 0.2l-0.1-1.2l-0.4 1.3l-1.1-0.1l-2.1-2.4l-4.4-1.3l2.2 0.5l0.1 1l-1.6 0.7l-2.9-0.1l0.5 0.9l-1.7 0.8h4.3l-1.7 1l0.3 0.4l3.2-1.2l5.7 0.8l-2.8 1.2l0.2 0.4h-1l-3.5 2.7l-5.3 1.2h-1l0-52.6zM82.6 81.1h1.1l-2.8 1.7l-1.3 0.1l1.2 0.3l-1.6 5.7l-2.2 0.2l-0.9 1.8l-2.2-0.1l-0.8-2.1l0.6 0.1l0.2-0.9l-2.9-4.3l0.3-1.8l-1-0.3l-0.4-1.5l-0.7 1.9l-1.1-0.2l-2.4 2.4l-2.4 0.2l-2-1.4l0-1l1.3 0.1l-0.8-0.3l0.9-1.1l-2.1 1l0.1-1.1l1.7-0.6l-0.9-0.1l2.2-1.7l-1.4 0.4l-1.8 1.8l0.1-1.1l0.9-0.1l-1-0.8l0.9-0.7l-0.9 0.2l-0.2-1.1l3-0.3l0.5 0.5l1-0.6l-0.3-0.6l-0.3 0.6l-3.4 0.2l-0.6-2h3.1l-2.9-0.4l2.8-1.2l-1 0.2l0.4-0.5l3-0.4l-2.3 0.1l1.4-1.1l1.8 0.7l-0.8-0.8l0.8-0.5l-0.1-0.7l2-0.1l0.5 0.6l2.3-1.1l-0.1-0.7l-2.1 1.5l-0.9-0.5l3.6-3.1l-0.6 0.2l0.4-0.6l2.1-0.7l0.3-0.3l-0.8 0.4l-0.6-0.5l1.6-1.7l-0.4-0.4l2.1-0.6l-1.5 0.2l0.1-1.2l1.3-0.4l-0.5-0.3l0.8-0.6l2.2-0.3l-1.7-0.2l0.9-0.9l1.1 0.7l-0.5-1.2l-0.8-0.2l2-1.2l0.6 1l-0.2-1.3l2.3-0.3l-1.8-0.3l2.7-1.9l0.3-0.9l1 0.4l-0.4-0.5l1.9-1l-0.1 1.2l1.2-1.6l-0.4 1.9l1.1-0.6l-0.2-1.2l2.3 0.3l-1.1-1.3l2.3-0.4l1.2 1.2l2.2-3.2l1.9 0.5l-1.2 2.3l2.5-2.5l0.2 1.6l1.6-1.3l-0.4-0.6l1.4-0.1l0.4 0.5l-0.8 0.6l0.7 0.1l-0.2 1.3l1.1-1.9l3.6 1.4l-1.1 0.9l-2.6-0.1l1.4 0.5l0.2 0.7l3.2 0.2l0.8-0.8l1.7 0.7l-1.4 0.1l0.3 0.6l1.9 0.2l-0.6 1.1l1-0.7l3.7 0.3l8.8 4.4l0.7 1.5l-0.3 1.1l-1.9 1.5l-2.5 0.7l-7.1-1.4l-2.7-1.5l-1.8-0.3l3 2.1l-0.5 0.3l2.3 1.1l-0.5 1.6l1.1 2.7l4.2 1.7l1-0.8l-2.5-1.9l0.5-1.1l4.9 1.7l1.2-0.6l-1.1-2.3l4.2-2.6l3.2 1.5l0.6-2.7l-1.1-0.9l0.7-3l-1.5-1.2l4.4 0.6l1.4 1.8l-2 0.3l-1.1 1l2.7 1.8l2-0.5l0.4-1.8l1.7-0.3l-0.2-0.6l5.6-1.9l0.7 0.5l0.6-0.4l-0.7-0.3l2.5-1.2h1.2l-1.2 0.3l0.2 1.4l-1.1 0.5l2.8 0.2l0.9-1.1h3l3.3-1.3l0.5 0.8l-0.5 0.9l1.1 0.2l0.3-1l1.8-0.9l-1.3-1.8l1.3-0.8l5.6 1l7.4 3.5l1.1-1.8h-1l-1.6-1.9l-1.2 0.1l0.6-3.7l-1-0.2l-0.1-0.8l2.8-1.9l2-4.2l3.6 0.2l2.3 0.7l-0.4 2.2l-1.3 1.8l1.5 1.5l-0.2 6.2l1.7 1.4l-0.9 2.2l-2.9 2.3l0.3 0.8l-1.4 0.5l-0.6-0.2l0.5-0.5l-2.9-0.1l1.7 1.1l3.6 0.5l3-2.2l1.6-2.2l-0.6-2l1.2-1.3l2.3-0.3l1.4 1.5l-0.1 2l3 0.6l-2.3-0.5l0.7-1.5l-0.6-1.9l-2.8-1l-3.9 0.1l-0.3-1.9l1.3-2.4l-2.2-2.7l1-1.3l2.3-0.9l-0.3-2.2l1.4 0.8l-0.6 3.7l0.8 0.5l5.6 1l-4.4-1.9l-0.7-1.2h3.7l-1.3-0.8l1.8-0.7h1.6l3.9 2.2l2.5-0.1l-1.4 1.5l-0.2 2.1l0.1 0.6l0.6-1.5h0.7l-0.5 2.1l0.7 0.4l1.1-1.5l-1-1.7l0.6-1.8l-4.6-2.6l-0.5-3.6l10.9-1l-1.9 1.5l1.5 1l-1.2-1.1l2.8-1.2l-2.7-1.7l2.1-0.2l-2.5-0.9l2.8-1l-0.7-0.8l12.3-2.8l-2.2 0.2l0.7-0.7l4-0.1l0.8 0.2l-0.7 0.7h1.5l3.7-1.3l1.9 0.8l-0.4 0.8l0.5-1.2l-1.7-1.3l4.7 0.2l-1.1-0.4l0.1-1.6l5.2-2.7l3.5 1.3l-3.2 1l5.6 0.7l-1.8 1.5l2.3-0.1l0.8-0.7h5l1.4 0.6l0.1 0.6h1.1l0.1 1.2l1-0.7l0.5 1.3l0.6-0.1l-0.5 1.2l-1.9-1l2.1 1.4l-1.4 1.5l-11.6 5.8l-1.8 1.7l9.9-3.1l-2-0.1l1-0.9h2.2l-0.3 0.7l1.3 0.4l1.5-0.7l0.8 1.9l-0.6 1.7l0.9 0.6l-0.8-0.6l1.2-1.7l-0.6-0.6l0.9-0.2l7.6-0.1l0.8 0.4l-0.8 0.1l-0.1 0.7l0.9 0.4l6.2 0.8l1.9-1l-0.4-1.5l2-0.4l1.8 1l1.1-0.3l0.5 0.7l0.8-0.7l1.3 0.2l2.3 1.2l-0.9 0.7l1.2 0.7l-1.5 0.5l1.5 0.3v1.2l-2.7-1.1l2.1 2.1l0.5-0.5l0.4 0.6l-1 0.2l1.5 1.8l2.2 1.1l1.8-1.5l1-2.2l1.8 1.6l4.1-0.6l3.2 1.5l0.5-1.5l3.1 0.4l-1.1-1.5l1.4-0.8l-1.7 0.1l-0.1-0.5l3.3-0.8l-0.4-1l9.3 1.4l-3.5 0.6l0.5 0.3l4-0.4l-1.2 1.1l0.2-0.6l-0.8-0.3v0.9l-1.2 0.1l0.2 0.7l3.6-2l3.8 0.5l0.9 0.9l-1.8 0.6l2.8 0.6l-0.8 0.9l2.5-0.2l0.9 0.9l-0.6 0.1l1.3 0.4l5.9-0.8l4.8 0.5l2.1 1.4l-0.2 2.2l1.9 0.5l0.7 2.2l-0.8 1.1l1.2-1.1l0-1.5l2.8-1l6.3 0.7l1.8-0.7l0.7 1.4l1.8 0.5l0.5 0.9l1.6-0.1l0.8-0.9l-1.5-1.5l0.6-1.5l4.8 0.9l4.5-0.2l7.1 2.7v11.4l-2.6 1.3l-2.8-1.3l-0.9 0.1l1.4 0.7l-1.9-0.5l-2.6 0.8l2.6-0.6l0.1 0.9l2.2-0.6l0.5 1.3l0.9-0.1l0.8 1.4l-0.4 0.7l1.9 2.2l-0.7 1.2l-3.7-1.2l0.3 0.6l-7.4 2.9l-3.9 2.7l-0.5 1.2l-1.9-1.6l-3.4 0.5l-1.7 1.4l0.2-1.6l-2.4 1.6l-2.1-0.5l-3.1 5l0.7 0.9l0.5-0.6l1 0.4l-0.8 1.4l1 2.4l-0.9 0.4l-0.4-0.4l0.8-0.7l-0.7 0.1l-1 1l-0.6 1.4l0.6 1.8l-3.4 1.3l-0.1 2.5l-2.7 0.3l-0.6 2.8l-2.4 1.9l-2-9.9l0.7-3.6l1.5-1.5l0-1.2l2.5-0.5l6.5-6.3l2.8-1.2l0.9-3.6l2-0.5l-1.7-0.6l-1.8 0.4l-0.5 2.6l-1.2-0.2l-3.8 2.7l0.4-1l-1 0.1l0.9-2.4l-4.9 0.2l-5.5 5.1l-0.3 0.8l1.8 0.9l-6.6 0.8l-0.4-0.5l2-0.4l-4.5-1.4l-1.5 0.6l-0.1 0.7l-3.8-0.5l-0.8 0.7l-0.9-0.6l-5.1 0.5l-8.4 7.7l-4.2 2.9l1 0.8l1.7-0.1l-0.2 2l1.7-1.2l-0.6 0.5l0.8 0.3l-1 1l2.2-1l-0.1 1l0.4-1.9l1.9 0.2l2.7 2.3l-0.9 0.4l1.1 2.1l-1.6 3.2l-0.7 5.3l-4.2 5.7l-4.4 4.9l-1.9 1.2l-1.5 0.5l-2.1-1.3l-1.3 1.4h-0.8v0.7l-1.8 1.5l0.1 1.5l-3.7 2.2l-0.3 1.1l1.6 1.1l1.9 3.2l0.2 2.2l-0.6 1.5l-2.6 0.5l-0.7 0.9l-0.1-0.5l-1.2 0.8l-0.4-1.6l0.8-1.4l-1.1-1.8l1.4-0.3l-0.5-1.7l-1.5-0.4l-0.7 0.5l-1.2-0.8l1.5-1.1l-0.7-0.3l0.4-1.4l-1.3-0.2l-0.5-0.8l-5.5 2.6l1.2-1.3l-1-0.3l1.7-2l-0.7-1l-1.1 0.2l-3.8 3.5h-1.9l-0.4 1.5l2.2 0.8l0.3 1.7h1.1l1.7-1.3l3.3 0.9l-0.5 1.1l-2.7 0.4l-0.3 1l-0.8-0.2l-1.7 2.7l1.9 1.1l1 3.1l1.7 1.6l-3.1-0.2l1.2-0.1l2 2l-2.9 1.3l1.8-0.1l1.4 0.8l-1 0.7h0.8l-0.1 0.7h-0.8l0.3 1.6l-1.5 0.5l-1.1 2.5l-0.9-0.2l0.5 0.8l-1.2 0.4l0.8 0.2v1.1l-0.8-0.1l-0.9 1.5l-1.4 0.3l0.4 0.4l-1.2 1.2l-0.8-0.1l-0.7 1.3l-3.2 0.3l-0.6 0.9l-1.3-1.5v1.6l-5.4 1.6l-0.1 1.9h-0.7l-0.5-1.1l0.5-1h-1.5l-0.8-0.8l-2.5 1.7l-0.8-0.1l-1.8 3.7l5.5 6.3l1.1 4.9l-0.8 2.2l-3 1.6l-1.1-0.1l-0.1 1.1l-0.7-0.7l0.7 1.1l-1.3-0.7l0.6 1.1l-1.8 1.3l-0.6 0.1l0.4-2.6l-2.4-0.8l-0.1-1.1l-0.7 0.4l-0.9-2.2l-3-0.8l0.1-1.4l-1.6 0.2v2l-1.4 3.3l0.1 1.8h1l1 3.6l1.9 0.6l2.9 2.7l0.4 4.1l1.4 2.6l-1.3 0.1l-3.8-2.7l-2-6.1l-2.4-3.1h-0.7l1-6.1l-1.9-5.5l-0.1-3l-0.6 0.1l-0.9-1.6l-0.2 1.3l-1-0.1l0.3 0.5l-1.7 1.3l0-0.6l-1.2 0.3l0.1-1.1l-0.9 0.9l0.7-2.8l-1-3l-0.2 0.7l-0.7-0.9l0.9-0.1l-3-2.4l-0.7-2.8l-0.7-1l-0.9 0.5l-0.6-1.8l-0.6 0.3l0.6 2l-0.6 0.9l-0.5-1.1l-0.7 1.2l-0.1-0.9l-0.2 1l-0.6-0.7l-0.5 1l-0.2-1l-0.1 0.8l-0.8 0.1l-0.3-1.4v1l-1.8 1.1l-0.2 1.6l-2.6 1l-2 2.7l-3 2.1l-0.2 0.9l-3.4 1.5l-0.7 9.5l-0.9 0.1l-0.7 1.2l0.8 0.6l-1.7 0.2l-1.5 1.8l-1.7-1.5l-5.5-13.2l-1.2-6l-0.1-2.9l0.9-0.5l-1 0.1l0.5-1l-1.1-0.1l-0.3 2l-2.2 0.8l-3.1-2.8l2.1-0.5l0.6-1l-1.5 0.6l-1.4-0.5l-0.7-0.9l0.6-0.5l-0.9 0.4l-1.2-0.5l-1.9-3.1l-8.7 0.9l-7-1.3l-1-2.5l-3.4 1.2l-1.8-0.4l-3.8-2.2l-2.5-4.3l-0.9 0.3l-0.7-0.9l-0.5 0.9h-1.5l0.3 0.9l-0.7 0.3l0.5 0.1l1.3 3l2.3 2l-0.1 1.3l1.3 2.1l0.3-2.1l0.9 0.1l-0.4 2.9l1.4 0.6l3.5-0.3l3.9-4l0.4 3.4l1 1l2.7 0.8l1.8 2.3l-2.3 3.3l-0.6-0.3l-0.5 0.6l-0.1 2.2l-1.7 0.4l-0.7 1.4l-1.6 0.3l-0.7 1.4l-4.3 1l-0.6 1.4l-6.1 2.9l-5.2 1.2l-1.1 0.9l-2.6 0.2l-1.5-4.4l0.1-2.7l-3.3-5.4l-2.6-2.1l-1.4-5l-1.6-1l-4-7h-1l0.6-2.8l-1.3 3.4l-3-4.1l0.3 1.9l5.4 9.2l-0.5 0.3l0.3 1.5l2.1 1.7l1 5.7l1.9 1.4l2.1 5.2l0.1-0.6l2.3 1.5l3.7 3.9l-1.4 1.5l1.1-0.1l1.9 1.9l1.2 0.1l8.9-1.9l1.1-0.8l0.8 0.2l-0.3 2.5l0.6 0.1h-0.8l-0.2 1.6l-4.9 8.6l-13.3 12.2l-1.8 3.6l-0.7 2.4l1.3 1.6l-0.4 2.5l0.7 2.7l1.5 1.1l-0.3 4.1l0.7 3.2l-1.7 2.9l-4 2l-1.9 2.1l-3.1 1.7l1.2 4.8l0.4-0.2l-0.1 3.3l-0.9 1l-3.8 1.9l0.1 2.6l-0.9 2.9l-4 5.1l-5 4.2l-3.9 1.2l-3.9-0.3l-4.4 1.5l-2.8-1.1l-0.9-2.7l0.8-0.6l-0.2-1.4l-5.6-10.2l-0.8-7.1l-4.7-8l0-3.8l1.4-4.2l1.9-2.3l0.3-1.9l-1.4-3.5l0.6-1.1l-1.9-3.9l1.4-0.5l-1.5-0.1l-0.7-2.1l-3.8-3.8l-1-1.8l0.8 0.4l-1.3-1.7l1-0.4l0.1-1.2l1.1 0.3l-1.2-0.6l0.5-0.1l-0.4-1l1-3.3l-0.4-1.7h-1.2l-1.3-1.5v0.7l-2-0.3l-0.3 0.5l-0.3-0.5l0.2 0.6l-1.4 0.1l-1-0.9l0-1.4l-1.8-1.2l-1.7-0.2l0.5-0.3l-4.2 0.8l-5.7 2.4l-2-1l-3.6 0.2l-3.9 1.5l-1.3-0.4l-7.2-4.8l-1.4-1.8l0.7-0.4l-0.5 0.1l-0.9-2.3l-2.9-2.3l0.5-0.7l-0.7-0.3l0.7-0.3l-1.5 0.3l-1.4-1.2l0.5-0.2l-0.5-0.1l0-1.3l2.3-0.1l-1.7 0.2l-0.4-1.2l-1.5-1.3l1.6-1.7l0.9-3.2l-0.8-3.2l0.5-1.6l-1.1-1.5l-0.4 0.4l2.1-5.4l1.7-1.6l0.7-2.7l1.6-1l1.1-2.2l2.4-0.8l2.3-2l0.9-1.3l-0.2-2.5l0.9-2.2l4.1-2.7l1.7-3.6l1.1-0.2l1.1 1.4l2.8-0.4l1.9 0.6l5.4-2.8l4.4-0.7l2.6 0.4l2-0.8l2.5 0.4l3.1-0.9l1.2 1.2l1.2-0.3l-1.1 1.2l1.1 2l-1.8 2l0.4 0.9l3.4 1.7l5 0.9l0.9 1.9l5.6 2.1l1.8-0.9l0.2-2.7l2.6-1.4l5.6 1.8l0.6 0.9l6.6 1.3l3.5-1.5l2.6 1l2.3-0.2l1-0.8l2.5-5.6l-0.3-3.5l0.7-1l-1.4 0.5l-1.2-0.5l-3.3 1.6l-2.6-1.6l-1.1-0.1l-0.3 1.2l-1.3 0.2l-1.2-1.1l-2.5 0.1l1.2-0.7l-1.7 0.1l0.5-0.4l-0.8-1l0.3-0.6l-1.7-0.6l0.3-0.7l0.4 0.6l0.8-0.2l-0.6-0.6l0.2-1.7l-1.4 0.2l0.2-1l0.9-0.9h3.9l-0.4-0.3l1.9-0.4l-1.3-0.4l0.1-0.6l3.6 0.3l3.7-1.9l2.8-0.1l2.4 1.6l3.4 0.7h3.2l2-1l0.6-1.1l-0.6-1.6l-8.3-5.1l0.5-0.6l1.3 0.1l0.5-1.3l1-0.2l-1.3-1.2h1.3l1.2-1.3l-5.8 1.4l-1.4 1.1l0.3-0.7l-0.6 0.5l0.3 1l0.7 0.9l2-0.2l-0.4 0.7l-1.5-0.1l-2.7 1.5l-0.8-0.3l0.2-1.2l-1.8-0.6l1.8-1.5l-3-0.4l-0.5-0.6l1.8-0.1l-0.9-0.1l-0.5-1.2l0.2 1.2l-1.9 0.2l-2 1.8l-0.1 1.9l-1.1-0.3l-0.6 3.1l-1.9 2.2l2.5 3h-2.5l-2.2 1.9l1-1.1l-2.9-0.8l-2.3 0.5l1 1.2l-1.1-0.3l0.4 0.7l-2.3-1.1l1.2 2.7l-0.7-0.3l0.3 0.6l-0.9 0.3l2.5 1.5v0.9l-0.9-0.7l-0.8 0.3l0.8 0.9l-1.3-0.2l0.8 2.1l-0.8-0.6l-0.5 0.6l-0.6-1.1l-0.3 0.6l-1.4-2.3l1.3-0.9l1.8 0.7l0.4-0.4l-3.5-0.4l-0.6-1l0.6-0.3l-1.4-0.6l-1.5-1.9l0.3-3.1l-4.4-2.6l1.2 0.4l-1.4-1.2l-1.6-0.2l-2.5-3.8l-1.2 1l-0.4-2l-2.3 0.7l0.2 2.6l2 1.4l1.7 2.7l2.8 0.8l-0.4 0.7l4.4 2.7l-0.2 0.8l-2.5-1.3l-0.7 1.4l1.1 1.6l-1.9 2.1l-0.7-0.2l1-1.8l-0.9-2.1l-7.8-5l-1.7-3.2l-2.4-1l-4.6 2.8l-3.6-1.1l-1.3 0.9v2.6l-4.4 2.3l-1.8 2.6l0.9 1.5l-1.2 0.9l-0.4 1.4l-1.6 0.5l-0.8 1.2l-3.9 0.1l-2.1 1.4l-2.2-2.5l-3.6 0.5l0.5-2.8l-1-0.5l0.8-0.8l-1.2 0.6l1.4-4l0-3.1l-0.8-1.9l2.5-1.2l9.8 0.8l0.9-0.4l0.7-4.2l0.9 1.1l-1.1-1.5l0.1-1.3l-1.6-1.2l-0.1-0.7h0.7l-4.5-1.4l-0.6-0.4l0.8-0.6l-0.9-0.5l2.6-0.7l0.9 0.7l2.3-0.3l-0.8-2.3h1l0.2 0.7l2.7-0.2l-0.4-0.5l2.1-0.9l0.6-1.9l4.2-1l-1.3-0.4l1.4 0.2l-0.4-1.1l1.3-2.3l1.3-0.8h2.9l0-0.9l0.7-0.1l1.5 0.7l0.2-1.1l2 0.7l-1.9-1.7l0.5-0.6l-0.6-2.1l-0.8-0.4l0-2.5l1.8-0.2l-0.1-0.8l-1.5 0.7l0.6-0.9l3.4-1.6l-0.5 2.8l1.1 0.4l-2.3 2.3l0.5 2.5l1.9 0.2l-0.2 0.9l0.9 0.1l2.8-1.1l2.7 1.8l-1.3-1.1l0.9 0.5l6.4-2.2l1.2 0.4l-0.6-0.2l0.7 0.9h1l2.9-3l-0.9 1.6l1.1 0.1l-0.3-4.1l1.2-2.3l1.4-0.4l1.9 1.8l1.3-0.7l0.2-2.7h-1.3l-0.5-2.1l3.5-1.2l4.1 0.6l0.3-0.9l3.6-0.5l-2.6-1.1l-0.2-0.7l-3.4 0.6l0-0.5l-6.1 2.1l-0.2-1l-0.7 0.4l0.2-0.9l-2-0.5l0.3-2.6l-0.9-2.8l0.8-1.5l1.3-0.3l3.9-4.1l1.4-0.6l-0.1-1.3l-1.2-1.1h-3.9l-1.7 1.5l-0.4 1.4l0.6 1l-1.3 1.6l-3.7 1.9l-0.2 0.8h-1l0.2 0.8l-1.1 0.3l0.4 0.7l-0.8 1.7l0.2 2.3l1.2 0.3l1.8 2l-1.8 1.2zM138.9 110.2l-2.2 0.9l-1.1 1.3l-2.2 0.5l-1.3 2.6l1.3 1.9l0.3-0.7l0.2 2.5l4.5 5l-1.4 0.1l-1 2.3l0.2 2.8l4.6 2.1l3.8-0.4l-0.2-4.2l-1.2-0.7l0.2-0.7l0.6 0.2l-0.2-0.8l-0.8 0.3l-0.5-1.3l0.3-1.3l1.6 0.8l1.5-0.9l-1.7-2.1l-1.3 0.3l-0.2 1.6l-0.7-1.4l0.2-1.8l-2.2-0.9l-0.8-2.1l-1-0.5l2.2-0.3l-0.9-0.8l0.7-0.9h3.1l-0.7-0.5l0.6-2.3l-0.4-0.7h-3.8z"
                    fill="var(--color-surface-strong)"
                  />
                  <g clipPath="url(#camcode-map-clip)">
                    <path
                      d="M254.0 162.0 Q338.0 110.0 468.0 137.0"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'videos' ? 0.28 : 1}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '230' } as React.CSSProperties}
                    />
                    <path
                      d="M254.0 162.0 Q242.0 184.0 230.5 195.3"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'courses' ? 0.28 : 1}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '60' } as React.CSSProperties}
                    />
                    <path
                      d="M230.5 195.3 Q145.0 104.0 59.4 99.0"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'videos' ? 0.28 : 1}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '210' } as React.CSSProperties}
                    />
                    <path
                      d="M230.5 195.3 Q271.3 204.1 312.1 258.1"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'courses' ? 0.28 : 1}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '110' } as React.CSSProperties}
                    />
                    <path
                      d="M276.0 140.0 Q372.0 95.0 520.7 120.9"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'bilingual' ? 1 : 0.85}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '260' } as React.CSSProperties}
                    />
                    <path
                      d="M254.0 162.0 Q156.0 112.0 59.4 99.0"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity={coverageTab === 'bilingual' ? 1 : 0.85}
                      className="transition-opacity duration-300"
                      data-draw="true"
                      style={{ '--draw-length': '220' } as React.CSSProperties}
                    />
                  </g>
                  {[
                    { x: 254.0, y: 162.0, label: 'Phnom Penh', anchor: 'start' as const, dx: 9, dy: 4 },
                    { x: 230.5, y: 195.3, label: 'Singapore', anchor: 'middle' as const, dx: 0, dy: 19 },
                    { x: 276.0, y: 140.0, label: 'Tokyo', anchor: 'start' as const, dx: 9, dy: 3 },
                    { x: 312.1, y: 258.1, label: 'Sydney', anchor: 'middle' as const, dx: 0, dy: 19 },
                    { x: 59.4, y: 99.0, label: 'London', anchor: 'middle' as const, dx: 0, dy: -10 },
                    { x: 468.0, y: 137.0, label: 'San Francisco', anchor: 'end' as const, dx: -9, dy: 4 },
                    { x: 520.7, y: 120.9, label: 'New York', anchor: 'middle' as const, dx: 0, dy: -10 },
                  ].map((hub) => (
                    <g key={hub.label}>
                      <circle cx={hub.x} cy={hub.y} r="3.5" fill="var(--color-accent)" />
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="6.5"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeOpacity="0.3"
                        strokeWidth="1"
                      />
                      <text
                        x={hub.x + hub.dx}
                        y={hub.y + hub.dy}
                        textAnchor={hub.anchor}
                        className="text-[16px] md:text-[11.5px]"
                        fill="var(--color-body)"
                        fontFamily="var(--font-body)"
                        paintOrder="stroke"
                        stroke="var(--color-surface)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      >
                        {hub.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* 2-Column Live Category Counts */}
              <ul className="mt-4 grid gap-x-6 gap-y-2 border-t border-[#ded8ca] dark:border-[#2A332E] pt-4 sm:grid-cols-2">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex items-baseline justify-between gap-2">
                    <Link
                      to={`/courses?category=${cat.slug}`}
                      className="text-[13px] font-medium truncate text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] transition-colors"
                    >
                      {pickText(cat.name)}
                    </Link>
                    <span className="t-method shrink-0 tabular-nums">
                      {coverageTab === 'videos'
                        ? `${cat.videoCount} ${t.nav.videos}`
                        : coverageTab === 'bilingual'
                          ? 'EN + ខ្មែរ'
                          : `${cat.courseCount} · ${cat.videoCount}`}
                    </span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Top-Right (5 cols, row 1): Weekly Cadence Trace (Havenline Cold Chain Style) */}
            <article className="card-cell p-5 md:col-span-5 md:col-start-8 md:row-start-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-method text-[#141312] dark:text-[#f6f3ec]">
                    Weekly cadence
                  </p>
                  <AnimatedNumber
                    value={48000}
                    suffix="+"
                    className="t-number-md mt-2 block text-[#141312] dark:text-[#f6f3ec]"
                  />
                  <p className="mt-2 max-w-[18rem] text-[15px] leading-[1.5] text-[#4c4842] dark:text-[#A3ACA6]">
                    {pickText({
                      en: 'Consistent weekly lesson completions across EN & Khmer tracks.',
                      km: 'ការបញ្ចប់មេរៀនប្រចាំសប្តាហ៍ជាប់លាប់លើកម្មវិធីទាំងពីរភាសា។',
                    })}
                  </p>
                  <p className="t-method mt-2">
                    {pickText({ en: '14-week active learner trace', km: 'វឌ្ឍនភាពសិក្សា ១៤ សប្តាហ៍' })}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 shrink-0 text-[#1c5b48] dark:text-[#7CD4B5]" aria-hidden="true" />
              </div>
              <div className="mt-4">
                <svg viewBox="0 0 280 185" className="w-full" role="img" aria-label="14-week learner engagement trend chart">
                  <rect x="34" y="72" width="234" height="52" fill="var(--color-accent-soft)" rx="4" />
                  <line x1="34" y1="98" x2="268" y2="98" stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="3 4" />
                  <line x1="34" y1="26" x2="34" y2="150" stroke="var(--color-line)" strokeWidth="1" />
                  <line x1="34" y1="150" x2="268" y2="150" stroke="var(--color-line)" strokeWidth="1" />
                  <path
                    d="M34 108 L52 100 L70 105 L88 94 L106 99 L124 89 L142 93 L160 85 L178 90 L196 81 L214 86 L232 78 L250 82 L268 75"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    data-draw="true"
                    style={{ '--draw-length': '280' } as React.CSSProperties}
                  />
                  <text x="4" y="76" fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-body)">50k</text>
                  <text x="4" y="102" fontSize="11" fill="var(--color-body)" fontFamily="var(--font-body)">40k</text>
                  <text x="4" y="128" fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-body)">30k</text>
                  <text x="34" y="168" fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-body)">Week 1</text>
                  <text x="268" y="168" fontSize="11" textAnchor="end" fill="var(--color-muted)" fontFamily="var(--font-body)">Week 14</text>
                </svg>
              </div>
            </article>

            {/* Middle-Right (5 cols, row 2): Diagonal Textured Stone Workspace Card (Havenline ph-scene) */}
            <article className="relative overflow-hidden rounded-[var(--radius-md)] border border-[#ded8ca] dark:border-[#2A332E] md:col-span-5 md:col-start-8 md:row-start-2">
              <div
                role="img"
                aria-label="Camcode Learner Workspace synced across devices"
                className="ph-scene h-56 w-full md:h-full md:min-h-[200px]"
              >
                <span aria-hidden="true" className="ph-caption">
                  <ImageIcon className="size-3.5 shrink-0" />
                  <span className="truncate">Learner Workspace · Live</span>
                  <span className="ph-size">640 × 360</span>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgb(23_32_28/0.86))] p-4">
                <p className="text-[14px] font-medium text-[#f6f3ec]">
                  Workspace, Port 3001
                </p>
                <p className="mt-1 text-[13px] text-[rgb(255_255_255/0.84)]">
                  {pickText({
                    en: 'Synced course progress, assessments, and watchlists across devices.',
                    km: 'រក្សាទុកវឌ្ឍនភាពសិក្សា តេស្ត និងបញ្ជីវីដេអូដោយស្វ័យប្រវត្តិ។',
                  })}
                </p>
              </div>
            </article>

            {/* Bottom-Left (3 cols, row 3): Circular Ring Gauge */}
            <article className="card-cell p-5 md:col-span-3 md:col-start-1 md:row-start-3">
              <p className="t-method text-[#141312] dark:text-[#f6f3ec]">
                Completion
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative size-[84px] shrink-0">
                  <svg viewBox="0 0 160 160" className="size-full" role="img" aria-label="98.2 percent satisfaction">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-surface-strong)" strokeWidth="10" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="431.9 439.8"
                      transform="rotate(-90 80 80)"
                      data-draw="true"
                      style={{ '--draw-length': '432' } as React.CSSProperties}
                    />
                  </svg>
                </div>
                <div>
                  <AnimatedNumber
                    value={98.2}
                    suffix=" %"
                    className="t-number-md text-[#141312] dark:text-[#f6f3ec]"
                  />
                  <p className="t-method mt-1">2026 YTD, all tracks</p>
                </div>
              </div>
            </article>

            {/* Bottom-Center (4 cols, row 3): Verified Standards (Havenline Accredited Style) */}
            <article className="card-cell p-5 md:col-span-4 md:col-start-4 md:row-start-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-method text-[#141312] dark:text-[#f6f3ec]">
                    Verified
                  </p>
                  <p className="mt-1 text-[15px] text-[#4c4842] dark:text-[#A3ACA6]">
                    {pickText({
                      en: 'Built for structured credentials & transparent billing.',
                      km: 'វិញ្ញាបនបត្រផ្លូវការ និងការទូទាត់តម្លាភាព។',
                    })}
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-3 text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec]">
                <li className="flex items-center gap-2.5">
                  <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
                    <path d="M20 5 33 10v10c0 8-6 13-13 15-7-2-13-7-13-15V10z" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 20l4.5 4.5L27 16" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Certificates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
                    <circle cx="20" cy="20" r="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
                    <circle cx="20" cy="11" r="1.4" fill="var(--color-accent)" />
                    <circle cx="26.4" cy="13.6" r="1.4" fill="var(--color-accent)" />
                    <circle cx="29" cy="20" r="1.4" fill="var(--color-accent)" />
                    <circle cx="26.4" cy="26.4" r="1.4" fill="var(--color-accent)" />
                    <circle cx="20" cy="29" r="1.4" fill="var(--color-accent)" />
                    <circle cx="13.6" cy="26.4" r="1.4" fill="var(--color-accent)" />
                    <circle cx="11" cy="20" r="1.4" fill="var(--color-accent)" />
                    <circle cx="13.6" cy="13.6" r="1.4" fill="var(--color-accent)" />
                  </svg>
                  <span>EN / ខ្មែរ UI</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
                    <rect x="8" y="11" width="24" height="18" rx="3" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
                    <path d="M8 17h24" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" />
                    <path d="M14 23h6" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span>KHQR & Card</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
                    <path d="M20 5l3.6 2.6 4.4-.6 1.3 4.3 3.8 2.3-1.9 4 1.9 4-3.8 2.3-1.3 4.3-4.4-.6L20 30.2l-3.6-2.6-4.4.6-1.3-4.3L6.9 21.6l1.9-4-1.9-4 3.8-2.3 1.3-4.3 4.4.6z" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.5 17.5l3.3 3.3 6-6" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Webhook Safe</span>
                </li>
              </ul>
            </article>

            {/* Bottom-Right (5 cols, row 3): Pine Green CTA Card */}
            <article className="surface-accent flex flex-col justify-between rounded-[var(--radius-md)] p-5 md:col-span-5 md:col-start-8 md:row-start-3">
              <div>
                <h3 className="font-serif-display text-[24px] font-normal text-white">
                  {pickText({
                    en: 'Start a structured track',
                    km: 'ចាប់ផ្តើមមុខវិជ្ជាមានរចនាសម្ព័ន្ធ',
                  })}
                </h3>
                <p className="mt-2 max-w-[22rem] text-[15px] leading-[1.55] text-[rgb(255_255_255/0.86)]">
                  {pickText({
                    en: 'Enroll in an individual course or explore the streaming catalog.',
                    km: 'ចុះឈ្មោះរៀនវគ្គសិក្សា ឬទស្សនាបណ្ណាល័យវីដេអូភ្លាមៗ។',
                  })}
                </p>
              </div>
              <div className="mt-5">
                <Link
                  to="/courses"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6f3ec] px-6 text-[15px] font-semibold text-[#15463a] hover:bg-white active:translate-y-px transition-all"
                >
                  <span>{t.home.exploreCourses}</span>
                  <ArrowUpRight className="h-5 w-5 swiss-arrow-shift" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 5. PROCESS / WORKFLOW — Dark Charcoal-Pine Band (Havenline "Five steps, one owner") */}
      <section className="surface-photo relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono-tech inline-flex h-7 items-center gap-2 rounded-full border border-white/25 px-3.5 text-[10.5px] uppercase tracking-[0.12em] text-white">
              <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-[#efebe1]" />
              <span>How it runs</span>
            </span>
            <h2 className="text-h1 mt-5 text-white">
              {pickText({
                en: 'Four steps, one workspace',
                km: 'បួនជំហានក្នុងកម្មវិធីតែមួយ',
              })}
            </h2>
            <p className="mt-4 text-[17px] text-[#B7C0BA]">
              {pickText({
                en: 'A unified path from discovery and verified checkout to streaming and certification.',
                km: 'ដំណើរការច្បាស់លាស់ចាប់ពីការស្វែងរក ការបង់ប្រាក់រហូតដល់វិញ្ញាបនបត្រ។',
              })}
            </p>
          </div>

          {/* Desktop 4-Column Divided Grid with Ghost Numerals */}
          <div className="mt-16 hidden md:block">
            <ol className="grid grid-cols-4 divide-x divide-white/18">
              {workflowSteps.map((item, idx) => (
                <li
                  key={item.num}
                  data-reveal="true"
                  style={{ '--reveal-delay': `${idx * 80}ms` } as React.CSSProperties}
                  className="px-6 first:pl-0 last:pr-0"
                >
                  <span
                    aria-hidden="true"
                    className="t-ghost block"
                    style={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: 'clamp(64px, 6.2vw, 108px)' }}
                  >
                    {item.num}
                  </span>
                  <span className="mt-5 inline-flex items-center rounded-full border border-white/22 bg-white/12 px-3 py-1 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {item.step}
                  </span>
                  <h3 className="font-serif-display text-[22px] font-normal mt-4 text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#B7C0BA]">{item.desc}</p>
                  <p className="font-mono-tech text-[11.5px] mt-3 text-white">{item.meta}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile Vertical Divided List */}
          <ol className="mt-10 divide-y divide-white/18 border-t border-white/18 md:hidden">
            {workflowSteps.map((item) => (
              <li key={item.num} className="flex gap-4 py-5">
                <span
                  aria-hidden="true"
                  className="shrink-0 text-[44px] font-semibold leading-none tabular-nums text-white/28"
                >
                  {item.num}
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-[1.55] text-[#B7C0BA]">{item.desc}</p>
                  <p className="font-mono-tech text-[11px] mt-2 text-white/75">{item.meta}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. KPI METRICS STRIP — Pinned Horizontal Glide on Desktop ("The numbers we are judged on") */}
      <div ref={kpiPinSectionRef} className="surface-paper relative md:h-[165vh]">
        <section className="py-20 md:sticky md:top-0 md:min-h-screen md:flex md:flex-col md:justify-center md:py-16 overflow-hidden">
          <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
            <div className="grid gap-6 md:grid-cols-2 md:items-end">
              <h2 className="text-h1 max-w-xl text-[#141312] dark:text-[#f6f3ec]">
                {pickText({
                  en: 'The numbers we are judged on',
                  km: 'តួលេខសំខាន់ៗនៃប្រព័ន្ធសិក្សា',
                })}
              </h2>
              <div className="md:justify-self-end md:text-right">
                <p className="max-w-md text-[18px] leading-[1.6] text-[#6e6a62]">
                  {pickText({
                    en: 'Every figure reflects real catalog curricula, video sessions, and verified completions.',
                    km: 'តួលេខនីមួយៗឆ្លុះបញ្ចាំងពីវគ្គសិក្សា វីដេអូ និងការបញ្ចប់ការសិក្សាពិតប្រាកដ។',
                  })}
                </p>
                <Link
                  to="/about"
                  className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] hover:underline hover:text-[#1c5b48] mt-2"
                >
                  <span>{t.footer.about}</span>
                  <ArrowUpRight className="h-[18px] w-[18px] swiss-arrow-shift" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden md:mt-14">
            <span aria-hidden="true" className="fade-left hidden md:block" />
            <span aria-hidden="true" className="fade-right hidden md:block" />
            <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
              <div
                ref={kpiTrackRef}
                className="flex gap-4 overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:w-max will-change-transform"
              >
                {kpiShowcase.map((kpi) => {
                  const variantClass =
                    kpi.variant === 'accent'
                      ? 'surface-accent'
                      : kpi.variant === 'strong'
                        ? 'bg-[#e5dfd2] dark:bg-[#181E1B]'
                        : kpi.variant === 'canvas'
                          ? 'border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#101412]'
                          : 'bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E]';
                  return (
                    <article
                      key={kpi.label}
                      className={`flex w-[72vw] sm:w-[290px] shrink-0 flex-col justify-between rounded-2xl p-6 h-[240px] md:h-[260px] ${variantClass}`}
                    >
                      <p
                        className={`text-[15px] font-medium ${
                          kpi.variant === 'accent' ? 'text-white/85' : 'text-[#141312] dark:text-[#f6f3ec]'
                        }`}
                      >
                        {kpi.label}
                      </p>
                      <div>
                        {kpi.numValue !== null ? (
                          <AnimatedNumber
                            value={kpi.numValue}
                            suffix={kpi.suffix}
                            smallSuffix={kpi.smallSuffix}
                            inverse={kpi.variant === 'accent'}
                            className={`t-number-xl block ${
                              kpi.variant === 'accent' ? 'text-white' : 'text-[#141312] dark:text-[#f6f3ec]'
                            }`}
                          />
                        ) : (
                          <span className="t-number-xl block text-[#141312] dark:text-[#f6f3ec]">
                            {kpi.value}
                            {kpi.unit && (
                              <span className="ml-1.5 text-[0.38em] font-medium tracking-normal">
                                {kpi.unit}
                              </span>
                            )}
                          </span>
                        )}
                        <p
                          className={`font-mono-tech text-[11px] mt-2 ${
                            kpi.variant === 'accent' ? 'text-white/75' : 'text-[#6e6a62]'
                          }`}
                        >
                          {kpi.sub}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 7. FEATURED COURSES & POPULAR VIDEOS */}
      <section className="surface-dots py-20 md:py-24 border-y border-[#ded8ca] dark:border-[#2A332E]">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 space-y-16">
          {/* Featured Courses */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#ded8ca] dark:border-[#2A332E] mb-8">
              <div className="space-y-2">
                <span className="swiss-eyebrow">
                  <span className="swiss-dot" aria-hidden="true" />
                  <span>CURRICULA</span>
                </span>
                <h2 className="text-h1 text-[#141312] dark:text-[#f6f3ec]">
                  {t.home.featuredCoursesTitle}
                </h2>
                <p className="text-body text-[#6e6a62]">{t.home.featuredCoursesSub}</p>
              </div>
              <Link
                to="/courses"
                className="swiss-link group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48] shrink-0 transition-colors"
              >
                <span>{t.common.viewAll}</span>
                <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : featuredCourses.length > 0 && (
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label={t.home.featuredCoursesTitle}
              >
                <div className="overflow-hidden py-2 -my-2">
                  <div
                    ref={featuredTrackRef}
                    className="flex items-stretch gap-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                    style={{ transform: `translate3d(${-featuredTrackOffset}px, 0, 0)` }}
                  >
                    {featuredCourses.map((course, idx) => {
                      const isActive = idx === featuredCourseIdx;
                      const inst = catalogService.getInstructorById(course.instructorId);
                      const cat = categories.find((c) => c.slug === course.categorySlug);
                      const diffLabel =
                        course.difficulty === 'beginner'
                          ? t.common.beginner
                          : course.difficulty === 'intermediate'
                            ? t.common.intermediate
                            : t.common.advanced;
                      const langLabel =
                        course.language === 'bilingual'
                          ? t.common.bilingual
                          : course.language === 'km'
                            ? t.common.khmer
                            : t.common.english;

                      return (
                        <article
                          key={course.id}
                          onClick={() => {
                            if (!isActive) setFeaturedCourseIdx(idx);
                          }}
                          className={`shrink-0 w-full md:w-[680px] lg:w-[740px] grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[22px] border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                              ? 'opacity-100 shadow-[0_18px_42px_-24px_rgba(23,28,25,0.14)]'
                              : 'opacity-45 scale-[0.97] hover:opacity-75 cursor-pointer'
                          }`}
                        >
                          {/* Left Panel: Serif Title + Spec Table + Pine CTA */}
                          <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
                            <div>
                              <h3 className="font-serif-display text-[24px] md:text-[27px] font-normal leading-[1.15] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] pb-4 border-b border-[#ded8ca] dark:border-[#2A332E]">
                                {pickText(course.title)}
                              </h3>

                              <dl className="mt-4 space-y-2.5 text-[13.5px]">
                                <div className="flex items-center justify-between gap-4">
                                  <dt className="text-[#6e6a62] dark:text-[#A3ACA6] shrink-0">
                                    {t.nav.categories}
                                  </dt>
                                  <dd className="font-medium text-right text-[#141312] dark:text-[#f6f3ec] truncate">
                                    {cat ? pickText(cat.name) : course.thumbnailLabel}
                                  </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <dt className="text-[#6e6a62] dark:text-[#A3ACA6] shrink-0">
                                    {t.nav.trainers}
                                  </dt>
                                  <dd className="font-medium text-right text-[#141312] dark:text-[#f6f3ec] truncate">
                                    {inst?.name ?? 'Camcode'} · {langLabel}
                                  </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <dt className="text-[#6e6a62] dark:text-[#A3ACA6] shrink-0">
                                    {t.marketplace.lessonLabel}
                                  </dt>
                                  <dd className="font-medium text-right text-[#141312] dark:text-[#f6f3ec] tabular-nums">
                                    {formatNumber(course.lessonsCount)} {t.marketplace.lessonLabel} ·{' '}
                                    {formatNumber(course.durationHours)} {t.common.hours}
                                  </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <dt className="text-[#6e6a62] dark:text-[#A3ACA6] shrink-0">
                                    {t.common.price}
                                  </dt>
                                  <dd className="font-medium text-right text-[#141312] dark:text-[#f6f3ec] tabular-nums">
                                    {course.price === 0
                                      ? t.common.free
                                      : `$${course.price % 1 === 0 ? course.price.toFixed(0) : course.price.toFixed(2)}`}{' '}
                                    · ★ {course.rating.toFixed(1)}
                                  </dd>
                                </div>
                              </dl>
                            </div>

                            <div>
                              <Link
                                to={`/courses/${course.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#1c5b48] dark:bg-[#2D7A62] px-6 text-[13.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#15463a] dark:hover:bg-[#23634F]"
                              >
                                <span>{t.marketplace.startCourseAction}</span>
                                <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
                              </Link>
                            </div>
                          </div>

                          {/* Right Panel: Diagonal Textured Stone Visual Pane */}
                          <div
                            className="relative min-h-[220px] md:min-h-[340px] bg-[#E5E0D5] dark:bg-[#19201C] border-t md:border-t-0 md:border-l border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-center p-6 overflow-hidden"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(135deg, rgba(23,28,25,0.03) 0px, rgba(23,28,25,0.03) 1px, transparent 1px, transparent 18px)',
                            }}
                          >
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -right-14 -bottom-14 size-44 rounded-full border border-[#1c5b48]/15 dark:border-[#7CD4B5]/15"
                            />
                            <div className="relative inline-flex items-center gap-2 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec]/92 dark:bg-[#151A17]/92 px-3.5 py-2 text-[12px] font-medium text-[#4c4842] dark:text-[#D5D1C8] shadow-xs backdrop-blur-xs">
                              <span className="text-[#1c5b48] dark:text-[#7CD4B5]">
                                {cat?.icon && categoryIcons[cat.icon] ? (
                                  categoryIcons[cat.icon]
                                ) : (
                                  <BookOpen className="h-4 w-4" />
                                )}
                              </span>
                              <span>
                                {cat ? pickText(cat.name) : course.thumbnailLabel} · {diffLabel}
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Divider + Slide Counter & Next/Prev Controls */}
                <div className="mt-7 pt-5 border-t border-[#ded8ca] dark:border-[#2A332E] flex items-center justify-between gap-4">
                  <span className="font-mono-tech text-[12.5px] text-[#6e6a62] tabular-nums">
                    {featuredCourseIdx + 1} of {featuredCourses.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={t.common.previous}
                      onClick={() =>
                        setFeaturedCourseIdx(
                          (i) => (i - 1 + featuredCourses.length) % featuredCourses.length,
                        )
                      }
                      className="grid size-10 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] dark:hover:border-[#7CD4B5] cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={t.common.next}
                      onClick={() =>
                        setFeaturedCourseIdx((i) => (i + 1) % featuredCourses.length)
                      }
                      className="grid size-10 place-items-center rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#f6f3ec] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] dark:hover:border-[#7CD4B5] cursor-pointer transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Popular Videos */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#ded8ca] dark:border-[#2A332E] mb-8">
              <div className="space-y-2">
                <span className="swiss-eyebrow">
                  <span className="swiss-dot" aria-hidden="true" />
                  <span>STREAMING</span>
                </span>
                <h2 className="text-h1 text-[#141312] dark:text-[#f6f3ec]">
                  {t.home.popularVideosTitle}
                </h2>
                <p className="text-body text-[#6e6a62]">{t.home.popularVideosSub}</p>
              </div>
              <Link
                to="/videos"
                className="swiss-link group inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#141312] dark:text-[#f6f3ec] hover:text-[#1c5b48] shrink-0 transition-colors"
              >
                <span>{t.common.viewAll}</span>
                <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
              </Link>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pt-1.5 pb-3 md:pt-0 md:pb-0 no-scrollbar snap-x">
              {popularVideos.map((video) => (
                <div key={video.id} className="min-w-[280px] sm:min-w-[310px] md:min-w-0 snap-start">
                  <VideoCard video={video} className="h-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FEATURED TESTIMONIAL CAROUSEL (Havenline Deep Pine Green + Arched Monogram) */}
      {activeTestimonial && (
        <section className="surface-paper py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
            <div
              data-reveal="true"
              role="group"
              aria-roledescription="carousel"
              aria-label="Learner quotes"
              className="surface-accent grid gap-8 rounded-[24px] p-6 md:grid-cols-[340px_1fr] md:items-stretch md:gap-12 md:p-10"
            >
              <div className="mx-auto w-[96px] h-[96px] overflow-hidden rounded-full bg-[#e5dfd2] text-[#1c5b48] md:mx-0 md:h-[420px] md:w-[340px] md:rounded-b-[16px] md:rounded-t-[170px]">
                <div
                  ref={portraitParallaxRef}
                  className="h-full w-full flex flex-col items-center justify-center will-change-transform"
                >
                  <span className="font-serif-display text-[36px] md:text-[72px] font-normal leading-none">
                    {activeTestimonial.initials}
                  </span>
                  <span className="hidden md:block font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[#6e6a62] mt-2">
                    VERIFIED LEARNER
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <blockquote>
                  <p className="font-serif-display text-[clamp(22px,2.5vw,38px)] leading-[1.2] text-white">
                    “{pickText(activeTestimonial.quote)}”
                  </p>
                  <footer className="mt-7">
                    <p className="text-[17px] font-semibold text-white">
                      {activeTestimonial.name}
                    </p>
                    <p className="mt-1 text-[15px] text-white/78">
                      {pickText(activeTestimonial.persona)}
                    </p>
                  </footer>
                </blockquote>

                {testimonials.length > 1 && (
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/22 pt-5 md:justify-end md:gap-5">
                    <span className="font-mono-tech text-[12px] text-white" aria-hidden="true">
                      {testimonialIdx + 1} of {testimonials.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={t.common.previous}
                        onClick={() =>
                          setTestimonialIdx(
                            (i) => (i - 1 + testimonials.length) % testimonials.length,
                          )
                        }
                        className="grid size-11 place-items-center rounded-full border border-white/45 text-white hover:border-white hover:bg-white/12 cursor-pointer transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label={t.common.next}
                        onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
                        className="grid size-11 place-items-center rounded-full border border-white/45 text-white hover:border-white hover:bg-white/12 cursor-pointer transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 9. MEMBERSHIP BASIS — Horizontal Stacked Plan Rows (Havenline "Two ways to buy freight") */}
      <section className="surface-lanes py-20 md:py-28 border-t border-[#ded8ca] dark:border-[#2A332E]">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span
                data-reveal="true"
                className="t-eyebrow inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-line dark:border-[#2A332E] bg-canvas dark:bg-[#151A17] text-body dark:text-[#D5D1C8]"
              >
                <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-accent" />
                <span>Membership basis</span>
              </span>
              <h2 data-reveal="true" className="text-h1 mt-5 text-[#141312] dark:text-[#f6f3ec]">
                {t.home.pricingPreviewTitle}
              </h2>
              <p data-reveal="true" className="mt-4 text-[18px] leading-[1.6] text-[#4c4842] dark:text-[#A3ACA6]">
                {t.home.pricingPreviewSub}
              </p>
            </div>

            {/* Havenline Switch Control (Monthly <-> Yearly) */}
            <div data-reveal="true" className="w-full md:w-auto">
              <div className="inline-flex items-center gap-4">
                <span
                  className={`text-[15px] ${
                    homeBilling === 'monthly'
                      ? 'font-semibold text-[#141312] dark:text-[#f6f3ec]'
                      : 'font-normal text-[#6e6a62]'
                  }`}
                >
                  {t.pricing.monthly}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={homeBilling === 'yearly'}
                  aria-label="Toggle billing cycle"
                  onClick={() =>
                    setHomeBilling((b) => (b === 'monthly' ? 'yearly' : 'monthly'))
                  }
                  className="relative h-[30px] w-14 shrink-0 rounded-full bg-[#e5dfd2] dark:bg-[#2A332E] transition-colors duration-300 cursor-pointer"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-[3px] top-1/2 -mt-3 size-6 rounded-full bg-[#f6f3ec] shadow-[0_1px_2px_rgba(20,19,18,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform:
                        homeBilling === 'yearly' ? 'translateX(26px)' : 'translateX(0px)',
                    }}
                  />
                </button>
                <span
                  className={`text-[15px] ${
                    homeBilling === 'yearly'
                      ? 'font-semibold text-[#141312] dark:text-[#f6f3ec]'
                      : 'font-normal text-[#6e6a62]'
                  }`}
                >
                  {t.pricing.yearly} · {t.pricing.saveYearly}
                </span>
              </div>
            </div>
          </div>

          {/* Stacked Horizontal Plan Rows */}
          <div className="mt-12 grid gap-4 md:mt-14">
            {plans.map((plan, idx) => {
              const displayPrice =
                homeBilling === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              return (
                <article
                  key={plan.id}
                  data-reveal="true"
                  style={{ '--reveal-delay': `${idx * 70}ms` } as React.CSSProperties}
                  className={`grid items-center gap-6 rounded-[var(--radius-lg)] bg-[#f6f3ec] dark:bg-[#151A17] p-6 md:grid-cols-[1.05fr_1.3fr_auto] md:gap-10 md:p-8 border transition-colors duration-200 ${
                    plan.highlighted
                      ? 'border-[#1c5b48] dark:border-[#2D7A62]'
                      : 'border-[#ded8ca] dark:border-[#2A332E] hover:border-[#c2baa8]'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Geometric Line-Art Plan Icon */}
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      {idx === 0 ? (
                        <>
                          <path
                            d="M12 22 32 12l20 10v20L32 52 12 42z"
                            fill="none"
                            stroke="var(--color-line-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22l20 10 20-10M32 32v20"
                            fill="none"
                            stroke="var(--color-line-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </>
                      ) : idx === 1 ? (
                        <>
                          <path
                            d="M10 40 32 30l22 10-22 10z"
                            fill="none"
                            stroke="var(--color-line-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 30 32 20l22 10"
                            fill="none"
                            stroke="var(--color-line-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 20 32 10l22 10"
                            fill="none"
                            stroke="var(--color-line-strong)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </>
                      ) : (
                        <>
                          <line x1="14" y1="16" x2="32" y2="32" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="48" y1="13" x2="32" y2="32" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="32" y1="32" x2="12" y2="46" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="32" y1="32" x2="50" y2="44" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="12" y1="46" x2="33" y2="54" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="50" y1="44" x2="33" y2="54" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="14" y1="16" x2="12" y2="46" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="48" y1="13" x2="50" y2="44" fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="14" cy="16" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                          <circle cx="48" cy="13" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                          <circle cx="32" cy="32" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                          <circle cx="12" cy="46" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                          <circle cx="50" cy="44" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                          <circle cx="33" cy="54" r="3" fill="var(--color-canvas)" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                        </>
                      )}
                    </svg>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-serif-display text-[23px] font-normal text-[#141312] dark:text-[#f6f3ec]">
                          {pickText(plan.name)}
                        </h3>
                        {plan.highlighted && (
                          <span className="inline-flex items-center rounded-full bg-[#e4ede7] dark:bg-[#1B3028] px-3 py-1 font-mono-tech text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1c5b48] dark:text-[#7CD4B5]">
                            {t.pricing.mostPopular}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 min-h-[56px]">
                        <p className="text-[19px] font-semibold tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                          {displayPrice === 0 ? t.common.free : `$${displayPrice.toFixed(2)}`}
                          {displayPrice > 0 && (
                            <span className="text-[14px] font-normal text-[#6e6a62] ml-1">
                              / {homeBilling === 'monthly'
                                ? t.pricing.perMonth.replace(/^\//, '').trim()
                                : t.pricing.perYear.replace(/^\//, '').trim()}
                            </span>
                          )}
                        </p>
                        <p className="t-method mt-1">
                          {pickText(plan.tagline)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {plan.features.slice(0, 4).map((f, fIdx) => (
                      <li
                        key={fIdx}
                        className={`flex items-start gap-2 text-[15px] leading-[1.5] ${
                          f.included ? 'text-[#4c4842] dark:text-[#D5D1C8]' : 'text-[#6e6a62]/45 line-through'
                        }`}
                      >
                        <Check
                          className={`mt-1 h-4 w-4 shrink-0 ${
                            f.included
                              ? 'text-[#1c5b48] dark:text-[#7CD4B5]'
                              : 'text-[#ded8ca]'
                          }`}
                        />
                        <span>{pickText(f.label)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="md:justify-self-end">
                    {plan.tier === 'free' ? (
                      <a
                        href={`${API_CONFIG.userAppUrl}/register`}
                        className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-200 px-6 w-full md:w-auto whitespace-nowrap border border-[#c2baa8] dark:border-[#2A332E] bg-transparent text-[#141312] dark:text-[#f6f3ec] hover:border-[#141312] hover:bg-[#efebe1] dark:hover:bg-[#181E1B]"
                      >
                        <span>{t.pricing.getStartedFree}</span>
                        <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
                      </a>
                    ) : (
                      <Link
                        to={`/checkout?type=subscription&plan=${plan.tier}&billing=${homeBilling}`}
                        className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition-all duration-200 px-6 w-full md:w-auto whitespace-nowrap ${
                          plan.highlighted
                            ? 'bg-[#1c5b48] text-white hover:bg-[#15463a] dark:bg-[#2D7A62] dark:hover:bg-[#23634F] active:translate-y-px'
                            : 'border border-[#c2baa8] dark:border-[#2A332E] bg-transparent text-[#141312] dark:text-[#f6f3ec] hover:border-[#141312] hover:bg-[#efebe1] dark:hover:bg-[#181E1B]'
                        }`}
                      >
                        <span>{t.pricing.subscribeNow}</span>
                        <ArrowUpRight className="h-4 w-4 swiss-arrow-shift" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. QUESTIONS ACCORDION (Havenline "The six we are asked most") */}
      {faqs.length > 0 && (
        <section className="surface-paper py-16 md:py-24">
          <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
            <div className="surface-dots rounded-[24px] border border-[#ded8ca] dark:border-[#2A332E] p-6 md:p-12">
              <div className="max-w-2xl">
                <span className="t-eyebrow inline-flex h-7 items-center gap-2 rounded-full px-3.5 border border-line dark:border-[#2A332E] bg-canvas dark:bg-[#151A17] text-body dark:text-[#D5D1C8]">
                  <span aria-hidden="true" className="size-[5px] rounded-[1px] bg-accent" />
                  <span>Questions</span>
                </span>
                <h2 className="text-h1 mt-5 text-[#141312] dark:text-[#f6f3ec]">
                  {t.pricing.faqTitle}
                </h2>
              </div>

              <div className="mt-10 grid gap-x-8 md:grid-cols-2">
                {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map(
                  (col, colIdx) => (
                    <div
                      key={colIdx}
                      className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border-t border-[#ded8ca] dark:border-[#2A332E]"
                    >
                      {col.map((faq, itemIdx) => {
                        const globalIdx =
                          colIdx === 0 ? itemIdx : Math.ceil(faqs.length / 2) + itemIdx;
                        const isOpen = openFaqId === faq.id;
                        return (
                          <div key={faq.id}>
                            <h3 className="m-0">
                              <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                className="flex w-full items-start justify-between gap-5 px-0 py-5 text-left text-[17px] font-semibold text-[#141312] dark:text-[#f6f3ec] transition-colors hover:text-[#1c5b48] dark:hover:text-[#7CD4B5] cursor-pointer md:px-1"
                              >
                                <span className="flex items-start gap-4">
                                  <span aria-hidden="true" className="index-number mt-1.5">
                                    {String(globalIdx + 1).padStart(2, '0')}
                                  </span>
                                  <span>{pickText(faq.question)}</span>
                                </span>
                                <Plus
                                  className={`mt-0.5 h-5 w-5 shrink-0 text-[#141312] dark:text-[#f6f3ec] transition-transform duration-300 ${
                                    isOpen ? 'rotate-45' : ''
                                  }`}
                                />
                              </button>
                            </h3>
                            {isOpen && (
                              <div className="pb-6 text-[15.5px] leading-[1.65] text-[#6e6a62] md:pl-10 md:pr-10">
                                {pickText(faq.answer)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ),
                )}
              </div>

              <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#ded8ca] dark:border-[#2A332E] pt-6 text-[15px] text-[#6e6a62]">
                <span>
                  {pickText({
                    en: 'Not your question? Our learner desk replies within one business day.',
                    km: 'មានសំណួរផ្សេងទៀត? ក្រុមជំនួយសិស្សនឹងឆ្លើយតបក្នុង ១ ថ្ងៃធ្វើការ។',
                  })}
                </span>
                <Link
                  to="/contact"
                  className="font-mono-tech inline-flex items-center gap-2 text-[13px] font-semibold text-[#141312] dark:text-[#f6f3ec] underline-offset-[6px] hover:text-[#1c5b48] hover:underline"
                >
                  <Phone className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  <span>+855 23 900 123</span>
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 11. BOTTOM DEEP FOREST GREEN CTA BANNER WITH CONSTELLATION SVG */}
      <section className="surface-paper pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
          <div data-reveal="true" className="surface-accent relative overflow-hidden rounded-[24px] px-6 py-10 md:px-12 md:py-14">
            <div
              ref={constellationRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.22] md:bottom-[-40px] md:left-auto md:right-[-40px] md:top-[-40px] md:w-[500px] md:opacity-90 will-change-transform"
            >
              <svg viewBox="0 0 620 390" className="h-full w-full">
                <g transform="rotate(-8 310 195)" stroke="#efebe1">
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
                  <line x1="318" y1="96" x2="392" y2="150" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="342" y1="220" x2="392" y2="150" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="392" y1="150" x2="478" y2="132" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="478" y1="132" x2="524" y2="200" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="512" y1="46" x2="566" y2="110" strokeWidth="1" strokeOpacity="0.3" />
                  {[
                    [40, 96, 5],
                    [108, 48, 8],
                    [126, 158, 6],
                    [188, 104, 10],
                    [206, 226, 4.5],
                    [252, 42, 5.5],
                    [268, 164, 7],
                    [318, 96, 6.5],
                    [342, 220, 8.5],
                    [392, 150, 9.5],
                    [478, 132, 6],
                    [524, 200, 8],
                    [566, 110, 6.5],
                  ].map(([cx, cy, r], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="#efebe1"
                      fillOpacity={i % 2 === 0 ? 0.32 : 0.5}
                      stroke="#efebe1"
                      strokeOpacity="0.55"
                      strokeWidth="1"
                    />
                  ))}
                </g>
              </svg>
            </div>

            <div className="relative max-w-xl md:w-[54%]">
              <h2 className="text-h1 text-white">
                {pickText({
                  en: 'Start one track. Build real momentum.',
                  km: 'ចាប់ផ្តើមមុខវិជ្ជាមួយ។ កសាងសមត្ថភាពពិតប្រាកដ។',
                })}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.6] text-white/85">
                {t.home.heroDesc}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  to="/courses"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f6f3ec] px-6 text-[15px] font-semibold text-[#1c5b48] hover:bg-white transition-colors w-full sm:w-auto"
                >
                  <span>{t.home.exploreCourses}</span>
                  <ArrowUpRight className="h-5 w-5 swiss-arrow-shift" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 px-6 text-[15px] font-semibold text-white hover:border-white hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  <span>{t.videos.viewPlans}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
