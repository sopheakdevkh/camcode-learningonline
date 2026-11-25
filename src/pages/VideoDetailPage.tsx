import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
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
      <div className="container-page py-10 space-y-6">
        <Skeleton className="h-[360px] w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container-page py-16 text-center space-y-4">
        <h1 className="text-h2 text-[#0F172A]">{t.common.noResults}</h1>
        <Link to="/videos">
          <Button variant="outline">{t.common.back}</Button>
        </Link>
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
      return <Badge tone="warning">{t.videos.accessPremium}</Badge>;
    }
    return <Badge tone="primary">{t.videos.accessSubscription}</Badge>;
  };

  const handleSaveWatchlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/videos/${video.slug}` } });
      return;
    }
    toggleWatchlist(video.id);
  };

  return (
    <div className="container-page py-8 md:py-12 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#64748B]">
        <Link to="/videos" className="hover:text-[#2563EB]">
          {t.nav.videos}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[#0F172A] font-medium truncate">{pickText(video.title)}</span>
      </nav>

      {/* Video Player / Thumbnail Preview */}
      <div className="glass-panel rounded-[28px] overflow-hidden">
        {isPlaying && canWatch ? (
          <div className="aspect-video bg-[#0F172A] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
            <PlayCircle className="h-14 w-14 text-[#60A5FA]" />
            <div className="space-y-1 max-w-lg">
              <h2 className="text-[20px] font-semibold">{pickText(video.title)}</h2>
              <p className="text-[13px] text-[#94A3B8]">{t.videos.playerNotice}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(false)}>
              {t.nav.close}
            </Button>
          </div>
        ) : (
          <div
            className={`aspect-video max-h-[460px] w-full bg-gradient-to-br ${video.thumbnailTheme} border-b border-[#E2E8F0] p-6 flex flex-col items-center justify-center text-center relative`}
          >
            <div className="absolute top-4 left-4">{accessBadge()}</div>
            <div className="max-w-md space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB]">
                {canWatch ? (
                  <Play className="h-7 w-7 fill-current ml-0.5" />
                ) : (
                  <Lock className="h-6 w-6 text-[#D97706]" />
                )}
              </div>
              {!canWatch && (
                <div className="bg-white/95 rounded-[12px] border border-[#E2E8F0] p-4 space-y-2">
                  <p className="text-[15px] font-semibold text-[#0F172A]">
                    {t.videos.restrictedPromptTitle}
                  </p>
                  <p className="text-[13px] text-[#64748B]">{t.videos.restrictedPromptDesc}</p>
                </div>
              )}
              <Button size="lg" onClick={accessCta.action}>
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
              <h1 className="text-h2 text-[#0F172A]">{pickText(video.title)}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Button onClick={accessCta.action}>{accessCta.label}</Button>
              <Button
                variant="outline"
                onClick={handleSaveWatchlist}
                leftIcon={
                  isSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-[#2563EB]" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )
                }
              >
                {isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#64748B] pb-5 border-b border-[#E2E8F0]">
            {instructor && (
              <span>
                {t.common.by} <strong className="text-[#0F172A]">{instructor.name}</strong>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatNumber(video.durationMinutes)} {t.common.minutes}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {t.videos.publishedOn}: {video.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#0891B2]" />
              {t.videos.accessRequirement}:{' '}
              {video.accessType === 'free'
                ? t.videos.accessFree
                : video.accessType === 'premium'
                  ? 'Premium Plan'
                  : 'Basic or Premium Plan'}
            </span>
          </div>

          <p className="text-body text-[#475569] max-w-3xl">{pickText(video.description)}</p>

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
        <section className="space-y-4">
          <h2 className="text-h3 text-[#0F172A]">{t.videos.relatedVideos}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

