import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bookmark, BookmarkCheck, Clock, Eye, Play } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { VideoItem } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface VideoCardProps {
  video: VideoItem;
  className?: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, className = '' }) => {
  const { pickText, t, formatNumber } = useI18n();
  const { user, isAuthenticated, hasVideoAccess, toggleWatchlist } = useAuth();
  const navigate = useNavigate();

  const instructor = catalogService.getInstructorById(video.instructorId);
  const category = catalogService.getCategoryBySlug(video.categorySlug);
  const canWatch = hasVideoAccess(video);
  const isSaved = Boolean(user?.watchlistVideoIds.includes(video.id));

  const renderAccessBadge = () => {
    if (video.accessType === 'free') {
      return <Badge tone="success">{t.videos.accessFree}</Badge>;
    }
    if (canWatch) {
      return <Badge tone="info">{t.videos.accessIncluded}</Badge>;
    }
    if (video.accessType === 'premium') {
      return <Badge tone="warning">{t.videos.accessPremium}</Badge>;
    }
    return <Badge tone="primary">{t.videos.accessSubscription}</Badge>;
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/videos/${video.slug}` } });
      return;
    }
    toggleWatchlist(video.id);
  };

  return (
    <Link
      to={`/videos/${video.slug}`}
      className={`group glass-card flex flex-col rounded-[16px] overflow-hidden ${className}`}
    >
      {/* Inset Rounded Thumbnail */}
      <div className="p-3.5 pb-0">
        <div
          className={`relative h-40 w-full rounded-[12px] bg-gradient-to-br ${video.thumbnailTheme} border border-white/80 p-3 flex flex-col justify-between overflow-hidden`}
        >
          <div className="flex items-start justify-between gap-2">
            {renderAccessBadge()}
            <button
              type="button"
              onClick={handleWatchlistClick}
              title={isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
              aria-label={isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
              className="p-1.5 rounded-[8px] bg-white/90 border border-[#E2E8F0] text-[#0F172A] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-[#2563EB]" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center my-auto">
            <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-white/95 border border-white text-[#2563EB] shadow-sm group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </span>
          </div>

          <div className="flex items-center justify-end">
            <span className="px-2 py-0.5 rounded-[6px] bg-[#0F172A]/80 text-white text-[11px] font-medium">
              {formatNumber(video.durationMinutes)} {t.common.minutes}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[12px] text-[#64748B] truncate">
            {instructor?.name}
            {category ? ` · ${pickText(category.name)}` : ''}
          </p>
          <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug min-h-[42px]">
            {pickText(video.title)}
          </h3>
          <div className="flex items-center gap-4 text-[12px] text-[#64748B] pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
              {formatNumber(video.durationMinutes)} {t.common.minutes}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-[#94A3B8]" />
              {formatNumber(video.viewsCount)}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between gap-2">
          <span
            className={`text-[13px] font-bold ${
              video.accessType === 'free' ? 'text-[#E11D48]' : 'text-[#0F172A]'
            }`}
          >
            {video.accessType === 'free'
              ? t.common.free
              : video.accessType === 'premium'
                ? 'Premium'
                : 'Member'}
          </span>
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[#2563EB] group-hover:bg-[#1D4ED8] text-white text-[12px] font-medium transition-colors">
            <ArrowRight className="h-3.5 w-3.5" />
            <span>{canWatch ? t.videos.watchNow : t.videos.subscribeToWatch}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
