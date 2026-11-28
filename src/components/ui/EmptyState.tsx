import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Unified Geist empty state panel for filtered catalogs and empty lists.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => (
  <div className={`geist-card rounded-[12px] p-10 text-center space-y-3 ${className}`}>
    {icon && (
      <div className="mx-auto h-12 w-12 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-main)] flex items-center justify-center">
        {icon}
      </div>
    )}
    <h2 className="text-[18px] font-semibold text-[var(--text-main)]">{title}</h2>
    {description && (
      <p className="text-[14px] text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="pt-2 flex justify-center">{action}</div>}
  </div>
);
