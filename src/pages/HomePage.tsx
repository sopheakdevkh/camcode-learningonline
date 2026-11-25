import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  Film,
  Globe,
  Layers,
  Megaphone,
  Palette,
  PlayCircle,
  Quote,
  Sparkles,
  Star,
} from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { VideoCard } from '@/components/cards/VideoCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import { pricingService } from '@/services/pricingService';
import type { Category, Course, SubscriptionPlan, Testimonial, VideoItem } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="h-5 w-5" />,
  Code2: <Code2 className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  Briefcase: <Briefcase className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Film: <Film className="h-5 w-5" />,
};

export const HomePage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularVideos, setPopularVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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
      setTestimonials(tests);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const benefits = [
    {
      icon: <Award className="h-5 w-5 text-[#2563EB]" />,
      title: t.home.benefit1Title,
      desc: t.home.benefit1Desc,
    },
    {
      icon: <PlayCircle className="h-5 w-5 text-[#0891B2]" />,
      title: t.home.benefit2Title,
      desc: t.home.benefit2Desc,
    },
    {
      icon: <Layers className="h-5 w-5 text-[#16A34A]" />,
      title: t.home.benefit3Title,
      desc: t.home.benefit3Desc,
    },
    {
      icon: <Globe className="h-5 w-5 text-[#D97706]" />,
      title: t.home.benefit4Title,
      desc: t.home.benefit4Desc,
    },
  ];

  return (
    <div>
      {/* Original PUB-01 Two-Column Hero Section over Marklet Background */}
      <section>
        <div className="container-page py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf2f0] border border-white/80 text-[13px] font-medium text-[#536b65]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.home.badge}</span>
            </div>

            <h1 className="text-display text-[#0F172A]">{t.home.heroTitle}</h1>

            <p className="text-body text-[#64748B] max-w-xl">{t.home.heroDesc}</p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link to="/courses" className="w-full sm:w-auto">
                <Button size="lg" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {t.home.exploreCourses}
                </Button>
              </Link>
              <Link to="/videos" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  leftIcon={<PlayCircle className="h-4 w-4 text-[#2563EB]" />}
                >
                  {t.home.exploreVideos}
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-[#64748B]">
              <span>{t.home.statsLearners}</span>
              <span>·</span>
              <span>{t.home.statsCourses}</span>
              <span>·</span>
              <span>{t.home.statsVideos}</span>
            </div>
          </div>

          {/* Original SaaS Preview Card with Marklet Frosted Glass Panel */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-[20px] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#0F172A]">
                  {t.brand.name} · EN / ខ្មែរ
                </span>
                <Badge tone="success">Live Access</Badge>
              </div>

              <div className="bg-white/90 rounded-[12px] border border-[#E2E8F0] p-4 space-y-3">
                <div className="flex items-center justify-between text-[12px] text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#2563EB]">
                    <BookOpen className="h-3.5 w-3.5" />
                    {t.nav.courses}
                  </span>
                  <span>12 {t.common.hours}</span>
                </div>
                <p className="text-[15px] font-semibold text-[#0F172A]">
                  {pickText({
                    en: 'Complete Digital Marketing Course',
                    km: 'វគ្គសិក្សា Digital Marketing ពេញលេញ',
                  })}
                </p>
                <div className="h-2 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full w-2/3 bg-[#2563EB] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#64748B]">
                  <span>John Instructor</span>
                  <span className="font-semibold text-[#0F172A]">$29.00</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/90 rounded-[12px] border border-[#E2E8F0] p-3.5">
                  <div className="flex items-center gap-2 text-[#0891B2] text-[12px] font-medium mb-1">
                    <PlayCircle className="h-4 w-4" />
                    <span>{t.nav.videos}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">450+ Sessions</p>
                  <p className="text-[12px] text-[#64748B]">Free & Membership</p>
                </div>
                <div className="bg-white/90 rounded-[12px] border border-[#E2E8F0] p-3.5">
                  <div className="flex items-center gap-2 text-[#16A34A] text-[12px] font-medium mb-1">
                    <Award className="h-4 w-4" />
                    <span>Certificates</span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">Verified Skills</p>
                  <p className="text-[12px] text-[#64748B]">EN + Khmer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-h2 text-[#0F172A]">{t.home.featuredCoursesTitle}</h2>
            <p className="text-body text-[#64748B] mt-1">{t.home.featuredCoursesSub}</p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto pb-2 md:pb-0 no-scrollbar snap-x">
            {featuredCourses.map((course) => (
              <div key={course.id} className="min-w-[285px] sm:min-w-[320px] md:min-w-0 snap-start">
                <CourseCard course={course} className="h-full" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popular Videos */}
      <section>
        <div className="container-page py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-h2 text-[#0F172A]">{t.home.popularVideosTitle}</h2>
              <p className="text-body text-[#64748B] mt-1">{t.home.popularVideosSub}</p>
            </div>
            <Link
              to="/videos"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2563EB] hover:text-[#1D4ED8]"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto pb-2 md:pb-0 no-scrollbar snap-x">
            {popularVideos.map((video) => (
              <div key={video.id} className="min-w-[280px] sm:min-w-[310px] md:min-w-0 snap-start">
                <VideoCard video={video} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="container-page py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-h2 text-[#0F172A]">{t.home.categoriesTitle}</h2>
            <p className="text-body text-[#64748B] mt-1">{t.home.categoriesSub}</p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            <span>{t.common.viewAll}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.slug}`}
              className="group glass-card rounded-[16px] p-4 sm:p-5 flex flex-col justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 rounded-[8px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  {categoryIcons[cat.icon] ?? <BookOpen className="h-5 w-5" />}
                </span>
                <div>
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {pickText(cat.name)}
                  </h3>
                  <p className="hidden sm:block text-[13px] text-[#64748B] mt-1">
                    {pickText(cat.description)}
                  </p>
                </div>
              </div>
              <div className="text-[12px] font-medium text-[#64748B]">
                {cat.courseCount} {t.nav.courses} · {cat.videoCount} {t.nav.videos}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us / Membership Benefits */}
      <section>
        <div className="container-page py-12 md:py-16">
          <div className="max-w-2xl mb-8">
            <h2 className="text-h2 text-[#0F172A]">{t.home.benefitsTitle}</h2>
            <p className="text-body text-[#64748B] mt-1">{t.home.benefitsSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="glass-card rounded-[16px] p-5 space-y-2.5"
              >
                <div className="h-10 w-10 rounded-[8px] bg-white border border-[#E2E8F0] flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="text-[16px] font-semibold text-[#0F172A]">{b.title}</h3>
                <p className="text-[14px] text-[#64748B] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview (sourced dynamically from pricingService) */}
      <section className="container-page py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-h2 text-[#0F172A]">{t.home.pricingPreviewTitle}</h2>
          <p className="text-body text-[#64748B] mt-2">{t.home.pricingPreviewSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card rounded-[16px] p-6 flex flex-col justify-between ${
                plan.highlighted
                  ? 'ring-2 ring-[#2563EB]/25'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-[19px] font-semibold text-[#0F172A]">
                    {pickText(plan.name)}
                  </h3>
                  {plan.highlighted && <Badge tone="primary">{t.pricing.mostPopular}</Badge>}
                </div>
                <p className="text-[14px] text-[#64748B] mb-5">{pickText(plan.tagline)}</p>

                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-[32px] font-bold text-[#0F172A]">
                    ${plan.monthlyPrice.toFixed(2)}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-[14px] text-[#64748B]">{t.pricing.perMonth}</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.slice(0, 4).map((f, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2.5 text-[14px] ${
                        f.included ? 'text-[#0F172A]' : 'text-[#94A3B8] line-through'
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          f.included ? 'text-[#16A34A]' : 'text-[#CBD5E1]'
                        }`}
                      />
                      <span>{pickText(f.label)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={
                  plan.tier === 'free'
                    ? '/register'
                    : `/checkout?type=subscription&plan=${plan.tier}&billing=monthly`
                }
              >
                <Button variant={plan.highlighted ? 'primary' : 'outline'} fullWidth>
                  {plan.tier === 'free' ? t.pricing.getStartedFree : t.pricing.subscribeNow}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#2563EB] hover:text-[#1D4ED8]"
          >
            <span>{t.home.viewFullComparison}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="container-page py-12 md:py-16">
          <div className="max-w-2xl mb-8">
            <h2 className="text-h2 text-[#0F172A]">{t.home.testimonialsTitle}</h2>
            <p className="text-body text-[#64748B] mt-1">{t.home.testimonialsSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-[16px] p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <Quote className="h-5 w-5 text-[#2563EB] mb-3" />
                  <p className="text-[15px] text-[#0F172A] leading-relaxed">
                    “{pickText(item.quote)}”
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-[#2563EB] text-white text-[13px] font-semibold flex items-center justify-center">
                      {item.initials}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#0F172A]">{item.name}</p>
                      <p className="text-[12px] text-[#64748B]">{pickText(item.persona)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#D97706]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-[12px] font-semibold">{item.rating}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
