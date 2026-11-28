import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  Lock,
  Play,
  PlayCircle,
  Smartphone,
  Star,
  Users,
} from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
import { catalogService } from '@/services/catalogService';
import type { Course } from '@/types';

const REVIEWS_PER_PAGE = 2;

export const CourseDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { t, pickText, formatNumber } = useI18n();
  const { isAuthenticated, hasCourseAccess, enrollFreeCourse } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setReviewPage(1);
    catalogService.getCourseBySlug(slug).then((data) => {
      if (!active) return;
      setCourse(data);
      if (data && data.curriculum.length > 0) {
        setExpandedSections({ [data.curriculum[0].id]: true });
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="surface-mist min-h-screen">
        <div className="container-page pt-[124px] pb-14 md:pt-[140px] space-y-6">
          <Skeleton className="h-6 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="surface-mist min-h-screen">
        <div className="container-page pt-[140px] pb-16 text-center space-y-4">
          <h1 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">{t.common.noResults}</h1>
          <Link to="/courses">
            <Button variant="outline">{t.common.back}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructor = catalogService.getInstructorById(course.instructorId);
  const category = catalogService.getCategoryBySlug(course.categorySlug);
  const access = hasCourseAccess(course);

  const totalReviewPages = Math.max(1, Math.ceil(course.reviews.length / REVIEWS_PER_PAGE));
  const paginatedReviews = course.reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllSections = (open: boolean) => {
    const next: Record<string, boolean> = {};
    course.curriculum.forEach((sec) => {
      next[sec.id] = open;
    });
    setExpandedSections(next);
  };

  // CTA logic covering all 5 states from PUB-03 spec
  const getCtaConfig = () => {
    if (access === 'purchased' || access === 'subscription' || access === 'free_enrolled') {
      return {
        label: t.courseDetail.startLearning,
        onClick: () => setLearningModalOpen(true),
        tone: 'success' as const,
        note:
          access === 'subscription'
            ? t.courseDetail.includedWithPlan
            : access === 'free_enrolled'
              ? t.courseDetail.freeAccessInfo
              : t.courseDetail.oneTimePurchase,
      };
    }
    if (course.price === 0) {
      return {
        label: t.courseDetail.enrollFree,
        onClick: () => {
          if (!isAuthenticated) {
            navigate('/login', { state: { from: `/courses/${course.slug}` } });
            return;
          }
          enrollFreeCourse(course.id);
          setLearningModalOpen(true);
        },
        tone: 'primary' as const,
        note: t.courseDetail.freeAccessInfo,
      };
    }
    return {
      label: t.courseDetail.buyCourse,
      onClick: () => {
        if (!isAuthenticated) {
          navigate('/login', {
            state: { from: `/checkout?type=course&slug=${course.slug}` },
          });
          return;
        }
        navigate(`/checkout?type=course&slug=${course.slug}`);
      },
      tone: 'primary' as const,
      note: t.courseDetail.oneTimePurchase,
    };
  };

  const cta = getCtaConfig();

  const difficultyLabel =
    course.difficulty === 'beginner'
      ? t.common.beginner
      : course.difficulty === 'intermediate'
        ? t.common.intermediate
        : t.common.advanced;

  return (
    <div className="pb-24 lg:pb-12">
      {/* Top Editorial Header Banner — full bleed to viewport top behind fixed header */}
      <div className="surface-mist relative overflow-hidden border-b border-[#ded8ca] dark:border-[#2A332E] pt-[104px] md:pt-[116px]">
        <span aria-hidden="true" className="deco-ring left-[-240px] top-[-320px] size-[720px]" />
        <span aria-hidden="true" className="deco-ring right-[-320px] top-[-220px] size-[640px]" />
        <div className="relative container-page py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="font-mono-tech flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-[#6e6a62] mb-6 flex-wrap"
          >
            <Link to="/" className="hover:text-[#1c5b48]">
              {t.courseDetail.breadcrumbsHome}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/courses" className="hover:text-[#1c5b48]">
              {t.courseDetail.breadcrumbsCourses}
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link to={`/courses?category=${category.slug}`} className="hover:text-[#1c5b48]">
                  {pickText(category.name)}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#141312] dark:text-[#f6f3ec] font-semibold truncate max-w-[260px]">
              {pickText(course.title)}
            </span>
          </nav>

          {/* 70% / 30% Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Column: 70% (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {category && <Badge tone="primary">{pickText(category.name)}</Badge>}
                  <Badge tone="neutral">{difficultyLabel}</Badge>
                  {access !== 'none' && (
                    <Badge tone="success">
                      {access === 'subscription'
                        ? t.marketplace.includedBadge
                        : t.marketplace.enrolledBadge}
                    </Badge>
                  )}
                </div>

                <h1 className="text-h1 text-[#141312] dark:text-[#f6f3ec]">
                  {pickText(course.title)}
                </h1>
                <p className="text-body text-[#6e6a62]">{pickText(course.subtitle)}</p>
              </div>

              {/* Metadata Strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3.5 px-4 bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] rounded-xl font-mono-tech text-[12px] tabular-nums text-[#6e6a62]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#141312] dark:text-[#f6f3ec]">
                  <Star className="h-4 w-4 fill-[#1c5b48] text-[#1c5b48] dark:fill-[#7CD4B5] dark:text-[#7CD4B5]" />
                  {course.rating.toFixed(1)}
                  <span className="font-normal text-[#6e6a62]">
                    ({course.reviewsCount} {t.courseDetail.reviews})
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {formatNumber(course.studentsCount)} {t.common.students}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatNumber(course.durationHours)} {t.common.hours} ·{' '}
                  {formatNumber(course.lessonsCount)} {t.common.lessons}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {course.language === 'bilingual'
                    ? t.common.bilingual
                    : course.language === 'km'
                      ? t.common.khmer
                      : t.common.english}
                </span>
              </div>

              {/* Instructor Card */}
              {instructor && (
                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E]">
                  <span className="font-serif-display h-11 w-11 rounded-lg bg-[#1c5b48] text-white font-medium text-[15px] flex items-center justify-center shrink-0">
                    {instructor.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                      {t.common.by} {instructor.name}
                    </p>
                    <p className="font-mono-tech text-[11px] uppercase tracking-[0.06em] text-[#6e6a62] truncate">
                      {pickText(instructor.role)} · {t.common.updated}: {course.lastUpdated}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile preview thumbnail */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="w-full h-48 rounded-xl bg-[#e5dfd2]/80 dark:bg-[#181E1B] swiss-blueprint-bg border border-[#ded8ca] dark:border-[#2A332E] flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="h-12 w-12 rounded-full bg-[#1c5b48] text-white flex items-center justify-center">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </span>
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    {t.courseDetail.previewCourse}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: 30% (4 cols) Sticky Purchase Card */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="bg-[#efebe1] dark:bg-[#151A17] rounded-2xl border border-[#ded8ca] dark:border-[#2A332E] shadow-[0_18px_40px_-20px_rgba(23,28,25,0.16)] overflow-hidden sticky top-24">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="w-full h-48 bg-[#e5dfd2]/80 dark:bg-[#181E1B] swiss-blueprint-bg border-b border-[#ded8ca] dark:border-[#2A332E] flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span className="h-12 w-12 rounded-full bg-[#1c5b48] text-white flex items-center justify-center group-hover:bg-[#15463a] group-hover:scale-105 transition-all">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </span>
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] font-semibold text-[#141312] dark:text-[#f6f3ec]">
                    {t.courseDetail.previewCourse}
                  </span>
                </button>

                <div className="p-6 space-y-5">
                  <div className="flex items-baseline gap-2.5">
                    {course.price === 0 ? (
                      <span className="font-serif-display text-[34px] font-medium tracking-[-0.02em] text-[#1c5b48] dark:text-[#7CD4B5]">
                        {t.common.free}
                      </span>
                    ) : (
                      <>
                        <span className="font-serif-display text-[38px] font-medium tracking-[-0.03em] tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                          ${course.price.toFixed(2)}
                        </span>
                        {course.originalPrice && (
                          <span className="font-mono-tech text-[14px] text-[#6e6a62] line-through tabular-nums">
                            ${course.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <Button
                    variant={cta.tone === 'success' ? 'success' : 'primary'}
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowUpRight className="h-4 w-4" />}
                    onClick={cta.onClick}
                  >
                    {cta.label}
                  </Button>

                  <p className="font-mono-tech text-[11px] text-[#6e6a62] text-center">
                    {cta.note}
                  </p>

                  <div className="pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] space-y-2.5">
                    <p className="swiss-eyebrow">
                      <span className="swiss-dot" aria-hidden="true" />
                      <span>{t.courseDetail.benefitsHeading}</span>
                    </p>
                    <ul className="space-y-2 text-[13px] text-[#6e6a62]">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                        <span>
                          {course.durationHours} {t.courseDetail.benefitDuration}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                        <span>
                          {course.lessonsCount} {t.courseDetail.benefitLessons}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                        <span>{t.courseDetail.benefitCertificate}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                        <span>{t.courseDetail.benefitAccess}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Main Details Content (70% width on desktop) */}
      <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Learning Outcomes */}
          <section className="swiss-surface p-6">
            <span className="swiss-eyebrow mb-2">
              <span className="swiss-dot" aria-hidden="true" />
              <span>01 / OUTCOMES</span>
            </span>
            <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec] mb-4">
              {t.courseDetail.whatYouLearn}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.outcomes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-[14px] text-[#141312] dark:text-[#f6f3ec]"
                >
                  <Check className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] mt-1 shrink-0" />
                  <span>{pickText(item)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="swiss-surface p-6 space-y-3">
            <span className="swiss-eyebrow">
              <span className="swiss-dot" aria-hidden="true" />
              <span>02 / OVERVIEW</span>
            </span>
            <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">{t.common.learnMore}</h2>
            <p className="text-body text-[#6e6a62]">{pickText(course.description)}</p>
          </section>

          {/* Curriculum Accordion */}
          <section className="swiss-surface p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="swiss-eyebrow mb-1">
                  <span className="swiss-dot" aria-hidden="true" />
                  <span>03 / SYLLABUS</span>
                </span>
                <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
                  {t.courseDetail.curriculum}
                </h2>
              </div>
              <div className="font-mono-tech flex items-center gap-3 text-[11px] uppercase tracking-[0.06em] font-medium text-[#141312] dark:text-[#f6f3ec]">
                <button
                  type="button"
                  onClick={() => setAllSections(true)}
                  className="hover:text-[#1c5b48] cursor-pointer"
                >
                  {t.courseDetail.expandAll}
                </button>
                <span className="text-[#ded8ca]">|</span>
                <button
                  type="button"
                  onClick={() => setAllSections(false)}
                  className="hover:text-[#1c5b48] cursor-pointer"
                >
                  {t.courseDetail.collapseAll}
                </button>
              </div>
            </div>

            <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border border-[#ded8ca] dark:border-[#2A332E] rounded-xl overflow-hidden">
              {course.curriculum.map((section, sIdx) => {
                const isOpen = Boolean(expandedSections[section.id]);
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3.5 bg-[#e5dfd2]/65 dark:bg-[#181E1B] hover:bg-[#e5dfd2] flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                    >
                      <span className="text-[15px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                        <span className="font-mono-tech text-[11px] text-[#1c5b48] dark:text-[#7CD4B5] mr-2">
                          {String(sIdx + 1).padStart(2, '0')}
                        </span>
                        {pickText(section.title)}
                      </span>
                      <div className="flex items-center gap-3 shrink-0 font-mono-tech text-[11px] tabular-nums text-[#6e6a62]">
                        <span>
                          {section.lessons.length} {t.common.lessons}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    {isOpen && (
                      <ul className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] bg-[#efebe1] dark:bg-[#151A17]">
                        {section.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="px-4 py-3 flex items-center justify-between gap-3 text-[14px]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                              ) : lesson.type === 'quiz' ? (
                                <HelpCircle className="h-4 w-4 text-[#8a5008] shrink-0" />
                              ) : (
                                <FileText className="h-4 w-4 text-[#6e6a62] shrink-0" />
                              )}
                              <span className="text-[#141312] dark:text-[#f6f3ec] truncate">
                                {pickText(lesson.title)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isPreview ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewOpen(true)}
                                  className="font-mono-tech text-[11px] uppercase tracking-[0.06em] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] hover:underline cursor-pointer"
                                >
                                  {t.courseDetail.previewLessonLabel}
                                </button>
                              ) : access === 'none' ? (
                                <Lock className="h-3.5 w-3.5 text-[#6e6a62]" />
                              ) : null}
                              <span className="font-mono-tech text-[11px] tabular-nums text-[#6e6a62]">
                                {lesson.durationMinutes} {t.common.minutes}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Requirements */}
          <section className="swiss-surface p-6 space-y-3">
            <span className="swiss-eyebrow">
              <span className="swiss-dot" aria-hidden="true" />
              <span>04 / PREREQUISITES</span>
            </span>
            <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
              {t.courseDetail.requirements}
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-[#6e6a62]">
              {course.requirements.map((req, idx) => (
                <li key={idx}>{pickText(req)}</li>
              ))}
            </ul>
          </section>

          {/* Paginated Reviews */}
          <section className="swiss-surface p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="swiss-eyebrow mb-1">
                  <span className="swiss-dot" aria-hidden="true" />
                  <span>05 / REVIEWS</span>
                </span>
                <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
                  {t.courseDetail.reviews}
                </h2>
              </div>
              <span className="font-mono-tech text-[14px] font-semibold tabular-nums text-[#141312] dark:text-[#f6f3ec] inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#1c5b48] text-[#1c5b48] dark:fill-[#7CD4B5] dark:text-[#7CD4B5]" />
                {course.rating.toFixed(1)}
              </span>
            </div>

            {course.reviews.length === 0 ? (
              <p className="text-[14px] text-[#6e6a62]">
                Verified learner reviews appear here after cohort completion.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#e5dfd2]/65 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                            {rev.authorName}
                          </p>
                          <p className="font-mono-tech text-[11px] text-[#6e6a62]">
                            {pickText(rev.authorRole)}
                          </p>
                        </div>
                        <span className="font-mono-tech text-[11px] tabular-nums text-[#6e6a62]">
                          {rev.date}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#141312] dark:text-[#f6f3ec]">
                        {pickText(rev.comment)}
                      </p>
                    </div>
                  ))}
                </div>
                <Pagination
                  page={reviewPage}
                  totalPages={totalReviewPages}
                  onPageChange={setReviewPage}
                />
              </>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Sticky Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#efebe1] dark:bg-[#151A17] border-t border-[#ded8ca] dark:border-[#2A332E] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono-tech text-[11px] text-[#6e6a62] truncate max-w-[160px]">
            {pickText(course.title)}
          </p>
          <p className="font-serif-display text-[20px] font-medium tabular-nums text-[#141312] dark:text-[#f6f3ec]">
            {course.price === 0 ? t.common.free : `$${course.price.toFixed(2)}`}
          </p>
        </div>
        <Button
          variant={cta.tone === 'success' ? 'success' : 'primary'}
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
          onClick={cta.onClick}
        >
          {cta.label}
        </Button>
      </div>

      {/* Preview Video Modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`${t.courseDetail.previewModalTitle}: ${pickText(course.title)}`}
      >
        <div className="space-y-4">
          <div className="aspect-video rounded-xl bg-[#1C2420] text-white flex flex-col items-center justify-center p-6 text-center space-y-3 border border-[#2C3631]">
            <PlayCircle className="h-12 w-12 text-[#7CD4B5]" />
            <p className="font-serif-display text-[20px] font-medium">{pickText(course.title)}</p>
            <p className="font-mono-tech text-[12px] text-[#A3ACA6] max-w-md">
              Sample preview lesson ·{' '}
              {course.curriculum[0]?.lessons[0]
                ? pickText(course.curriculum[0].lessons[0].title)
                : 'Introduction'}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              {t.nav.close}
            </Button>
            <Button
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => {
                setPreviewOpen(false);
                cta.onClick();
              }}
            >
              {cta.label}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Start Learning Handoff Modal */}
      <Modal
        open={learningModalOpen}
        onClose={() => setLearningModalOpen(false)}
        title={t.courseDetail.learningHandoffTitle}
      >
        <div className="space-y-4">
          <Alert tone="success">{t.courseDetail.learningHandoffDesc}</Alert>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={() => setLearningModalOpen(false)}>
              {t.nav.close}
            </Button>
            <a
              href={`${API_CONFIG.userAppUrl}/courses/${course.slug}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button rightIcon={<ExternalLink className="h-4 w-4" />}>
                {t.courseDetail.openUserApp}
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};
