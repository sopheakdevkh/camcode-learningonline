import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, leftAddon, rightAddon, id, className = '', ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const borderStyle = error
      ? 'border-error dark:border-red-500/80 focus-within:border-error dark:focus-within:border-red-400 focus-within:ring-2 focus-within:ring-error/20 dark:focus-within:ring-red-500/25'
      : success
        ? 'border-success dark:border-emerald-500/80 focus-within:border-success dark:focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-success/20 dark:focus-within:ring-emerald-500/25'
        : 'border-[#CBD5E1] dark:border-slate-700 hover:border-[#94A3B8] dark:hover:border-slate-500 focus-within:border-primary dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-primary/20 dark:focus-within:ring-blue-400/25';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[14px] font-medium text-secondary dark:text-slate-100 mb-1.5"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center h-11.5 rounded-[8px] border bg-white dark:bg-slate-900/90 transition-colors ${borderStyle} ${
            props.disabled ? 'bg-background dark:bg-slate-800/60 opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {leftAddon && (
            <span className="pl-3.5 text-[#475569] dark:text-slate-400 flex items-center shrink-0">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent px-3.5 text-[15px] text-secondary dark:text-slate-100 placeholder:text-muted dark:placeholder:text-slate-400 outline-none disabled:cursor-not-allowed ${className}`}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightAddon && (
            <span className="pr-3 text-[#475569] dark:text-slate-400 flex items-center shrink-0">
              {rightAddon}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-[13px] font-medium text-[#B91C1C] dark:text-red-400">{error}</p>}
        {!error && success && <p className="mt-1.5 text-[13px] font-medium text-[#15803D] dark:text-emerald-400">{success}</p>}
        {!error && !success && helperText && (
          <p className="mt-1.5 text-[13px] text-[#475569] dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

