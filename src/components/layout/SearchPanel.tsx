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
      className="fixed inset-0 z-50 bg-[#0F172A]/45 backdrop-blur-[2px] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.search}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[12px] border border-[#E2E8F0] shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-[#E2E8F0]">
          <Search className="h-5 w-5 text-[#64748B] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full h-full text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.close}
            className="p-1.5 rounded-[8px] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-5">
          {loading && <p className="text-[14px] text-[#64748B]">{t.common.loading}</p>}

          {!loading && query.trim() && results.courses.length === 0 && results.videos.length === 0 && (
            <p className="text-[14px] text-[#64748B] py-4 text-center">{t.common.noResults}</p>
          )}

          {!query.trim() && (
            <div className="flex flex-wrap gap-2 py-2">
              {['Digital Marketing', 'React', 'Figma', 'Excel', 'AI'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {results.courses.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                {t.nav.courses}
              </p>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-[8px]">
                {results.courses.map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F8FAFC]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 text-[#2563EB] shrink-0" />
                      <span className="text-[14px] font-medium text-[#0F172A] truncate">
                        {pickText(c.title)}
                      </span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#0F172A] shrink-0">
                      {c.price === 0 ? t.common.free : `$${c.price.toFixed(2)}`}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.videos.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#64748B] mb-2">
                {t.nav.videos}
              </p>
              <div className="divide-y divide-[#E2E8F0] border border-[#E2E8F0] rounded-[8px]">
                {results.videos.map((v) => (
                  <Link
                    key={v.id}
                    to={`/videos/${v.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-[#F8FAFC]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <PlayCircle className="h-4 w-4 text-[#0891B2] shrink-0" />
                      <span className="text-[14px] font-medium text-[#0F172A] truncate">
                        {pickText(v.title)}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#64748B] shrink-0">
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

