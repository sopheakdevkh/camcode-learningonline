import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, BookmarkCheck, Clock, Eye, Play } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
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
      return <Badge tone="primary">{t.videos.accessPremium}</Badge>;
    }
    return <Badge tone="neutral">{t.videos.accessSubscription}</Badge>;
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = `${API_CONFIG.userAppUrl}/login`;
      return;
    }
    toggleWatchlist(video.id);
  };

  const durationPill = `${formatNumber(video.durationMinutes)} ${t.common.minutes}`;

  return (
    <Link to={`/videos/${video.slug}`} className={`block h-full ${className}`}>
      <article className="card-note group flex h-full flex-col justify-between p-5 md:p-6">
        <div>
          {/* Inset Blueprint Video Preview Frame */}
          <div className="relative h-36 w-full rounded-xl bg-[#e5dfd2]/75 dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] swiss-blueprint-bg p-3 flex flex-col justify-between overflow-hidden transition-colors duration-[0.22s] group-hover:border-[#c2baa8] dark:group-hover:border-[#3E4D45]">
            <div className="flex items-start justify-between gap-2">
              {renderAccessBadge()}
              <button
                type="button"
                onClick={handleWatchlistClick}
                title={isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
                aria-label={isSaved ? t.videos.savedWatchlist : t.videos.saveWatchlist}
                className="p-1.5 rounded-full bg-[#f6f3ec] dark:bg-[#151A17] border border-[#ded8ca] dark:border-[#2A332E] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:border-[#c2baa8] hover:!border-[#1c5b48] hover:!text-[#1c5b48] cursor-pointer"
              >
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5]" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-center my-auto">
              <span className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#1c5b48] text-white border border-[#1c5b48] group-hover:bg-[#15463a] group-hover:scale-105 transition-all duration-300 ease-[var(--x-ease)] shadow-sm">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </span>
            </div>

            <div className="flex items-center justify-end">
              <span className="font-mono-tech px-2.5 py-0.5 rounded-full bg-[#1f2622] text-[#f6f3ec] text-[10.5px] font-medium tabular-nums">
                {durationPill}
              </span>
            </div>
          </div>

          {/* Header Row: Serif Title + Mono Index */}
          <div className="mt-5 flex items-start justify-between gap-4">
            <h3 className="font-serif-display text-[21px] font-medium leading-[1.22] tracking-[-0.02em] text-[#141312] dark:text-[#f6f3ec] transition-colors duration-[0.22s] group-hover:text-[#1c5b48] dark:group-hover:text-[#7CD4B5] line-clamp-2">
              {pickText(video.title)}
            </h3>
            <span aria-hidden="true" className="index-number mt-1 shrink-0">
              {String(video.durationMinutes).padStart(2, '0')}m
            </span>
          </div>

          {/* Short Editorial Summary */}
          <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#4c4842] dark:text-[#A3ACA6] line-clamp-2">
            {pickText(video.description)}
          </p>

          {/* Rounded-full Metadata Pills (bg-surface inside bg-canvas card-note) */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {category && (
              <li>
                <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                  {pickText(category.name)}
                </span>
              </li>
            )}
            <li>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body tabular-nums transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                <Clock className="h-3 w-3 opacity-75" />
                {durationPill}
              </span>
            </li>
            <li>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-[5px] text-[12.5px] font-medium text-body tabular-nums transition-colors duration-[0.22s] group-hover:border-line-strong dark:border-[#2A332E] dark:bg-[#181E1B] dark:text-[#D5D1C8] dark:group-hover:border-[#495B51]">
                <Eye className="h-3 w-3 opacity-75" />
                {formatNumber(video.viewsCount)}
              </span>
            </li>
          </ul>
        </div>

        {/* Footer Method / Action Line */}
        <div className="mt-5 pt-4 border-t border-[#ded8ca] dark:border-[#2A332E] transition-colors duration-[0.22s] group-hover:border-[#c2baa8] dark:group-hover:border-[#3E4D45] flex items-center justify-between gap-3">
          <p className="t-method truncate">
            {instructor?.name ?? (video.accessType === 'free' ? t.common.free : 'Workshop')}
          </p>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1c5b48] dark:text-[#7CD4B5] whitespace-nowrap transition-transform duration-[0.22s] group-hover:translate-x-0.5">
            <span>{canWatch ? t.videos.watchNow : t.videos.subscribeToWatch}</span>
            <ArrowUpRight className="h-3.5 w-3.5 swiss-arrow-shift" />
          </span>
        </div>
      </article>
    </Link>
  );
};
