import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/i18n/I18nContext';
import type { Course, VideoItem } from '@/types';

export interface FlowNodeItem {
  id: string;
  label: string;
  flagged?: boolean;
}

interface HavenlineProblemDiagramProps {
  nodes: FlowNodeItem[];
  caption: string;
}

/**
 * Atlas Grocers "The problem" 5-node connected diagnostic flow card.
 */
export const HavenlineProblemDiagram: React.FC<HavenlineProblemDiagramProps> = ({
  nodes,
  caption,
}) => {
  const topNodes = nodes.slice(0, 3);
  const bottomNodes = nodes.slice(3, 5);

  const renderNode = (node: FlowNodeItem) => (
    <div
      key={node.id}
      className="relative rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-default)] px-3 py-2.5 text-center shadow-[var(--card-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      {node.flagged && (
        <span
          aria-hidden="true"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] flex items-center justify-center shadow-xs"
        >
          <Lock className="h-2.5 w-2.5" />
        </span>
      )}
      <span className="text-[11.5px] sm:text-[12px] font-medium text-[var(--text-main)] leading-snug block truncate">
        {node.label}
      </span>
    </div>
  );

  return (
    <div className="rounded-[20px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-5 sm:p-7 relative overflow-hidden">
      <div className="relative space-y-5">
        {/* Top row of 3 connected nodes */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {topNodes.map((node, idx) => (
            <div key={node.id} className="relative">
              {renderNode(node)}
              {idx < topNodes.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[var(--text-muted)] z-10"
                />
              )}
            </div>
          ))}
        </div>

        {/* Animated flow connector line */}
        <svg
          viewBox="0 0 400 28"
          className="hidden sm:block w-full h-7 text-[var(--border-hover)]"
          aria-hidden="true"
        >
          <path
            d="M 70 2 L 70 14 L 320 14 L 320 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="havenline-flow-dash"
          />
          <circle cx="195" cy="14" r="3" fill="var(--action-primary)" />
        </svg>

        {/* Bottom row of 2 nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:max-w-[78%] mx-auto">
          {bottomNodes.map((node) => renderNode(node))}
        </div>
      </div>

      <p className="mt-5 text-[12px] text-[var(--text-muted)] text-center flex items-center justify-center gap-1.5">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{caption}</span>
      </p>
    </div>
  );
};

export interface StageItem {
  id: string;
  code: string;
  title: string;
  meta: string;
}

interface HavenlineStagesPanelProps {
  stages: StageItem[];
  caption: string;
  onStageSelect?: (stage: StageItem) => void;
}

/**
 * Atlas Grocers "What we changed" 3-row interactive stage stack in a grid-textured panel.
 */
export const HavenlineStagesPanel: React.FC<HavenlineStagesPanelProps> = ({
  stages,
  caption,
  onStageSelect,
}) => {
  const [activeId, setActiveId] = useState<string>(stages[0]?.id ?? '');

  return (
    <div className="rounded-[20px] bg-[var(--bg-secondary)] havenline-grid-surface border border-[var(--border-default)] p-5 sm:p-7">
      <div className="space-y-3">
        {stages.map((stage) => {
          const isSelected = activeId === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setActiveId(stage.id);
                onStageSelect?.(stage);
              }}
              className={`w-full text-left rounded-[12px] px-4 py-3.5 border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-[var(--bg-elevated)] border-[var(--action-primary)] shadow-[var(--card-shadow-hover)] translate-x-0.5'
                  : 'bg-[var(--bg-elevated)]/95 border-[var(--border-default)] shadow-[var(--card-shadow)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`h-7 w-7 rounded-[7px] font-mono-custom text-[11px] font-semibold flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[var(--action-primary)] text-[var(--action-primary-text)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {stage.code}
                </span>
                <span className="text-[13.5px] font-medium text-[var(--text-main)] truncate">
                  {stage.title}
                </span>
              </div>
              <span className="text-[11.5px] font-mono-custom text-[var(--text-muted)] shrink-0 inline-flex items-center gap-1">
                <span>{stage.meta}</span>
                {isSelected && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-[var(--action-primary)]"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[12px] text-[var(--text-muted)] text-center">{caption}</p>
    </div>
  );
};

export interface HavenlineTestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  badgeText: string;
}

interface HavenlineTestimonialBandProps {
  items: HavenlineTestimonialItem[];
}

/**
 * Atlas Grocers subtle grid-textured horizontal testimonial carousel band.
 */
export const HavenlineTestimonialBand: React.FC<HavenlineTestimonialBandProps> = ({ items }) => {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const safeIndex = index % items.length;
  const active = items[safeIndex];
  const nextItem = items[(safeIndex + 1) % items.length];

  const cycle = (dir: -1 | 1) => {
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <section className="bg-[var(--bg-secondary)] havenline-grid-surface border-y border-[var(--border-default)] py-12 md:py-16">
      <div className="container-page space-y-6">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Active Quote Card */}
            <div className="lg:col-span-8 rounded-[20px] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-[var(--panel-shadow)] flex flex-col justify-between gap-6">
              <blockquote className="font-serif-editorial text-[20px] sm:text-[24px] lg:text-[26px] leading-[1.38] text-[var(--text-main)] font-normal">
                “{active.quote}”
              </blockquote>

              <div className="pt-4 border-t border-[var(--border-default)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-10 w-10 rounded-full bg-[var(--bg-sage)] text-[var(--action-primary)] font-serif-editorial text-[14px] font-semibold flex items-center justify-center shrink-0">
                    {active.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--text-main)] truncate">
                      {active.name}
                    </p>
                    <p className="text-[12.5px] text-[var(--text-muted)] truncate">{active.role}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-sage)] text-[var(--action-primary)] dark:text-[#6EE7B7] font-mono-custom text-[11.5px] font-semibold shrink-0">
                  {active.badgeText}
                </span>
              </div>
            </div>

            {/* Peeking Next Card (Desktop) */}
            {items.length > 1 && (
              <div
                aria-hidden="true"
                className="hidden lg:flex lg:col-span-4 rounded-[20px] bg-[var(--bg-elevated)]/65 border border-[var(--border-default)] p-6 flex-col justify-between gap-6 opacity-60 overflow-hidden"
              >
                <p className="font-serif-editorial text-[19px] leading-[1.4] text-[var(--text-secondary)] line-clamp-3">
                  “{nextItem.quote}”
                </p>
                <div className="pt-4 border-t border-[var(--border-default)] flex items-center gap-3">
                  <span className="h-9 w-9 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] font-serif-editorial text-[13px] flex items-center justify-center shrink-0">
                    {nextItem.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--text-main)] truncate">
                      {nextItem.name}
                    </p>
                    <p className="text-[12px] text-[var(--text-muted)] truncate">{nextItem.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Carousel Counter & Navigation Arrows */}
        {items.length > 1 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12.5px] font-mono-custom tabular-nums text-[var(--text-muted)]">
              {safeIndex + 1} {t.common.of} {items.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => cycle(-1)}
                aria-label={t.common.previous}
                className="h-9 w-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-main)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-subtle)] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => cycle(1)}
                aria-label={t.common.next}
                className="h-9 w-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-main)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-subtle)] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

interface HavenlineLibraryShowcaseProps {
  title: string;
  subtitle: string;
  courses: Course[];
  videos: VideoItem[];
  totalCount: number;
  badgeSublabel: string;
  ctaHref?: string;
}

/**
 * Atlas Grocers "Other things we have moved" 2-row showcase grid with center circular floating badge,
 * wired 100% to live courses and streaming video library items.
 */
export const HavenlineLibraryShowcase: React.FC<HavenlineLibraryShowcaseProps> = ({
  title,
  subtitle,
  courses,
  videos,
  totalCount,
  badgeSublabel,
  ctaHref = '/courses',
}) => {
  const { pickText, t, formatCurrency, formatNumber } = useI18n();

  const items = [
    ...courses.slice(0, 9).map((c) => ({
      id: c.id,
      to: `/courses/${c.slug}`,
      pill: c.thumbnailLabel,
      title: pickText(c.title),
      meta: `${formatNumber(c.lessonsCount)} ${t.common.lessons} · ${
        c.price === 0 ? t.common.free : formatCurrency(c.price)
      }`,
      kind: 'course' as const,
    })),
    ...videos.slice(0, 3).map((v) => ({
      id: v.id,
      to: `/videos/${v.slug}`,
      pill: `${formatNumber(v.durationMinutes)} ${t.common.minutes} · VIDEO`,
      title: pickText(v.title),
      meta: `${formatNumber(v.viewsCount)} ${t.common.views}`,
      kind: 'video' as const,
    })),
  ].slice(0, 12);

  if (items.length === 0) return null;

  return (
    <section className="container-page py-14 md:py-20 space-y-8">
      <ScrollReveal>
        <div className="max-w-xl space-y-2">
          <h2 className="font-serif-editorial text-h1 text-[var(--text-main)] font-normal">
            {title}
          </h2>
          <p className="text-[14.5px] text-[var(--text-secondary)] leading-relaxed">{subtitle}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delayMs={70}>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {items.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="group geist-card geist-card-hover rounded-[14px] p-2.5 flex flex-col gap-2.5"
              >
                <div className="aspect-[16/10] rounded-[10px] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center px-2 overflow-hidden relative">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[10px] font-mono-custom font-medium text-[var(--text-main)] max-w-full truncate">
                    {item.kind === 'video' ? (
                      <PlayCircle
                        className="h-3 w-3 text-[var(--action-primary)] shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <BookOpen
                        className="h-3 w-3 text-[var(--action-primary)] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate">{item.pill}</span>
                  </span>
                </div>
                <div className="px-0.5 space-y-0.5 min-w-0">
                  <p className="text-[12.5px] font-semibold text-[var(--text-main)] group-hover:text-[var(--action-primary)] transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] font-mono-custom text-[var(--text-muted)] truncate">
                    {item.meta}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Center Circular Floating Badge (Havenline Atlas Grocers Signature) */}
          <Link
            to={ctaHref}
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 h-32 w-32 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-[var(--panel-shadow)] flex-col items-center justify-center text-center p-3 hover:border-[var(--action-primary)] hover:scale-105 transition-all"
          >
            <span className="font-serif-editorial text-[28px] leading-none text-[var(--text-main)] tabular-nums">
              {formatNumber(totalCount)}
            </span>
            <span className="text-[10px] font-mono-custom uppercase tracking-wider text-[var(--text-muted)] mt-1">
              {t.nav.courses}
            </span>
            <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-[var(--action-primary)]">
              <span>{badgeSublabel}</span>
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </Link>
        </div>

        <div className="lg:hidden mt-5 flex justify-center">
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[13px] font-semibold text-[var(--action-primary)] shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {formatNumber(totalCount)} · {badgeSublabel}
            </span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
};
