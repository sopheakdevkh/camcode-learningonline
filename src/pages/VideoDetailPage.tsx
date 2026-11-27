import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Calendar,
  ChevronRight,
  Clock,
  Lock,
  Play,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import { VideoCard } from '@/components/cards/VideoCard';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { VideoItem } from '@/types';

export const VideoDetailPage: React.FC = () => {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const { t, pickText, formatNumber } = useI18n();
  const { user, isAuthenticated, hasVideoAccess, toggleWatchlist } = useAuth();

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [related, setRelated] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setIsPlaying(false);
    catalogService.getVideoBySlug(slug).then(async (found) => {
      if (!active) return;
      setVideo(found);
      if (found) {
        const rel = await catalogService.getRelatedVideos(found);
        if (active) setRelated(rel);
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
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="surface-mist min-h-screen">
        <div className="container-page pt-[140px] pb-16 text-center space-y-4">
          <h1 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">{t.common.noResults}</h1>
          <Link to="/videos">
            <Button variant="outline">{t.common.back}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const instructor = catalogService.getInstructorById(video.instructorId);
  const category = catalogService.getCategoryBySlug(video.categorySlug);
  const canWatch = hasVideoAccess(video);
  const isSaved = Boolean(user?.watchlistVideoIds.includes(video.id));

  // CTA states matching PUB-05 table
  const getAccessCta = () => {
    if (canWatch) {
      return {
        label: t.videos.watchNow,
        action: () => setIsPlaying(true),
        variant: 'primary' as const,
      };
    }
    if (video.accessType === 'premium') {
      return {
        label: t.videos.viewPlans,
        action: () => navigate('/pricing'),
        variant: 'primary' as const,
      };
    }
    return {
      label: t.videos.subscribeToWatch,
      action: () => navigate('/checkout?type=subscription&plan=basic&billing=monthly'),
      variant: 'primary' as const,
    };
  };

  const accessCta = getAccessCta();

  const accessBadge = () => {
    if (video.accessType === 'free') return <Badge tone="success">{t.videos.accessFree}</Badge>;
    if (canWatch) return <Badge tone="info">{t.videos.accessIncluded}</Badge>;
    if (video.accessType === 'premium') {
      return <Badge tone="primary">{t.videos.accessPremium}</Badge>;
    }
    return <Badge tone="neutral">{t.videos.accessSubscription}</Badge>;
  };

  const handleSaveWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/videos/${video.slug}` } });
      return;
    }
    toggleWatchlist(video.id);
  };

  return (
    <div className="surface-mist relative overflow-hidden min-h-screen">
      <span aria-hidden="true" className="deco-ring left-[-240px] top-[-320px] size-[720px]" />
      <span aria-hidden="true" className="deco-ring right-[-320px] top-[-220px] size-[640px]" />
      <div className="relative container-page pt-[124px] pb-14 md:pt-[140px] md:pb-16 space-y-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="font-mono-tech flex items-center gap-2 text-[11px] uppercase tracking-[0.06em] text-[#6e6a62]"
      >
        <Link to="/videos" className="hover:text-[#1c5b48]">
          {t.nav.videos}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#141312] dark:text-[#f6f3ec] font-semibold truncate">
          {pickText(video.title)}
        </span>
      </nav>

      {/* Video Player / Thumbnail Preview */}
      <div className="swiss-surface overflow-hidden">
        {isPlaying && canWatch ? (
          <div className="aspect-video bg-[#1C2420] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
            <PlayCircle className="h-14 w-14 text-[#7CD4B5]" />
            <div className="space-y-1 max-w-lg">
              <h2 className="font-serif-display text-[22px] font-medium">{pickText(video.title)}</h2>
              <p className="font-mono-tech text-[12px] text-[#A3ACA6]">{t.videos.playerNotice}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)}>
              {t.nav.close}
            </Button>
          </div>
        ) : (
          <div className="aspect-video max-h-[460px] w-full bg-[#e5dfd2]/80 dark:bg-[#181E1B] swiss-blueprint-bg border-b border-[#ded8ca] dark:border-[#2A332E] p-6 flex flex-col items-center justify-center text-center relative">
            <div className="absolute top-4 left-4">{accessBadge()}</div>
            <div className="max-w-md space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-[#1c5b48] border border-[#1c5b48] flex items-center justify-center text-white shadow-md">
                {canWatch ? (
                  <Play className="h-7 w-7 fill-current ml-0.5" />
                ) : (
                  <Lock className="h-6 w-6 text-[#A7E8CE]" />
                )}
              </div>
              {!canWatch && (
                <div className="bg-[#efebe1] dark:bg-[#151A17] rounded-xl border border-[#ded8ca] dark:border-[#2A332E] p-4 space-y-1.5 shadow-sm">
                  <p className="text-[15px] font-bold text-[#141312] dark:text-[#f6f3ec]">
                    {t.videos.restrictedPromptTitle}
                  </p>
                  <p className="text-[13px] text-[#6e6a62]">{t.videos.restrictedPromptDesc}</p>
                </div>
              )}
              <Button
                size="lg"
                rightIcon={<ArrowUpRight className="h-4 w-4" />}
                onClick={accessCta.action}
              >
                {accessCta.label}
              </Button>
            </div>
          </div>
        )}

        {/* Metadata & Description */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {category && <Badge tone="neutral">{pickText(category.name)}</Badge>}
                {accessBadge()}
              </div>
              <h1 className="text-h2 text-[#141312] dark:text-[#f6f3ec]">
                {pickText(video.title)}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button
                rightIcon={<ArrowUpRight className="h-4 w-4" />}
                onClick={accessCta.action}
              >
                {accessCta.label}
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveWatchlist}
                leftIcon={
                  isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )
                }
              >
                {isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-tech text-[12px] tabular-nums text-[#6e6a62] pb-5 border-b border-[#ded8ca] dark:border-[#2A332E]">
            {instructor && (
              <span>
                {t.common.by}{' '}
                <strong className="text-[#141312] dark:text-[#f6f3ec]">{instructor.name}</strong>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatNumber(video.durationMinutes)} {t.common.minutes}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {t.videos.publishedOn}: {video.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1c5b48] dark:text-[#7CD4B5]" />
              {t.videos.accessRequirement}:{' '}
              {video.accessType === 'free'
                ? t.videos.accessFree
                : video.accessType === 'premium'
                  ? 'Premium Plan'
                  : 'Basic or Premium Plan'}
            </span>
          </div>

          <p className="text-body text-[#6e6a62] max-w-3xl">{pickText(video.description)}</p>

          {!isAuthenticated && (
            <Alert tone="info">
              {t.videos.authWatchlistNotice}{' '}
              <Link
                to="/login"
                state={{ from: `/videos/${video.slug}` }}
                className="font-semibold underline ml-1"
              >
                {t.nav.login}
              </Link>
            </Alert>
          )}
        </div>
      </div>

      {/* Related Videos */}
      {related.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ded8ca] dark:border-[#2A332E]">
            <h2 className="text-h3 text-[#141312] dark:text-[#f6f3ec]">
              {t.videos.relatedVideos}
            </h2>
            <span className="swiss-eyebrow">
              <span className="swiss-dot" aria-hidden="true" />
              <span>RELATED</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
};
