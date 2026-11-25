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
    <div className="container-page py-8 md:py-12">
      {/* Known-template Header: 2-line editorial heading + < > chip scroll buttons */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h1 text-[#0F172A] leading-tight">
            {t.marketplace.title}
            <br />
            {t.marketplace.titleLine2}
          </h1>
          {q && (
            <p className="text-[14px] text-[#64748B] mt-2">
              {t.nav.search}: <strong className="text-[#0F172A]">“{q}”</strong> · {result.total}{' '}
              {t.common.results}
            </p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollChips('left')}
            aria-label={t.common.previous}
            className="h-9 w-9 rounded-full border border-[#E2E8F0] bg-white/90 text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollChips('right')}
            aria-label={t.common.next}
            className="h-9 w-9 rounded-full border border-[#E2E8F0] bg-white/90 text-[#0F172A] hover:border-[#CBD5E1] flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Pill Strip (Trending + Categories, matching template) */}
      <div
        ref={chipsRef}
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-5"
      >
        <button
          type="button"
          onClick={() => updateParam('category', '')}
          className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] text-[13px] font-medium shrink-0 border transition-colors cursor-pointer ${
            !category
              ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
              : 'bg-white/85 text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
          }`}
        >
          <Star className="h-3.5 w-3.5 fill-current" />
          <span>{t.marketplace.trendingChip}</span>
        </button>

        {categories.map((cat) => {
          const active = category === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => updateParam('category', active ? '' : cat.slug)}
              className={`inline-flex items-center h-9 px-4 rounded-[8px] text-[13px] font-medium shrink-0 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                  : 'bg-white/85 text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
              }`}
            >
              {pickText(cat.name)}
            </button>
          );
        })}
      </div>

      {/* Sub-control Bar: Left Sort Dropdown ("Price: Lowest ⌄"), Right "Filter" Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div className="flex items-center gap-2.5">
          <select
            id="course-sort"
            aria-label={t.marketplace.sortBy}
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="h-9 px-3 rounded-[8px] border border-[#E2E8F0] bg-white/90 text-[13px] font-medium text-[#0F172A] outline-none focus:border-[#2563EB]"
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
              className="inline-flex items-center gap-1 h-9 px-3 rounded-[8px] bg-white/85 border border-[#E2E8F0] text-[12px] font-medium text-[#2563EB] hover:bg-white cursor-pointer"
            >
              <span>{t.common.clearAll}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setFilterPanelOpen((o) => !o)}
          className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-[8px] border text-[13px] font-medium cursor-pointer transition-colors ${
            filterPanelOpen || activeFilterCount > 0
              ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
              : 'border-[#E2E8F0] bg-white/90 text-[#0F172A] hover:bg-white'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t.marketplace.filterBtn}</span>
          {activeFilterCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#2563EB] text-white text-[11px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Collapsible Filter Panel (keeps all 7 PUB-02 filters cleanly tucked under Filter) */}
      {filterPanelOpen && (
        <div className="glass-panel rounded-[20px] p-5 mb-8 space-y-5">
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
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.difficulty}
              </label>
              <select
                value={difficulty}
                onChange={(e) => updateParam('difficulty', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
              >
                <option value="">{t.common.all}</option>
                <option value="beginner">{t.common.beginner}</option>
                <option value="intermediate">{t.common.intermediate}</option>
                <option value="advanced">{t.common.advanced}</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.price}
              </label>
              <select
                value={priceType}
                onChange={(e) => updateParam('price', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
              >
                <option value="all">{t.marketplace.priceAll}</option>
                <option value="free">{t.marketplace.priceFree}</option>
                <option value="paid">{t.marketplace.pricePaid}</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.rating}
              </label>
              <select
                value={minRating}
                onChange={(e) => updateParam('rating', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
              >
                <option value="0">{t.common.all}</option>
                <option value="4.5">{t.marketplace.rating45}</option>
                <option value="4">{t.marketplace.rating40}</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.duration}
              </label>
              <select
                value={duration}
                onChange={(e) => updateParam('duration', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
              >
                <option value="all">{t.marketplace.durationAll}</option>
                <option value="short">{t.marketplace.durationShort}</option>
                <option value="medium">{t.marketplace.durationMedium}</option>
                <option value="long">{t.marketplace.durationLong}</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.language}
              </label>
              <select
                value={language}
                onChange={(e) => updateParam('lang', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
              >
                <option value="">{t.common.all}</option>
                <option value="en">{t.common.english}</option>
                <option value="km">{t.common.khmer}</option>
                <option value="bilingual">{t.common.bilingual}</option>
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">
                {t.common.instructor}
              </label>
              <select
                value={instructorId}
                onChange={(e) => updateParam('instructor', e.target.value)}
                className="w-full h-10 px-3 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A]"
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

      {/* 3-Column Course Grid (matching Known template) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : result.items.length === 0 ? (
        <div className="glass-card rounded-[24px] p-10 text-center space-y-3">
          <h3 className="text-[18px] font-semibold text-[#0F172A]">
            {t.marketplace.emptyTitle}
          </h3>
          <p className="text-[14px] text-[#64748B] max-w-md mx-auto">
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
  );
};
