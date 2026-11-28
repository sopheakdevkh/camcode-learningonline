import React, { useId, useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * Lightweight accessible tooltip triggered by hover or keyboard focus.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  className = '',
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  const posClass =
    side === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : 'bottom-full mb-2 left-1/2 -translate-x-1/2';

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {React.cloneElement(children, {
        'aria-describedby': open ? id : children.props['aria-describedby'],
      })}
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-[6px] bg-[var(--action-primary)] text-[var(--action-primary-text)] px-2.5 py-1 text-[12px] font-medium shadow-md ${posClass}`}
        >
          {content}
        </span>
      )}
    </span>
  );
};
