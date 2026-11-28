import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Accessible Geist breadcrumb navigation trail.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] flex-wrap min-w-0 ${className}`}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
            )}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-[var(--text-main)] transition-colors truncate max-w-48"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className="text-[var(--text-main)] font-medium truncate max-w-full sm:max-w-80 min-w-0"
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
