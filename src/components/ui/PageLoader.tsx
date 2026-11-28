import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { CardSkeleton } from './Skeleton';

interface PageLoaderProps {
  compact?: boolean;
}

/**
 * Clean Geist route loading state with neutral progress bar and responsive skeleton preview cards.
 */
export const PageLoader: React.FC<PageLoaderProps> = ({ compact = false }) => {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t.common.loading}
      className="py-12 md:py-16"
    >
      <div className="container-page space-y-10">
        <div className="max-w-md mx-auto">
          <div className="geist-card rounded-[12px] p-6 text-center space-y-4">
            <div className="flex flex-col items-center gap-3">
              <span className="h-10 w-10 rounded-[8px] bg-[var(--action-primary)] text-[var(--action-primary-text)] flex items-center justify-center">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>

              <div className="space-y-1">
                <p className="text-[16px] font-semibold tracking-tight text-[var(--text-main)]">
                  {t.brand.name}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  {t.common.loading}
                </p>
              </div>

              <div className="relative w-full h-1 rounded-full bg-[var(--bg-subtle)] overflow-hidden mt-1">
                <div className="magic-loader-bar absolute inset-y-0 w-1/2 rounded-full bg-[var(--action-primary)]" />
              </div>
            </div>
          </div>
        </div>

        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <div className="hidden md:block">
              <CardSkeleton />
            </div>
            <div className="hidden lg:block">
              <CardSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
