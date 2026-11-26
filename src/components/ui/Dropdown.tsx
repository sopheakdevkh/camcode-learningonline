import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownProps<T extends string = string> {
  options: DropdownOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: DropdownSize;
  align?: 'start' | 'end';
  className?: string;
  buttonClassName?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<DropdownSize, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-11 px-3.5 text-[14px]',
  lg: 'h-11.5 px-3.5 text-[15px]',
};

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  label,
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  size = 'md',
  align = 'start',
  className = '',
  buttonClassName = '',
  id,
  name,
  'aria-label': ariaLabel,
}: DropdownProps<T>) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = options.find((option) => option.value === value);
  const getEnabledIndexes = () =>
    options.reduce<number[]>((acc, option, index) => {
      if (!option.disabled) acc.push(index);
      return acc;
    }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const enabledIndexes = getEnabledIndexes();
    const selectedIndex = options.findIndex((option) => option.value === value && !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndexes[0] ?? -1);
  }, [open, value, options]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const moveActive = (direction: 1 | -1) => {
    const enabledIndexes = getEnabledIndexes();
    if (enabledIndexes.length === 0) return;
    const currentPos = enabledIndexes.indexOf(activeIndex);
    const nextPos =
      currentPos === -1
        ? direction === 1
          ? 0
          : enabledIndexes.length - 1
        : (currentPos + direction + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPos]);
  };

  const commit = (next: T) => {
    onChange?.(next);
    setOpen(false);
  };

  const borderStyle = error
    ? 'border-error dark:border-red-500/80 focus-visible:border-error dark:focus-visible:border-red-400 focus-visible:ring-2 focus-visible:ring-error/20 dark:focus-visible:ring-red-500/25'
    : open
      ? 'border-primary dark:border-blue-400 ring-2 ring-primary/20 dark:ring-blue-400/25'
      : 'border-[#CBD5E1] dark:border-slate-700 hover:border-[#94A3B8] dark:hover:border-slate-500 focus-visible:border-primary dark:focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-primary/20 dark:focus-visible:ring-blue-400/25';

  return (
    <div
      ref={rootRef}
      className={`${fullWidth ? 'w-full' : 'inline-flex flex-col'} relative ${className}`}
    >
      {label && (
        <span
          id={labelId}
          onClick={() => {
            if (!disabled) triggerRef.current?.focus();
          }}
          className="block text-[14px] font-medium text-secondary dark:text-slate-100 mb-1.5 cursor-default"
        >
          {label}
        </span>
      )}

      {name && <input type="hidden" name={name} value={value ?? ''} />}

      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={label && !ariaLabel ? `${labelId} ${triggerId}` : undefined}
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            moveActive(event.key === 'ArrowDown' ? 1 : -1);
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            const option = options[activeIndex];
            if (option && !option.disabled) commit(option.value);
          }
          if (event.key === 'Home' && open) {
            event.preventDefault();
            const enabledIndexes = getEnabledIndexes();
            if (enabledIndexes[0] !== undefined) setActiveIndex(enabledIndexes[0]);
          }
          if (event.key === 'End' && open) {
            event.preventDefault();
            const enabledIndexes = getEnabledIndexes();
            const last = enabledIndexes[enabledIndexes.length - 1];
            if (last !== undefined) setActiveIndex(last);
          }
        }}
        className={`inline-flex items-center justify-between gap-2 rounded-[8px] border bg-white dark:bg-slate-900/90 text-left font-medium text-secondary dark:text-slate-100 transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background dark:disabled:bg-slate-800/60 ${sizeClasses[size]} ${borderStyle} ${fullWidth ? 'w-full' : 'min-w-[10rem]'} ${buttonClassName}`}
      >
        <span className={`truncate ${selected ? 'text-secondary dark:text-slate-100' : 'text-muted dark:text-slate-400'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#475569] dark:text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={triggerId}
          className={`absolute z-50 mt-2 max-h-64 min-w-full overflow-auto rounded-[12px] border border-border dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 shadow-lg ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                data-index={index}
                className={`flex items-center justify-between gap-2 rounded-[8px] px-2.5 py-2 text-[13px] ${
                  option.disabled
                    ? 'cursor-not-allowed text-[#94A3B8] dark:text-slate-500'
                    : 'cursor-pointer text-secondary dark:text-slate-100'
                } ${isActive && !option.disabled ? 'bg-[#EFF6FF] dark:bg-blue-950/70' : ''} ${
                  isSelected && !isActive ? 'bg-background dark:bg-slate-800/80' : ''
                } ${!option.disabled && !isActive ? 'hover:bg-background dark:hover:bg-slate-800' : ''}`}
                onMouseEnter={() => {
                  if (!option.disabled) setActiveIndex(index);
                }}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!option.disabled) commit(option.value);
                }}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-primary dark:text-blue-400" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mt-1.5 text-[13px] font-medium text-[#B91C1C] dark:text-red-400">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-[13px] text-[#475569] dark:text-slate-400">{helperText}</p>}
    </div>
  );
}
