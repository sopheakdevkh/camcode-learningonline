import React, { useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  inverse?: boolean;
  smallSuffix?: boolean;
  className?: string;
  durationMs?: number;
}

function getDecimalPlaces(value: number): number {
  return (String(value).split('.')[1] ?? '').length;
}

function formatNumberValue(value: number, decimals: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Havenline-style count-up number with invisible layout reservation,
 * tabular numerals, power2.out easing (1.4s), and reduced-motion support.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  inverse = false,
  smallSuffix = false,
  className = '',
  durationMs = 1400,
}) => {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const decimals = getDecimalPlaces(value);
  const formattedTarget = formatNumberValue(value, decimals);
  const useSmallSuffix = smallSuffix && /[a-z]/i.test(suffix);

  const suffixNode = useSmallSuffix ? (
    <span className="ml-[0.12em] text-[0.42em] font-medium tracking-normal">{suffix.trim()}</span>
  ) : (
    suffix
  );

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const setText = (n: number) => {
      el.textContent = formatNumberValue(n, decimals);
    };

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const rect = el.getBoundingClientRect();
    const alreadyScrolledPast = rect.bottom < 0;

    if (prefersReduced || alreadyScrolledPast || typeof window === 'undefined') {
      setText(value);
      return;
    }

    let rafId = 0;
    let started = false;

    const runAnimation = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);
        // power2.out (easeOutQuad) matching Havenline gsap power2.out
        const eased = 1 - (1 - t) * (1 - t);
        setText(value * eased);

        if (t < 1) {
          rafId = window.requestAnimationFrame(step);
        } else {
          setText(value);
        }
      };

      setText(0);
      rafId = window.requestAnimationFrame(step);
    };

    if (typeof IntersectionObserver === 'undefined') {
      runAnimation();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    // Trigger when element reaches bottom 90% of viewport ("top 90%")
    if (rect.top <= window.innerHeight * 0.9) {
      runAnimation();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    setText(0);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            runAnimation();
            break;
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value, decimals, durationMs]);

  return (
    <span
      style={inverse ? { color: '#f6f3ec' } : undefined}
      className={className}
    >
      <span
        aria-hidden="true"
        className={`inline-grid tabular-nums ${smallSuffix ? 'whitespace-nowrap' : ''}`}
      >
        <span className="invisible col-start-1 row-start-1">
          {prefix}
          {formattedTarget}
          {suffixNode}
        </span>
        <span className="col-start-1 row-start-1">
          {prefix}
          <span ref={numRef}>{formattedTarget}</span>
          {suffixNode}
        </span>
      </span>
      <span className="sr-only">
        {prefix}
        {formattedTarget}
        {suffix}
      </span>
    </span>
  );
};
