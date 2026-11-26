import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, Search, X } from 'lucide-react';
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
      className="fixed inset-0 z-50 bg-secondary/50 dark:bg-black/70 backdrop-blur-[2px] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.search}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[12px] border border-border dark:border-slate-700/80 shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border dark:border-slate-800">
          <Search className="h-5 w-5 text-[#475569] dark:text-slate-400 shrink-0" />
          <input
            id="search-panel-input"
            name="searchQuery"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full h-full bg-transparent text-[15px] text-secondary dark:text-slate-100 placeholder:text-muted dark:placeholder:text-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.close}
            className="p-1.5 rounded-[8px] text-[#475569] dark:text-slate-400 hover:text-secondary dark:hover:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-5">
          {loading && <p className="text-[14px] text-muted">{t.common.loading}</p>}

          {!loading && query.trim() && results.courses.length === 0 && results.videos.length === 0 && (
            <p className="text-[14px] text-muted py-4 text-center">{t.common.noResults}</p>
          )}

          {!query.trim() && (
            <div className="flex flex-wrap gap-2 py-2">
              {['Digital Marketing', 'React', 'Figma', 'Excel', 'AI'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 text-[13px] text-secondary dark:text-slate-200 hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {results.courses.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted mb-2">
                {t.nav.courses}
              </p>
              <div className="divide-y divide-border dark:divide-slate-800 border border-border dark:border-slate-700/80 rounded-[8px]">
                {results.courses.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-background dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-[14px] font-medium text-secondary truncate">
                        {pickText(c.title)}
                      </span>
                    </div>
                    <span className="text-[13px] font-semibold text-secondary shrink-0">
                      {c.price === 0 ? t.common.free : `$${c.price.toFixed(2)}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.videos.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted mb-2">
                {t.nav.videos}
              </p>
              <div className="divide-y divide-border dark:divide-slate-800 border border-border dark:border-slate-700/80 rounded-[8px]">
                {results.videos.map((v) => (
                  <Link
                    key={v.id}
                    to={`/videos/${v.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-background dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayCircle className="h-4 w-4 text-info shrink-0" />
                      <span className="text-[14px] font-medium text-secondary truncate">
                        {pickText(v.title)}
                      </span>
                    </div>
                    <span className="text-[12px] text-muted shrink-0">
                      {v.durationMinutes} {t.common.minutes}
                    </span>
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

