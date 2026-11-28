import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  const { t } = useI18n();
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        leftIcon={<ChevronLeft className="h-4 w-4" />}
      >
        {t.common.previous}
      </Button>

      <div className="flex items-center gap-1.5">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`font-mono-tech h-9 min-w-9 px-3 rounded-full text-[12px] font-medium tabular-nums transition-colors cursor-pointer border ${
              p === page
                ? 'bg-[#1c5b48] text-white border-[#1c5b48] dark:bg-[#2D7A62] dark:border-[#2D7A62]'
                : 'bg-[#efebe1] text-[#141312] border-[#ded8ca] hover:border-[#1c5b48] dark:bg-[#151A17] dark:text-[#f6f3ec] dark:border-[#2A332E]'
            }`}
          >
            {String(p).padStart(2, '0')}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        {t.common.next}
      </Button>
    </nav>
  );
};
