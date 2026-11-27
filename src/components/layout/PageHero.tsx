import React from 'react';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

/** Full-bleed centered Havenline editorial hero shared across catalog and information pages. */
export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  children,
}) => {
  return (
    <section className="surface-mist relative overflow-hidden border-b border-[#DFDBD2] dark:border-[#242D28] pt-[132px] pb-14 md:pt-[164px] md:pb-16">
      <span aria-hidden="true" className="deco-ring left-[-240px] top-[-320px] size-[760px]" />
      <span aria-hidden="true" className="deco-ring bottom-[-560px] right-[-340px] size-[1080px]" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-7 items-center gap-2 rounded-full border border-[#DFDBD2] dark:border-[#242D28] bg-[#efebe1] dark:bg-[#151A17] px-3.5 text-[11px] font-mono uppercase tracking-[0.14em] text-[#4c4842] dark:text-[#D5D1C8]">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-[1px] bg-[#1c5b48] dark:bg-[#7CD4B5]"
            />
            {eyebrow}
          </span>

          <h1 className="mt-5 font-serif-display text-[clamp(2.4rem,4.4vw,3.75rem)] leading-[1.06] tracking-[-0.025em] text-[#141312] dark:text-[#f6f3ec]">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-[17px] leading-[1.6] text-[#4c4842] dark:text-[#D5D1C8]">
              {description}
            </p>
          )}
        </div>

        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
};

