import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: 'up' | 'left' | 'right' | 'scale';
}

const hiddenVariantClass: Record<NonNullable<ScrollRevealProps['variant']>, string> = {
  up: 'reveal-hidden-up',
  left: 'reveal-hidden-left',
  right: 'reveal-hidden-right',
  scale: 'reveal-hidden-scale',
};

/**
 * Scroll-triggered reveal wrapper using IntersectionObserver.
 * Keeps content visible during SSR and respects prefers-reduced-motion.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  variant = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'visible'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setState('visible');
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setState('visible');
      return;
    }

    setState('hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setState('visible');
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealClass =
    state === 'hidden'
      ? `reveal-section ${hiddenVariantClass[variant]}`
      : 'reveal-section reveal-visible';

  return (
    <div
      ref={ref}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`${revealClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
}

/**
 * Counts up smoothly when scrolled into view; renders final value on SSR or reduced motion.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  suffix = '',
  decimals = 0,
  durationMs = 950,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || hasAnimated.current) return;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setDisplayValue(target);
      return;
    }

    const startAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(target * eased);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(target);
        }
      };

      requestAnimationFrame(step);
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-US');

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
};
