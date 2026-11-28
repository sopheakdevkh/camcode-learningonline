import React from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  fullWidth?: boolean;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-9 pl-3 pr-8 text-[13px]',
  md: 'h-10 pl-3 pr-9 text-[13.5px]',
  lg: 'h-11 pl-3.5 pr-9 text-[14px]',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      fullWidth = true,
      id,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    const borderStyle = error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
      : 'border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--focus-ring-soft)]';

    return (
      <div className={fullWidth ? 'w-full min-w-0' : 'inline-block min-w-0'}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={error || helperText ? messageId : undefined}
            className={`appearance-none w-full rounded-[8px] border bg-[var(--bg-main)] dark:bg-[var(--bg-elevated)] font-medium text-[var(--text-main)] outline-none transition-colors cursor-pointer disabled:bg-[var(--bg-subtle)] disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses[size]} ${borderStyle} ${className}`}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="h-4 w-4 text-[var(--text-muted)] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={messageId} role="alert" className="mt-1.5 text-[13px] font-medium text-[var(--color-error-text)]">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={messageId} className="mt-1.5 text-[13px] text-[var(--text-secondary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
