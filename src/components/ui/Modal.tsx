import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-2xl',
}) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    }, 0);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialog) {
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={!title ? 'Modal dialog' : undefined}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`w-full ${maxWidthClass} bg-white dark:bg-slate-900 rounded-[12px] border border-border dark:border-slate-700/70 shadow-lg overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-slate-700/70">
          <h3 id={titleId} className="text-[18px] font-semibold text-secondary dark:text-slate-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="h-10 w-10 inline-flex items-center justify-center rounded-[8px] text-muted hover:text-secondary dark:hover:text-slate-100 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

