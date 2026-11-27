import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { CourseCard } from '@/components/cards/CourseCard';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService, type PaginatedCoursesResult } from '@/services/catalogService';
import type {
  Category,
  ContentLanguage,
  CourseSortOption,
  DifficultyLevel,
  Instructor,
} from '@/types';

export const CoursesPage: React.FC = () => {
  const { t, pickText } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const chipsRef = useRef<HTMLDivElement>(null);

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const difficulty = (searchParams.get('difficulty') ?? '') as DifficultyLevel | '';
  const priceType = (searchParams.get('price') ?? 'all') as 'all' | 'free' | 'paid';
  const minRating = Number(searchParams.get('rating') ?? '0');
  const duration = (searchParams.get('duration') ?? 'all') as 'all' | 'short' | 'medium' | 'long';
  const language = (searchParams.get('lang') ?? '') as ContentLanguage | '';
  const instructorId = searchParams.get('instructor') ?? '';
  const sort = (searchParams.get('sort') ?? 'recommended') as CourseSortOption;
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [searchInput, setSearchInput] = useState(q);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [result, setResult] = useState<PaginatedCoursesResult>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    Promise.all([catalogService.getCategories(), catalogService.getInstructors()]).then(
      ([cats, insts]) => {
        setCategories(cats);
        setInstructors(insts);
      },
    );
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    catalogService
      .listCourses({
        q,
        category,
        difficulty,
        priceType,
        minRating,
        duration,
        language,
        instructorId,
        sort,
        page,
        pageSize: 6,
      })
      .then((res) => {
        if (!active) return;
        setResult(res);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q, category, difficulty, priceType, minRating, duration, language, instructorId, sort, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '0') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = [
    q,
    category,
    difficulty,
    priceType !== 'all' ? priceType : '',
    minRating > 0 ? String(minRating) : '',
    duration !== 'all' ? duration : '',
    language,
    instructorId,
  ].filter(Boolean).length;

  const scrollChips = (dir: 'left' | 'right') => {
    if (!chipsRef.current) return;
    chipsRef.current.scrollBy({
      left: dir === 'left' ? -240 : 240,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="COURSE MARKETPLACE"
        title={
          <>
            {t.marketplace.title}{' '}
            <span className="italic text-[#1c5b48] dark:text-[#7CD4B5]">
              {t.marketplace.titleLine2}
            </span>
          </>
        }
        description={
          q ? (
            <>
              {t.nav.search}: <strong className="text-[#141312] dark:text-[#f6f3ec]">“{q}”</strong> ·{' '}
              {result.total} {t.common.results}
            </>
          ) : (
            pickText({
              en: 'Explore structured courses across technology, design, marketing, and business — taught with real practitioner projects.',
              km: 'ស្វែងរកវគ្គសិក្សាមានរចនាសម្ព័ន្ធលើបច្ចេកវិទ្យា ឌីហ្សាញ ទីផ្សារ និងអាជីវកម្ម — បង្រៀនដោយអ្នកជំនាញពិតប្រាកដ។',
            })
          )
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam('q', searchInput.trim());
          }}
          className="mx-auto flex max-w-3xl flex-col items-stretch justify-between gap-3 rounded-[20px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#efebe1] dark:bg-[#151A17] p-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 gap-2">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === '') updateParam('q', '');
              }}
              placeholder={t.nav.searchPlaceholder}
              leftAddon={<Search className="h-4 w-4" />}
            />
            <Button type="submit" className="h-[46px] shrink-0">
              {t.nav.search}
            </Button>
          </div>
          <div className="flex items-center justify-end gap-3 px-2">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] text-[#6e6a62] tabular-nums">
              <strong className="text-[#141312] dark:text-[#f6f3ec]">
                {String(result.total).padStart(2, '0')}
              </strong>{' '}
              {t.common.results}
            </span>
          </div>
        </form>
      </PageHero>

      <div className="surface-dots py-10 md:py-14">
      <div className="container-page">
      {/* Category Pill Strip + Scroll Controls */}
      <div className="flex items-center gap-3 mb-5">
        <div
          ref={chipsRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
        >
        <button
          type="button"
          onClick={() => updateParam('category', '')}
          className={`font-mono-tech inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[11px] uppercase tracking-[0.06em] font-medium shrink-0 border transition-colors cursor-pointer ${
            !category
              ? 'bg-[#1c5b48] text-white border-[#1c5b48] dark:bg-[#2D7A62]'
              : 'bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] hover:text-[#141312]'
          }`}
        >
          <Star className="h-3 w-3 fill-current" />
          <span>{t.marketplace.trendingChip}</span>
        </button>

        {categories.map((cat) => {
          const active = category === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam('category', active ? '' : cat.slug)}
              className={`font-mono-tech inline-flex items-center h-9 px-4 rounded-full text-[11px] uppercase tracking-[0.06em] font-medium shrink-0 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1c5b48] text-white border-[#1c5b48] dark:bg-[#2D7A62]'
                  : 'bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] hover:text-[#141312]'
              }`}
            >
              {pickText(cat.name)}
            </button>
          );
        })}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => scrollChips('left')}
            aria-label={t.common.previous}
            className="h-9 w-9 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] hover:text-[#141312] hover:border-[#1c5b48] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollChips('right')}
            aria-label={t.common.next}
            className="h-9 w-9 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sub-control Bar: Sort Dropdown + Filter Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#ded8ca] dark:border-[#2A332E] mb-8">
        <div className="flex items-center gap-2.5">
          <select
            id="course-sort"
            aria-label={t.marketplace.sortBy}
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="h-9 px-3.5 rounded-full border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] font-medium text-[#141312] dark:text-[#f6f3ec] outline-none focus:border-[#1c5b48]"
          >
            <option value="recommended">{t.marketplace.sortRecommended}</option>
            <option value="price_asc">{t.marketplace.sortPriceAsc}</option>
            <option value="price_desc">{t.marketplace.sortPriceDesc}</option>
            <option value="popular">{t.marketplace.sortPopular}</option>
            <option value="newest">{t.marketplace.sortNewest}</option>
            <option value="highest_rated">{t.marketplace.sortHighestRated}</option>
          </select>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="font-mono-tech inline-flex items-center gap-1 h-9 px-3.5 rounded-full bg-[#e5dfd2] dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] text-[11px] uppercase tracking-[0.06em] font-medium text-[#1c5b48] dark:text-[#7CD4B5] hover:border-[#1c5b48] cursor-pointer"
            >
              <span>{t.common.clearAll}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFilterPanelOpen((o) => !o)}
          className={`inline-flex items-center gap-2 h-9 px-4 rounded-full border text-[13px] font-medium cursor-pointer transition-colors ${
            filterPanelOpen || activeFilterCount > 0
              ? 'border-[#1c5b48] bg-[#1c5b48] text-white dark:bg-[#2D7A62]'
              : 'border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48]'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t.marketplace.filterBtn}</span>
          {activeFilterCount > 0 && (
            <span className="font-mono-tech h-5 min-w-5 px-1.5 rounded-full bg-white text-[#1c5b48] text-[11px] flex items-center justify-center tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible Filter Panel */}
      {filterPanelOpen && (
        <div className="swiss-stone p-5 mb-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateParam('q', searchInput.trim());
              }}
              className="flex-1 flex gap-2"
            >
              <Input
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (e.target.value === '') updateParam('q', '');
                }}
                placeholder={t.marketplace.searchPlaceholder}
                leftAddon={<Search className="h-4 w-4" />}
              />
              <Button type="submit" className="h-[46px]">
                {t.nav.search}
              </Button>
            </form>
            <Button variant="ghost" size="sm" onClick={() => setFilterPanelOpen(false)}>
              {t.nav.close}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Difficulty */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.difficulty}
              </label>
              <select
                value={difficulty}
                onChange={(e) => updateParam('difficulty', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="">{t.common.all}</option>
                <option value="beginner">{t.common.beginner}</option>
                <option value="intermediate">{t.common.intermediate}</option>
                <option value="advanced">{t.common.advanced}</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.price}
              </label>
              <select
                value={priceType}
                onChange={(e) => updateParam('price', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="all">{t.marketplace.priceAll}</option>
                <option value="free">{t.marketplace.priceFree}</option>
                <option value="paid">{t.marketplace.pricePaid}</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.rating}
              </label>
              <select
                value={minRating}
                onChange={(e) => updateParam('rating', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="0">{t.common.all}</option>
                <option value="4.5">{t.marketplace.rating45}</option>
                <option value="4">{t.marketplace.rating40}</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.duration}
              </label>
              <select
                value={duration}
                onChange={(e) => updateParam('duration', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="all">{t.marketplace.durationAll}</option>
                <option value="short">{t.marketplace.durationShort}</option>
                <option value="medium">{t.marketplace.durationMedium}</option>
                <option value="long">{t.marketplace.durationLong}</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.language}
              </label>
              <select
                value={language}
                onChange={(e) => updateParam('lang', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="">{t.common.all}</option>
                <option value="en">{t.common.english}</option>
                <option value="km">{t.common.khmer}</option>
                <option value="bilingual">{t.common.bilingual}</option>
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label className="block font-mono-tech text-[10px] uppercase tracking-[0.08em] font-semibold text-[#6e6a62] mb-1.5">
                {t.common.instructor}
              </label>
              <select
                value={instructorId}
                onChange={(e) => updateParam('instructor', e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#ded8ca] dark:border-[#2A332E] bg-[#efebe1] dark:bg-[#151A17] text-[13px] text-[#141312] dark:text-[#f6f3ec]"
              >
                <option value="">{t.common.all}</option>
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : result.items.length === 0 ? (
        <div className="swiss-surface p-12 text-center space-y-3">
          <h3 className="text-[18px] font-bold text-[#141312] dark:text-[#f6f3ec]">
            {t.marketplace.emptyTitle}
          </h3>
          <p className="text-[14px] text-[#6e6a62] max-w-md mx-auto">
            {t.marketplace.emptyDesc}
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={clearAllFilters}>
              {t.common.clearAll}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            onPageChange={(nextPage) => updateParam('page', String(nextPage))}
          />
        </>
      )}
      </div>
      </div>
    </div>
  );
};
