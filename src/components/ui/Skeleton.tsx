import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#ded8ca]/75 dark:bg-[#2A332E] rounded-lg ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="bg-[#efebe1] dark:bg-[#151A17] rounded-xl border border-[#ded8ca] dark:border-[#2A332E] overflow-hidden p-5 space-y-4">
    <Skeleton className="h-40 w-full rounded-lg" />
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="h-5 w-4/5" />
    <Skeleton className="h-4 w-1/2" />
    <div className="pt-3 border-t border-[#ded8ca] dark:border-[#2A332E] flex justify-between items-center">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  </div>
);
