import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white border border-transparent hover:bg-primary-hover active:bg-[#1E40AF] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
  secondary:
    'bg-secondary text-white border border-transparent hover:bg-[#1E293B] active:bg-[#334155] dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500 focus-visible:ring-2 focus-visible:ring-slate-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
  outline:
    'bg-white dark:bg-slate-900/90 text-primary-hover dark:text-blue-300 border border-[#BFDBFE] dark:border-slate-700 hover:bg-[#EFF6FF] dark:hover:bg-slate-800 hover:border-[#93C5FD] dark:hover:border-blue-500/60 active:bg-[#DBEAFE] dark:active:bg-slate-700 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-950',
  ghost:
    'bg-transparent text-primary-hover dark:text-blue-300 border border-transparent hover:bg-[#EFF6FF] dark:hover:bg-slate-800/80 active:bg-[#DBEAFE] dark:active:bg-slate-800 focus-visible:ring-2 focus-visible:ring-primary/30',
  danger:
    'bg-error text-white border border-transparent hover:bg-[#B91C1C] active:bg-[#991B1B] focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
  success:
    'bg-success text-white border border-transparent hover:bg-[#15803D] active:bg-[#166534] focus-visible:ring-2 focus-visible:ring-success/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  fullWidth = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const effectiveVariant: ButtonVariant = success ? 'success' : variant;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] font-medium transition-colors duration-150 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[effectiveVariant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : success ? (
        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && !success && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};

