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
      ? 'border-[#a5331f] focus-within:border-[#a5331f]'
      : success
        ? 'border-[#1c5b48] focus-within:border-[#1c5b48]'
        : 'border-[#c2baa8] hover:border-[#AEA595] focus-within:border-[#1c5b48] dark:border-[#2A332E] dark:hover:border-[#5C6B63] dark:focus-within:border-[#2D7A62]';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-[13px] font-medium tracking-[0.02em] text-[#4c4842] dark:text-[#D5D1C8]"
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center h-[52px] rounded-[10px] border bg-[#f6f3ec] dark:bg-[#151A17] transition-colors duration-200 ${borderStyle} ${
            props.disabled ? 'bg-[#e5dfd2] dark:bg-[#181E1B] opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {leftAddon && (
            <span className="pl-4 text-[#6e6a62] flex items-center shrink-0">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent px-4 text-[16px] sm:text-[17px] text-[#141312] dark:text-[#f6f3ec] placeholder:text-[#6e6a62] outline-none disabled:cursor-not-allowed ${className}`}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {rightAddon && (
            <span className="pr-3 text-[#6e6a62] flex items-center shrink-0">{rightAddon}</span>
          )}
        </div>
        {error && <p className="mt-1.5 text-[12px] text-[#a5331f]">{error}</p>}
        {!error && success && <p className="mt-1.5 text-[12px] text-[#1c5b48]">{success}</p>}
        {!error && !success && helperText && (
          <p className="mt-1.5 text-[12px] text-[#6e6a62]">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
