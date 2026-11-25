import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  Code2,
  Film,
  Megaphone,
  Palette,
  PlayCircle,
} from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Category } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="h-6 w-6" />,
  Code2: <Code2 className="h-6 w-6" />,
  Palette: <Palette className="h-6 w-6" />,
  Briefcase: <Briefcase className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  Film: <Film className="h-6 w-6" />,
};

export const CategoriesPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl mb-8">
        <h1 className="text-h1 text-[#0F172A]">{t.home.categoriesTitle}</h1>
        <p className="text-body text-[#64748B] mt-2">{t.home.categoriesSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card rounded-[24px] p-6 flex flex-col justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-[10px] bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                {iconMap[cat.icon] ?? <BookOpen className="h-6 w-6" />}
              </div>
              <h2 className="text-[19px] font-semibold text-[#0F172A]">{pickText(cat.name)}</h2>
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {pickText(cat.description)}
              </p>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-[13px] font-medium">
              <Link
                to={`/courses?category=${cat.slug}`}
                className="inline-flex items-center gap-1.5 text-[#2563EB] hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                <span>
                  {cat.courseCount} {t.nav.courses}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to={`/videos?category=${cat.slug}`}
                className="inline-flex items-center gap-1.5 text-[#0891B2] hover:underline"
              >
                <PlayCircle className="h-4 w-4" />
                <span>
                  {cat.videoCount} {t.nav.videos}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

