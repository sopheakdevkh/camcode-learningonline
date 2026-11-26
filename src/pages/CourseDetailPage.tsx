import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
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
  const { t, pickText, formatNumber, formatCurrency } = useI18n();
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
    catalogService
      .getCourseBySlug(slug)
      .then((data) => {
        if (!active) return;
        setCourse(data);
        if (data && data.curriculum.length > 0) {
          setExpandedSections({ [data.curriculum[0].id]: true });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setCourse(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-10 space-y-6">
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
    );
  }

  if (!course) {
    return (
      <div className="container-page py-16 text-center space-y-4">
        <h1 className="text-h2 text-secondary">{t.common.noResults}</h1>
        <Link to="/courses">
          <Button variant="outline">{t.common.back}</Button>
        </Link>
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
      {/* Top Light Frosted Header Banner */}
      <div className="bg-white/75 dark:bg-[#0b1120]/80 backdrop-blur-sm border-b border-border/80 dark:border-slate-800">
        <div className="container-page py-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-primary">
              {t.courseDetail.breadcrumbsHome}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/courses" className="hover:text-primary">
              {t.courseDetail.breadcrumbsCourses}
            </Link>
            {category && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link to={`/courses?category=${category.slug}`} className="hover:text-primary">
                  {pickText(category.name)}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-secondary font-medium truncate max-w-full sm:max-w-80 min-w-0">
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

                <h1 className="text-h1 text-secondary">{pickText(course.title)}</h1>
                <p className="text-body text-muted">{pickText(course.subtitle)}</p>
              </div>

              {/* Metadata strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#475569]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-secondary">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  {course.rating.toFixed(1)}
                  <span className="font-normal text-muted">
                    ({course.reviewsCount} {t.courseDetail.reviews})
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted" />
                  {formatNumber(course.studentsCount)} {t.common.students}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted" />
                  {formatNumber(course.durationHours)} {t.common.hours} ·{' '}
                  {formatNumber(course.lessonsCount)} {t.common.lessons}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-muted" />
                  {course.language === 'bilingual'
                    ? t.common.bilingual
                    : course.language === 'km'
                      ? t.common.khmer
                      : t.common.english}
                </span>
              </div>

              {/* Instructor Card */}
              {instructor && (
                <div className="flex items-center gap-3.5 p-4 rounded-[12px] bg-background border border-border">
                  <span
                    className="h-11 w-11 rounded-full text-white font-semibold text-[14px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: instructor.avatarColor }}
                  >
                    {instructor.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-secondary">
                      {t.common.by} {instructor.name}
                    </p>
                    <p className="text-[13px] text-muted truncate">
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
                  className={`w-full h-48 rounded-[12px] bg-linear-to-br ${course.thumbnailTheme} border flex flex-col items-center justify-center gap-2 cursor-pointer`}
                >
                  <span className="h-12 w-12 rounded-full bg-white dark:bg-slate-900 border border-border dark:border-slate-700 flex items-center justify-center text-primary dark:text-blue-400">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </span>
                  <span className="text-[14px] font-medium text-secondary dark:text-slate-100">
                    {t.courseDetail.previewCourse}
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: 30% (4 cols) Sticky Purchase Card */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="bg-white dark:bg-slate-900 rounded-[12px] border border-border dark:border-slate-700/80 overflow-hidden sticky top-24">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className={`w-full h-48 bg-linear-to-br ${course.thumbnailTheme} border-b border-border dark:border-slate-700/80 flex flex-col items-center justify-center gap-2.5 group cursor-pointer`}
                >
                  <span className="h-13 w-13 rounded-full bg-white dark:bg-slate-900 border border-border dark:border-slate-700 flex items-center justify-center text-primary dark:text-blue-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </span>
                  <span className="text-[13px] font-semibold text-secondary dark:text-slate-100">
                    {t.courseDetail.previewCourse}
                  </span>
                </button>

                <div className="p-6 space-y-5">
                  <div className="flex items-baseline gap-2.5">
                    {course.price === 0 ? (
                      <span className="text-[28px] font-bold text-success">
                        {t.common.free}
                      </span>
                    ) : (
                      <>
                        <span className="text-[30px] font-bold tabular-nums text-secondary">
                          {formatCurrency(course.price)}
                        </span>
                        {course.originalPrice && (
                          <span className="text-[15px] text-muted line-through">
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
                    onClick={cta.onClick}
                  >
                    {cta.label}
                  </Button>

                  <p className="text-[12px] text-muted text-center">{cta.note}</p>

                  <div className="pt-4 border-t border-border space-y-2.5">
                    <p className="text-[13px] font-semibold text-secondary">
                      {t.courseDetail.benefitsHeading}
                    </p>
                    <ul className="space-y-2 text-[13px] text-[#475569]">
                      <li className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          {course.durationHours} {t.courseDetail.benefitDuration}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          {course.lessonsCount} {t.courseDetail.benefitLessons}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary shrink-0" />
                        <span>{t.courseDetail.benefitCertificate}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary shrink-0" />
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
      <div className="container-page py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Learning Outcomes */}
          <section className="glass-card rounded-3xl p-6">
            <h2 className="text-h3 text-secondary mb-4">{t.courseDetail.whatYouLearn}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.outcomes.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[14px] text-secondary">
                  <Check className="h-4 w-4 text-success mt-1 shrink-0" />
                  <span>{pickText(item)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="glass-card rounded-3xl p-6 space-y-3">
            <h2 className="text-h3 text-secondary">{t.common.learnMore}</h2>
            <p className="text-body text-[#475569]">{pickText(course.description)}</p>
          </section>

          {/* Curriculum Accordion */}
          <section className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-h3 text-secondary">{t.courseDetail.curriculum}</h2>
              <div className="flex items-center gap-3 text-[13px] font-medium text-primary">
                <button
                  type="button"
                  onClick={() => setAllSections(true)}
                  className="hover:underline cursor-pointer"
                >
                  {t.courseDetail.expandAll}
                </button>
                <span className="text-[#CBD5E1]">|</span>
                <button
                  type="button"
                  onClick={() => setAllSections(false)}
                  className="hover:underline cursor-pointer"
                >
                  {t.courseDetail.collapseAll}
                </button>
              </div>
            </div>

            <div className="divide-y divide-border border border-border rounded-[10px] overflow-hidden">
              {course.curriculum.map((section) => {
                const isOpen = Boolean(expandedSections[section.id]);
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3.5 bg-background dark:bg-slate-900/90 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                    >
                      <span className="text-[15px] font-semibold text-secondary">
                        {pickText(section.title)}
                      </span>
                      <div className="flex items-center gap-3 shrink-0 text-[13px] text-muted">
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
                      <ul className="divide-y divide-border bg-white">
                        {section.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="px-4 py-3 flex items-center justify-between gap-3 text-[14px]"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {lesson.type === 'video' ? (
                                <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                              ) : lesson.type === 'quiz' ? (
                                <HelpCircle className="h-4 w-4 text-warning shrink-0" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted shrink-0" />
                              )}
                              <span className="text-secondary truncate">
                                {pickText(lesson.title)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {lesson.isPreview ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewOpen(true)}
                                  className="text-[12px] font-medium text-primary hover:underline cursor-pointer"
                                >
                                  {t.courseDetail.previewLessonLabel}
                                </button>
                              ) : access === 'none' ? (
                                <Lock className="h-3.5 w-3.5 text-[#94A3B8]" />
                              ) : null}
                              <span className="text-[12px] text-muted">
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
          <section className="glass-card rounded-3xl p-6 space-y-3">
            <h2 className="text-h3 text-secondary">{t.courseDetail.requirements}</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-[#475569]">
              {course.requirements.map((req, idx) => (
                <li key={idx}>{pickText(req)}</li>
              ))}
            </ul>
          </section>

          {/* Paginated Reviews */}
          <section className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 text-secondary">{t.courseDetail.reviews}</h2>
              <span className="text-[14px] font-semibold text-secondary inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {course.rating.toFixed(1)}
              </span>
            </div>

            {course.reviews.length === 0 ? (
              <p className="text-[14px] text-muted">
                Verified learner reviews appear here after cohort completion.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-[10px] bg-background border border-border space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-[14px] font-semibold text-secondary">
                            {rev.authorName}
                          </p>
                          <p className="text-[12px] text-muted">{pickText(rev.authorRole)}</p>
                        </div>
                        <span className="text-[12px] text-muted">{rev.date}</span>
                      </div>
                      <p className="text-[14px] text-secondary">{pickText(rev.comment)}</p>
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
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-border dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-muted truncate">
            {pickText(course.title)}
          </p>
          <p className="text-[18px] font-bold tabular-nums text-secondary">
            {course.price === 0 ? t.common.free : formatCurrency(course.price)}
          </p>
        </div>
        <Button
          variant={cta.tone === 'success' ? 'success' : 'primary'}
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
          <div className="aspect-video rounded-[10px] bg-secondary dark:bg-[#060a13] dark:border dark:border-slate-800 text-white flex flex-col items-center justify-center p-6 text-center space-y-3">
            <PlayCircle className="h-12 w-12 text-[#60A5FA]" />
            <p className="text-[16px] font-semibold">{pickText(course.title)}</p>
            <p className="text-[13px] text-[#94A3B8] max-w-md">
              Sample preview lesson · {course.curriculum[0]?.lessons[0]
                ? pickText(course.curriculum[0].lessons[0].title)
                : 'Introduction'}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              {t.nav.close}
            </Button>
            <Button
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

