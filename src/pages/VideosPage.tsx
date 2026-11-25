import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Play, Search, Sparkles } from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
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
    <div className="container-page py-8 md:py-12 space-y-10">
      {/* Page Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 text-[#0F172A]">{t.videos.title}</h1>
          <p className="text-body text-[#64748B] mt-1">{t.videos.subtitle}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilter('q', searchInput.trim());
          }}
          className="w-full md:w-96 flex gap-2"
        >
          <Input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (e.target.value === '') updateFilter('q', '');
            }}
            placeholder={t.videos.searchPlaceholder}
            leftAddon={<Search className="h-4 w-4" />}
          />
          <Button type="submit" className="h-[46px]">
            {t.nav.search}
          </Button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => updateFilter('category', '')}
          className={`px-3.5 py-2 rounded-full text-[13px] font-medium border shrink-0 cursor-pointer transition-colors ${
            !category
              ? 'bg-[#2563EB] text-white border-[#2563EB]'
              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#2563EB]'
          }`}
        >
          {t.common.all}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => updateFilter('category', cat.slug)}
            className={`px-3.5 py-2 rounded-full text-[13px] font-medium border shrink-0 cursor-pointer transition-colors ${
              category === cat.slug
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#2563EB]'
            }`}
          >
            {pickText(cat.name)}
          </button>
        ))}
      </div>

      {/* Featured Content Banner */}
      {!q && !category && featuredVideo && (
        <section className="glass-panel rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div
            className={`lg:col-span-5 min-h-[220px] bg-gradient-to-br ${featuredVideo.thumbnailTheme} border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-6 flex flex-col justify-between`}
          >
            <Badge tone="primary" className="w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              {t.videos.featuredLabel}
            </Badge>
            <div className="flex items-center justify-between pt-8">
              <Link
                to={`/videos/${featuredVideo.slug}`}
                className="h-12 w-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </Link>
              <span className="px-2.5 py-1 rounded-[8px] bg-[#0F172A]/85 text-white text-[12px] font-medium">
                {formatNumber(featuredVideo.durationMinutes)} {t.common.minutes}
              </span>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between gap-5">
            <div className="space-y-2.5">
              <h2 className="text-h2 text-[#0F172A]">{pickText(featuredVideo.title)}</h2>
              <p className="text-body text-[#64748B]">{pickText(featuredVideo.description)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/videos/${featuredVideo.slug}`}>
                <Button size="md">
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
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-10 text-center space-y-3">
          <p className="text-[16px] font-semibold text-[#0F172A]">{t.common.noResults}</p>
          <Button variant="outline" onClick={() => setSearchParams(new URLSearchParams())}>
            {t.common.clearAll}
          </Button>
        </div>
      ) : q || category ? (
        /* Filtered 4-column Grid */
        <section className="space-y-4">
          <h2 className="text-h3 text-[#0F172A]">
            {t.videos.allVideosTitle} ({videos.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      ) : (
        /* Discovery Sections matching PUB-04 spec */
        <div className="space-y-12">
          <VideoSectionRow title={t.videos.recommendedTitle} videos={recommended} />
          <VideoSectionRow title={t.videos.recentlyAddedTitle} videos={recentlyAdded} />
          <VideoSectionRow title={t.videos.mostWatchedTitle} videos={mostWatched} />
          <VideoSectionRow title={t.videos.trendingTitle} videos={trending} />
        </div>
      )}
    </div>
  );
};

const VideoSectionRow: React.FC<{ title: string; videos: VideoItem[] }> = ({ title, videos }) => {
  if (videos.length === 0) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-h3 text-[#0F172A]">{title}</h2>
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

