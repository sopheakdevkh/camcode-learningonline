import React from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Subtle CSS fade-in entrance wrapper without blur artifacts.
 * Automatically disabled under prefers-reduced-motion.
 */
export const BlurFade: React.FC<BlurFadeProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`geist-fade-in ${className}`}
    >
      {children}
    </div>
  );
};
