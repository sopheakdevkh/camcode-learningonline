import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, rows = 4, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const messageId = `${textareaId}-message`;

    const borderStyle = error
      ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
      : 'border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--focus-ring-soft)]';

    return (
      <div className="w-full min-w-0">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[14px] font-medium text-[var(--text-main)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
          className={`w-full p-3.5 rounded-[8px] border bg-[var(--bg-main)] dark:bg-[var(--bg-elevated)] text-[15px] text-[var(--text-main)] placeholder:text-[var(--text-muted)] outline-none transition-colors disabled:bg-[var(--bg-subtle)] disabled:opacity-70 disabled:cursor-not-allowed ${borderStyle} ${className}`}
          {...props}
        />
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

Textarea.displayName = 'Textarea';
