import React from 'react';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headingId?: string;
}

/**
 * Havenline-inspired editorial page header band with Geist hairline border.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className = '',
  headingId,
}) => {
  return (
    <section
      aria-labelledby={headingId}
      className={`border-b border-[var(--border-default)] bg-[var(--bg-secondary)] ${className}`}
    >
      <div className="container-page py-8 md:py-12 space-y-4">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="max-w-2xl space-y-2.5 min-w-0">
            {eyebrow && (
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                {eyebrow}
              </p>
            )}
            <h1 id={headingId} className="text-h1 text-[var(--text-main)]">
              {title}
            </h1>
            {description && (
              <p className="text-body text-[var(--text-secondary)]">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
        {children}
      </div>
    </section>
  );
};
