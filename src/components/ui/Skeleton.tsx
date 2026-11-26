import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-border/70 dark:bg-slate-700/50 rounded-[8px] ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-900/90 rounded-[12px] border border-border dark:border-slate-700/70 overflow-hidden p-4 space-y-3">
    <Skeleton className="h-40 w-full rounded-[8px]" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-5 w-4/5" />
    <Skeleton className="h-4 w-1/2" />
    <div className="pt-2 flex justify-between">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

