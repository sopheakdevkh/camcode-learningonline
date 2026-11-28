import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Code2,
  FileText,
  Film,
  Megaphone,
  Palette,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Course } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const categoryCoverIcon: Record<string, React.ReactNode> = {
  'digital-marketing': <Megaphone className="h-5 w-5" />,
  'software-engineering': <Code2 className="h-5 w-5" />,
  'ui-ux-design': <Palette className="h-5 w-5" />,
  'business-finance': <Briefcase className="h-5 w-5" />,
  'data-ai': <BarChart3 className="h-5 w-5" />,
  'creative-video': <Film className="h-5 w-5" />,
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, className = '' }) => {
  const { pickText, t, formatNumber } = useI18n();
  const { hasCourseAccess } = useAuth();
  const instructor = catalogService.getInstructorById(course.instructorId);
  const category = catalogService.getCategoryBySlug(course.categorySlug);
  const access = hasCourseAccess(course);

  const actionLabel = () => {
    if (access !== 'none') return t.courseDetail.startLearning;
    if (course.price === 0) return t.marketplace.startCourseAction;
    return t.marketplace.startCourseAction;
  };

  const formatCompactStudents = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K+`;
    }
    return formatNumber(count);
  };

  const difficultyLabel =
    course.difficulty === 'beginner'
      ? t.common.beginner
      : course.difficulty === 'intermediate'
        ? t.common.intermediate
        : t.common.advanced;

  return (
    <Link to={`/courses/${course.slug}`} className={`block h-full ${className}`}>
      <article className="card-note group flex h-full flex-col justify-between p-5 md:p-6">
        <div>
          {/* Inset Warm-Stone Blueprint Frame */}
          <div className="relative h-40 w-full rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] swiss-blueprint-bg overflow-hidden p-3.5 flex flex-col justify-between transition-colors duration-[0.22s] group-hover:border-[#c2baa8] dark:group-hover:border-[#3E4D45]">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tech inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[10px] font-medium uppercase tracking-[0.06em] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:border-[#c2baa8]">
                <span className="swiss-dot" aria-hidden="true" />
                {category ? pickText(category.name) : course.thumbnailLabel}
              </span>
              {access !== 'none' ? (
                <Badge tone="success">
                  {access === 'subscription'
                    ? t.marketplace.includedBadge
                    : t.marketplace.enrolledBadge}
                </Badge>
              ) : (
                <span className="font-mono-tech inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#efebe1] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[11px] font-semibold tabular-nums text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:border-[#c2baa8]">
                  <Star className="h-3 w-3 fill-[#1c5b48] text-[#1c5b48] dark:fill-[#7CD4B5] dark:text-[#7CD4B5]" />
                  {course.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-center my-auto">
              <div className="icon-box !w-12 !h-12 border border-[#ded8ca] dark:border-[#2A332E] group-hover:scale-105 shadow-xs">
                {categoryCoverIcon[course.categorySlug] ?? <BookOpen className="h-5 w-5" />}
              </div>
            </div>

            <div className="flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.08em] text-[#6e6a62] dark:text-[#A3ACA6]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#efebe1]/95 dark:bg-[#151A17]/95 border border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#c2baa8]">
                {difficultyLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#efebe1]/95 dark:bg-[#151A17]/95 border border-[#ded8ca] dark:border-[#2A332E] tabular-nums transition-colors duration-[0.22s] group-hover:border-[#c2baa8]">
                {formatNumber(course.durationHours)} {t.common.hours}
              </span>
            </div>
          </div>

          {/* Header Row: Serif Title + Mono Lesson Count Index */}
          <div className="mt-5 flex items-start justify-between gap-4">
            <h3 className="font-serif-display text-[21px] font-medium leading-[1.22] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] line-clamp-2">
              {pickText(course.title)}
            </h3>
            <span aria-hidden="true" className="index-number mt-1 shrink-0">
              {String(course.lessonsCount).padStart(2, '0')}L
            </span>
          </div>

          {/* Short Editorial Subtitle / Instructor */}
          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#4c4842] dark:text-[#A3ACA6] line-clamp-2">
            {pickText(course.subtitle)}
          </p>

          {/* Rounded-full Metadata Pills (bg-surface inside bg-canvas card-note) */}
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                <FileText className="h-3 w-3 opacity-75" />
                {formatNumber(course.lessonsCount)} {t.marketplace.lessonLabel}
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body tabular-nums transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                <Users className="h-3 w-3 opacity-75" />
                {formatCompactStudents(course.studentsCount)}
              </span>
            </li>
            {instructor && (
              <li>
                <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                  {instructor.name}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Footer Price + Action Row */}
        <div className="mt-5 pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#c2baa8] dark:group-hover:border-[#3E4D45] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {course.price === 0 ? (
              <span className="font-serif-display text-[22px] font-medium text-[#1c5b48] dark:text-[#7CD4B5]">
                {t.common.free}
              </span>
            ) : (
              <span className="font-serif-display text-[22px] font-medium tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                ${course.price % 1 === 0 ? course.price.toFixed(0) : course.price.toFixed(2)}
              </span>
            )}
            <span className="t-method">
              {course.language === 'bilingual'
                ? t.common.bilingual
                : course.language === 'km'
                  ? t.common.khmer
                  : t.common.english}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] whitespace-nowrap transition-transform duration-[0.22s] group-hover:translate-x-0.5">
            <span>{actionLabel()}</span>
            <ArrowUpRight className="h-3.5 w-3.5 swiss-arrow-shift" />
          </span>
        </div>
      </article>
    </Link>
  );
};
