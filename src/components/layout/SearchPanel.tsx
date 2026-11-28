import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, PlayCircle, Search, X } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { catalogService } from '@/services/catalogService';
import type { Course, VideoItem } from '@/types';

interface SearchPanelProps {
  open: boolean;
  onClose: () => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ open, onClose }) => {
  const { t, pickText } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ courses: Course[]; videos: VideoItem[] }>({
    courses: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults({ courses: [], videos: [] });
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await catalogService.searchAll(trimmed);
      if (!cancelled) {
        setResults(res);
        setLoading(false);
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141312]/55 backdrop-blur-[3px] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.search}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#f6f3ec] dark:bg-[#151A17] rounded-2xl border border-[#ded8ca] dark:border-[#2A332E] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 h-14 bg-[#efebe1] dark:bg-[#181E1B] border-b border-[#ded8ca] dark:border-[#2A332E]">
          <Search className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full h-full bg-transparent text-[14px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62]/60 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.close}
            className="p-1.5 rounded-full text-[#6e6a62] hover:text-[#141312] hover:bg-[#e5dfd2] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-5">
          {loading && (
            <p className="font-mono-tech text-[12px] uppercase tracking-[0.06em] text-[#6e6a62]">
              {t.common.loading}
            </p>
          )}

          {!loading && query.trim() && results.courses.length === 0 && results.videos.length === 0 && (
            <p className="text-[14px] text-[#6e6a62] py-4 text-center">{t.common.noResults}</p>
          )}

          {!query.trim() && (
            <div className="space-y-2.5 py-1">
              <p className="swiss-eyebrow">
                <span className="swiss-dot" aria-hidden="true" />
                <span>QUICK INDEX</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {['Digital Marketing', 'React', 'Figma', 'Excel', 'AI'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="font-mono-tech px-3.5 py-1.5 rounded-full bg-[#efebe1] dark:bg-[#181E1B] border border-[#ded8ca] dark:border-[#2A332E] text-[12px] text-[#141312] dark:text-[#f6f3ec] hover:border-[#1c5b48] hover:text-[#1c5b48] cursor-pointer transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.courses.length > 0 && (
            <div>
              <p className="swiss-eyebrow mb-2">
                <span className="swiss-dot" aria-hidden="true" />
                <span>{t.nav.courses}</span>
              </p>
              <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border border-[#ded8ca] dark:border-[#2A332E] rounded-xl bg-[#efebe1] dark:bg-[#181E1B] overflow-hidden">
                {results.courses.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#e5dfd2]/60 dark:hover:bg-[#1D2420] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                      <span className="text-[14px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate">
                        {pickText(c.title)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-tech text-[12px] font-semibold tabular-nums text-[#141312] dark:text-[#f6f3ec]">
                        {c.price === 0 ? t.common.free : `$${c.price.toFixed(2)}`}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#6e6a62] group-hover:text-[#1c5b48] swiss-arrow-shift" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.videos.length > 0 && (
            <div>
              <p className="swiss-eyebrow mb-2">
                <span className="swiss-dot" aria-hidden="true" />
                <span>{t.nav.videos}</span>
              </p>
              <div className="divide-y divide-[#ded8ca] dark:divide-[#2A332E] border border-[#ded8ca] dark:border-[#2A332E] rounded-xl bg-[#efebe1] dark:bg-[#181E1B] overflow-hidden">
                {results.videos.map((v) => (
                  <Link
                    key={v.id}
                    to={`/videos/${v.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#e5dfd2]/60 dark:hover:bg-[#1D2420] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayCircle className="h-4 w-4 text-[#1c5b48] dark:text-[#7CD4B5] shrink-0" />
                      <span className="text-[14px] font-medium text-[#141312] dark:text-[#f6f3ec] truncate">
                        {pickText(v.title)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-tech text-[11px] tabular-nums text-[#6e6a62]">
                        {v.durationMinutes} {t.common.minutes}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#6e6a62] group-hover:text-[#1c5b48] swiss-arrow-shift" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
