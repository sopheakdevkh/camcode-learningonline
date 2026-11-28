import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Play, Search } from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
import { PageHero } from '@/components/layout/PageHero';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Category, VideoItem } from '@/types';

export const VideosPage: React.FC = () => {
  const { t, pickText, formatNumber } = useI18n();
  const { hasVideoAccess } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  const [searchInput, setSearchInput] = useState(q);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    catalogService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    catalogService.listVideos({ q, category }).then((list) => {
      if (!active) return;
      setVideos(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [q, category]);

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  const featuredVideo = videos.find((v) => v.featured) ?? videos[0];
  const recommended = videos.filter((v) => v.recommended);
  const recentlyAdded = videos.filter((v) => v.recentlyAdded);
  const mostWatched = [...videos].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4);
  const trending = videos.filter((v) => v.trending);

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="VIDEO ARCHIVE & STREAMING"
        title={t.videos.title}
        description={t.videos.subtitle}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilter('q', searchInput.trim());
          }}
          className="mx-auto flex max-w-3xl flex-col items-stretch justify-between gap-3 rounded-[20px] border border-[#DFDBD2] dark:border-[#242D28] bg-[#efebe1] dark:bg-[#151A17] p-3 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 gap-2">
            <Input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === '') updateFilter('q', '');
              }}
              placeholder={t.videos.searchPlaceholder}
              leftAddon={<Search className="h-4 w-4" />}
            />
            <Button type="submit" className="h-[46px] shrink-0">
              {t.nav.search}
            </Button>
          </div>
          <div className="flex items-center justify-end gap-3 px-2">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] text-[#6e6a62] tabular-nums">
              <strong className="text-[#141312] dark:text-[#f6f3ec]">
                {String(videos.length).padStart(2, '0')}
              </strong>{' '}
              SESSIONS
            </span>
          </div>
        </form>
      </PageHero>

      <div className="surface-dots py-10 md:py-14">
      <div className="container-page space-y-10">

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#ded8ca] dark:border-[#2A332E] no-scrollbar">
        <button
          type="button"
          onClick={() => updateFilter('category', '')}
          className={`font-mono-tech px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.06em] font-medium border shrink-0 cursor-pointer transition-colors ${
            !category
              ? 'bg-[#1c5b48] text-white border-[#1c5b48] dark:bg-[#2D7A62]'
              : 'bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] hover:text-[#141312]'
          }`}
        >
          {t.common.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => updateFilter('category', cat.slug)}
            className={`font-mono-tech px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.06em] font-medium border shrink-0 cursor-pointer transition-colors ${
              category === cat.slug
                ? 'bg-[#1c5b48] text-white border-[#1c5b48] dark:bg-[#2D7A62]'
                : 'bg-[#efebe1] dark:bg-[#151A17] text-[#6e6a62] border-[#ded8ca] dark:border-[#2A332E] hover:border-[#1c5b48] hover:text-[#141312]'
            }`}
          >
            {pickText(cat.name)}
          </button>
        ))}
      </div>

      {/* Featured Content Banner */}
      {!q && !category && featuredVideo && (
        <section className="swiss-surface overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 min-h-[240px] bg-[#e5dfd2]/80 dark:bg-[#181E1B] swiss-blueprint-bg border-b lg:border-b-0 lg:border-r border-[#ded8ca] dark:border-[#2A332E] p-6 flex flex-col justify-between">
            <Badge tone="primary" className="w-fit">
              <span className="swiss-dot" aria-hidden="true" />
              {t.videos.featuredLabel}
            </Badge>
            <div className="flex items-center justify-between pt-8">
              <Link
                to={`/videos/${featuredVideo.slug}`}
                className="h-12 w-12 rounded-full bg-[#1c5b48] text-white flex items-center justify-center hover:bg-[#15463a] transition-colors shadow-sm"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </Link>
              <span className="font-mono-tech px-3 py-1 rounded-full bg-[#1C2420] text-[#f6f3ec] text-[11px] font-medium tabular-nums">
                {formatNumber(featuredVideo.durationMinutes)} {t.common.minutes}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <h2 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">
                {pickText(featuredVideo.title)}
              </h2>
              <p className="text-body text-[#6e6a62]">{pickText(featuredVideo.description)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/videos/${featuredVideo.slug}`}>
                <Button size="md" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                  {hasVideoAccess(featuredVideo)
                    ? t.videos.watchNow
                    : t.videos.subscribeToWatch}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="md">
                  {t.videos.viewPlans}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="swiss-surface p-10 text-center space-y-3">
          <p className="text-[16px] font-bold text-[#141312] dark:text-[#f6f3ec]">
            {t.common.noResults}
          </p>
          <Button variant="outline" onClick={() => setSearchParams(new URLSearchParams())}>
            {t.common.clearAll}
          </Button>
        </div>
      ) : q || category ? (
        <section className="space-y-4">
          <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
            {t.videos.allVideosTitle} ({videos.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      ) : (
        <div className="space-y-12">
          <VideoSectionRow index="01" title={t.videos.recommendedTitle} videos={recommended} />
          <VideoSectionRow index="02" title={t.videos.recentlyAddedTitle} videos={recentlyAdded} />
          <VideoSectionRow index="03" title={t.videos.mostWatchedTitle} videos={mostWatched} />
          <VideoSectionRow index="04" title={t.videos.trendingTitle} videos={trending} />
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

const VideoSectionRow: React.FC<{ index: string; title: string; videos: VideoItem[] }> = ({
  index,
  title,
  videos,
}) => {
  if (videos.length === 0) return null;
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
        <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">{title}</h2>
        <span className="font-mono-tech text-[11px] uppercase tracking-[0.08em] text-[#1c5b48] dark:text-[#7CD4B5]">
          {index}
        </span>
      </div>
      <div className="flex lg:grid lg:grid-cols-4 gap-5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar snap-x">
        {videos.slice(0, 4).map((video) => (
          <div key={video.id} className="min-w-[260px] sm:min-w-[290px] lg:min-w-0 snap-start">
            <VideoCard video={video} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
};
