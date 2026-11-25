import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
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
  'digital-marketing': <Megaphone className="h-10 w-10 text-[#2563EB]" />,
  'software-engineering': <Code2 className="h-10 w-10 text-[#0891B2]" />,
  'ui-ux-design': <Palette className="h-10 w-10 text-[#16A34A]" />,
  'business-finance': <Briefcase className="h-10 w-10 text-[#D97706]" />,
  'data-ai': <BarChart3 className="h-10 w-10 text-[#2563EB]" />,
  'creative-video': <Film className="h-10 w-10 text-[#E11D48]" />,
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

  return (
    <Link
      to={`/courses/${course.slug}`}
      className={`group glass-card flex flex-col rounded-[16px] overflow-hidden ${className}`}
    >
      {/* Inset Rounded Thumbnail (matching Known card layout) */}
      <div className="p-3.5 pb-0">
        <div
          className={`relative h-44 w-full rounded-[12px] bg-gradient-to-br ${course.thumbnailTheme} border border-white/80 overflow-hidden p-3.5 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-[11px] font-semibold text-[#0F172A] shadow-xs">
              {category ? pickText(category.name) : course.thumbnailLabel}
            </span>
            {access !== 'none' ? (
              <Badge tone="success">
                {access === 'subscription'
                  ? t.marketplace.includedBadge
                  : t.marketplace.enrolledBadge}
              </Badge>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[11px] font-semibold text-[#0F172A]">
                <Star className="h-3 w-3 fill-[#D97706] text-[#D97706]" />
                {course.rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center my-auto">
            <div className="h-16 w-16 rounded-2xl bg-white/85 backdrop-blur-sm border border-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              {categoryCoverIcon[course.categorySlug] ?? (
                <BookOpen className="h-9 w-9 text-[#2563EB]" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-medium text-[#475569]">
            <span className="px-2 py-0.5 rounded bg-white/85">
              {course.difficulty === 'beginner'
                ? t.common.beginner
                : course.difficulty === 'intermediate'
                  ? t.common.intermediate
                  : t.common.advanced}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/85">
              {formatNumber(course.durationHours)} {t.common.hours}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[12px] text-[#64748B] truncate">
            {instructor?.name} ·{' '}
            {course.language === 'bilingual'
              ? t.common.bilingual
              : course.language === 'km'
                ? t.common.khmer
                : t.common.english}
          </p>

          <h3 className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug min-h-[44px]">
            {pickText(course.title)}
          </h3>

          <div className="flex items-center gap-4 pt-0.5 text-[12px] text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#94A3B8]" />
              {t.marketplace.lessonLabel}: {formatNumber(course.lessonsCount)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-[#94A3B8]" />
              {t.marketplace.studentLabel}: {formatCompactStudents(course.studentsCount)}
            </span>
          </div>
        </div>

        {/* Bottom Price + Primary Blue Action Pill (matching Known card footer) */}
        <div className="pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-[#64748B] leading-none mb-1">{t.common.price}</p>
            {course.price === 0 ? (
              <span className="text-[18px] font-bold text-[#E11D48]">{t.common.free}</span>
            ) : (
              <span className="text-[18px] font-bold text-[#0F172A]">
                ${course.price % 1 === 0 ? course.price.toFixed(0) : course.price.toFixed(2)}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[8px] bg-[#2563EB] group-hover:bg-[#1D4ED8] text-white text-[13px] font-medium transition-colors shrink-0">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>{actionLabel()}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
