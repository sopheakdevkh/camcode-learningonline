import React, { useId, useRef } from 'react';

export interface TabItem<T extends string = string> {
  value: T;
  label: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Accessible Geist segmented tab control with keyboard arrow navigation.
 */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel = 'Tabs',
  className = '',
  size = 'md',
}: TabsProps<T>) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    const enabledIndices = items.reduce<number[]>((acc, item, i) => {
      if (!item.disabled) acc.push(i);
      return acc;
    }, []);
    if (enabledIndices.length === 0) return;

    const currentPos = enabledIndices.indexOf(idx);
    let targetPos = -1;

    if (e.key === 'ArrowRight') {
      targetPos = (currentPos + 1) % enabledIndices.length;
    } else if (e.key === 'ArrowLeft') {
      targetPos = (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
    } else if (e.key === 'Home') {
      targetPos = 0;
    } else if (e.key === 'End') {
      targetPos = enabledIndices.length - 1;
    }

    if (targetPos >= 0) {
      e.preventDefault();
      const targetIndex = enabledIndices[targetPos];
      const targetItem = items[targetIndex];
      onChange(targetItem.value);
      const btn = listRef.current?.querySelector<HTMLButtonElement>(
        `[data-tab-index="${targetIndex}"]`,
      );
      btn?.focus();
    }
  };

  const sizeClass = size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-9 px-4 text-[14px]';

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex max-w-full flex-wrap items-center gap-1 p-1 rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)] ${className}`}
    >
      {items.map((item, idx) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            id={`${baseId}-tab-${item.value}`}
            data-tab-index={idx}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`inline-flex items-center justify-center gap-2 rounded-[7px] font-medium transition-colors cursor-pointer whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${
              selected
                ? 'bg-[var(--bg-main)] dark:bg-[var(--bg-elevated)] text-[var(--text-main)] border border-[var(--border-default)] shadow-xs'
                : 'text-[var(--text-secondary)] border border-transparent hover:text-[var(--text-main)]'
            }`}
          >
            <span>{item.label}</span>
            {item.badge}
          </button>
        );
      })}
    </div>
  );
}
