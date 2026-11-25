import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BookOpen,
  Check,
  Download,
  Film,
  Globe,
  GraduationCap,
  Layers,
  MessageCircle,
  Pause,
  Play,
  PlayCircle,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import '@fontsource-variable/manrope';
import './daytake-photo-landing.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

export type LandingTile = {
  id: string;
  title: string;
  description: string;
  href: string;
  theme: string;
  label: string;
  kind: 'course' | 'video';
  meta?: string;
};

export type LandingFeature = {
  title: string;
  description: string;
  icon: 'award' | 'play' | 'layers' | 'globe';
};

export type LandingCreator = {
  id: string;
  name: string;
  specialty: string;
  initials: string;
  avatarColor: string;
  color: 'lavender' | 'pink' | 'cream' | 'yellow';
  tilt: number;
};

export type DaytakeLandingCopy = {
  brandName: string;
  windowLabel: string;
  navCourses: string;
  navVideos: string;
  navPricing: string;
  heroTitleLead: string;
  heroTitleAccent: string;
  heroDesc: string;
  primaryCta: string;
  secondaryCta: string;
  heroFoot: string;
  heroFootLink: string;
  counterLabel: string;
  counterValue: number;
  featuresAria: string;
  libraryTitleLead: string;
  libraryTitleAccent: string;
  librarySub: string;
  libraryFoot: string;
  pauseMotion: string;
  resumeMotion: string;
  editorialTitleLead: string;
  editorialTitleAccent: string;
  editorialDesc: string;
  editorialCaption: string;
  getStarted: string;
  watchVideo: string;
  trust1: string;
  trust2: string;
  trust3: string;
  peopleTitleLead: string;
  peopleTitleAccent: string;
  peopleSub: string;
  peopleLink: string;
  footerTagline: string;
  demoNote: string;
  langEn: string;
  langKm: string;
};

function PreviewDialog({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  function close() {
    dialog.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className="preview-dialog"
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="preview-dialog-inner">
        <button
          type="button"
          className="preview-icon-button preview-close"
          aria-label="Close dialog"
          onClick={close}
        >
          <X aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}

function prepStrokeDraw(elements: Element | Element[]) {
  gsap.utils.toArray<SVGGeometryElement>(elements).forEach((el) => {
    const length = el.getTotalLength?.() ?? 0;
    if (!length) return;
    el.style.strokeDasharray = String(length);
    el.style.strokeDashoffset = String(length);
  });
}

const featureIcons = {
  award: Award,
  play: PlayCircle,
  layers: Layers,
  globe: Globe,
} as const;

function TileFace({ tile, compact = false }: { tile: LandingTile; compact?: boolean }) {
  return (
    <div className={`daytake-tile-face bg-gradient-to-br ${tile.theme}`}>
      <span className="daytake-tile-chip">
        {tile.kind === 'course' ? (
          <BookOpen aria-hidden="true" />
        ) : (
          <Film aria-hidden="true" />
        )}
        {tile.label}
      </span>
      <div className="daytake-tile-copy">
        <strong>{tile.title}</strong>
        {!compact && tile.meta ? <small>{tile.meta}</small> : null}
      </div>
    </div>
  );
}

export function DaytakeLandingPage({
  copy,
  tiles,
  features,
  creators,
  locale,
  onLocaleChange,
}: {
  copy: DaytakeLandingCopy;
  tiles: LandingTile[];
  features: LandingFeature[];
  creators: LandingCreator[];
  locale: 'en' | 'km';
  onLocaleChange: (next: 'en' | 'km') => void;
}) {
  const safeTiles = [...tiles];
  if (safeTiles.length === 0) {
    safeTiles.push({
      id: 'pad-0',
      title: copy.brandName,
      description: copy.heroDesc,
      href: '/courses',
      theme: 'from-blue-50 to-indigo-100 border-blue-200',
      label: copy.navCourses,
      kind: 'course',
    });
  }
  const baseCount = Math.min(Math.max(tiles.length, 1), safeTiles.length);
  while (safeTiles.length < 13) {
    const source = safeTiles[safeTiles.length % baseCount] ?? safeTiles[0];
    safeTiles.push({ ...source, id: `${source.id}-pad-${safeTiles.length}` });
  }

  const editorial = safeTiles[0];
  const question = safeTiles[1];
  const result = safeTiles[4];
  const galleryRows = [
    [safeTiles[0], safeTiles[2], safeTiles[4], safeTiles[7], safeTiles[9], safeTiles[5]],
    [safeTiles[12], safeTiles[8], safeTiles[6], safeTiles[3], safeTiles[10], safeTiles[11]],
  ];
  const mosaic = [
    [safeTiles[5], safeTiles[7], safeTiles[3], safeTiles[1]],
    [safeTiles[8], safeTiles[0], safeTiles[10], safeTiles[4]],
    [safeTiles[2], safeTiles[6], safeTiles[9], safeTiles[11]],
  ];

  const waves = [
    {
      layout: 'wide',
      box: '0 0 1120 390',
      path: 'M -20 190 C 60 190 66 134 140 134 S 300 234 420 234 S 582 114 700 114 S 864 214 980 214 S 1080 170 1140 170',
    },
    {
      layout: 'phone',
      box: '0 0 400 560',
      path: 'M -16 150 C 35 150 45 110 100 110 S 245 175 300 175 C 425 175 420 390 300 390 S 155 335 100 335 C 10 335 -5 470 50 520',
    },
  ];
  const waveform = [
    5, 11, 18, 9, 22, 15, 8, 24, 30, 16, 23, 11, 20, 28, 16, 9, 21, 32, 19, 25, 14, 7, 15, 23, 12, 29, 18, 8, 20, 13, 6, 11,
  ];

  const [selected, setSelected] = useState<LandingTile | null>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  const [saved, setSaved] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const library = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          wide: '(min-width: 760px)',
          tall: '(min-height: 650px)',
        },
        (context) => {
          const { reduce, wide, tall } = context.conditions!;
          const select = gsap.utils.selector(root);
          if (reduce) {
            if (counter.current) {
              counter.current.textContent = copy.counterValue.toLocaleString('en-US');
            }
            return;
          }
          const start = Math.max(0, copy.counterValue - 3186);
          const counterValue = { value: start };
          const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
          intro
            .fromTo(
              select('.daytake-hero-cta'),
              { opacity: 0.45, backgroundColor: '#93c5fd' },
              { opacity: 1, backgroundColor: '#2563EB', duration: 1.15 },
              0,
            )
            .to(
              counterValue,
              {
                value: copy.counterValue,
                duration: 2.6,
                ease: 'power2.out',
                onUpdate: () => {
                  if (counter.current) {
                    counter.current.textContent = Math.round(counterValue.value).toLocaleString('en-US');
                  }
                },
              },
              0.1,
            );

          const unfurl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero.current,
              start: 'top top',
              end: wide && tall ? () => '+=' + Math.round(innerHeight * 0.7) : 'bottom top',
              pin: !!(wide && tall),
              pinSpacing: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          unfurl
            .addLabel('unfurl', 0)
            .fromTo(
              select('.daytake-mosaic-grid'),
              { rotationX: 18, rotationY: -24, rotationZ: -12, z: -150 },
              { rotationX: 3, rotationY: -3, rotationZ: -5, z: 0, duration: 1 },
              'unfurl',
            );
          gsap.utils.toArray<HTMLElement>('.daytake-mosaic-track', root.current).forEach((track, index) => {
            unfurl.fromTo(
              track,
              { yPercent: index === 1 ? -24 : -3 },
              { yPercent: index === 1 ? -4 : -25, duration: 1 },
              'unfurl',
            );
          });

          const featureCards = select('.daytake-feature');
          const featureIconsEls = select('.daytake-feature-icon');
          gsap
            .timeline({
              defaults: { duration: 0.55, ease: 'power3.out' },
              scrollTrigger: { trigger: select('.daytake-features')[0], start: 'top 82%', once: true },
            })
            .fromTo(featureCards, { opacity: 0.3, x: wide ? 28 : 12 }, { opacity: 1, x: 0, stagger: 0.13 }, 0)
            .fromTo(featureIconsEls, { scale: 0.55 }, { scale: 1, stagger: 0.13, ease: 'back.out(1.5)' }, 0.08);

          const badges = gsap
            .timeline({ paused: true })
            .fromTo(
              select('.daytake-photo-badge'),
              { scale: 0, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 0.44, stagger: 0.018, ease: 'back.out(1.45)' },
            );
          const arrival = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
              trigger: library.current,
              start: 'top 92%',
              end: 'top 50%',
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (self.progress > 0.96) badges.play();
              },
            },
          });
          arrival.addLabel('photos', 0);
          gsap.utils.toArray<HTMLElement>('.daytake-gallery-group', root.current).forEach((group) => {
            arrival.fromTo(
              group.querySelectorAll('.daytake-photo-arrival'),
              { x: () => Math.min(innerWidth, 1300) * 0.83, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, duration: 0.65, stagger: 0.09 },
              'photos',
            );
          });
          if (tall) {
            ScrollTrigger.create({
              trigger: library.current,
              start: 'center center',
              end: () => '+=' + Math.round(innerHeight * (wide ? 0.66 : 0.38)),
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            });
          }

          prepStrokeDraw(select('.daytake-editorial-connector'));
          prepStrokeDraw(select('.daytake-portrait-trace'));

          const editorialTimeline = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
              trigger: select('.daytake-editorial')[0],
              start: 'top 88%',
              end: wide ? 'center 43%' : 'top 12%',
              scrub: 0.45,
              invalidateOnRefresh: true,
            },
          });
          editorialTimeline
            .addLabel('grow', 0)
            .fromTo(
              select('.daytake-editorial-media'),
              { scale: 0.65, yPercent: 12 },
              { scale: 1, yPercent: 0, duration: 0.75, ease: 'none' },
              'grow',
            )
            .addLabel('assemble', 0.42)
            .fromTo(select('.daytake-editorial-toolbar'), { x: -65, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.38 }, 'assemble')
            .fromTo(select('.daytake-audio'), { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 'assemble+=.1')
            .fromTo(
              select('.daytake-editorial-question'),
              { x: 38, y: 26, scale: 0.7, autoAlpha: 0 },
              { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.43, ease: 'back.out(1.1)' },
              'assemble+=.14',
            )
            .fromTo(select('.daytake-editorial-actions'), { x: 35, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.35 }, 'assemble+=.15')
            .fromTo(select('.daytake-trust-item'), { x: 20, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, stagger: 0.07 }, 'assemble+=.3')
            .fromTo(
              select('.daytake-editorial-connector'),
              { strokeDashoffset: (_i, el) => Number((el as SVGGeometryElement).getTotalLength?.() ?? 0) },
              { strokeDashoffset: 0, duration: 0.4, ease: 'none' },
              'assemble+=.38',
            )
            .fromTo(select('.daytake-editorial-result'), { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25 }, 'assemble+=.66');

          const field = select('.daytake-portrait-field')[0] as HTMLElement;
          const peopleTimeline = gsap.timeline({
            defaults: { ease: 'power2.out' },
            scrollTrigger: {
              trigger: select('.daytake-people')[0],
              start: 'clamp(top 72%)',
              end: 'clamp(bottom 92%)',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          peopleTimeline
            .fromTo(select('.daytake-portrait-line'), { y: 40 }, { y: 0, duration: 1.5 }, 0)
            .fromTo(
              select('.daytake-portrait-trace'),
              { strokeDashoffset: (_i, el) => Number((el as SVGGeometryElement).getTotalLength?.() ?? 0) },
              { strokeDashoffset: 0, duration: 1.65, ease: 'none' },
              0.12,
            );

          select('.daytake-creator-arrival').forEach((item: HTMLElement, index: number) => {
            const inner = index === 1 || index === 2;
            const side = index < 2 ? -1 : 1;
            const at = inner ? 0.22 + (index - 1) * 0.09 : 1.02 + (index === 3 ? 0.08 : 0);
            const plate = item.querySelector('.daytake-creator-backplate');
            const avatar = item.querySelector('.daytake-creator-avatar');
            const body = item.querySelector('.daytake-creator-body');
            const caption = item.querySelector('.daytake-creator-caption');
            const travel = field.clientWidth * (wide ? 0.34 : 0.23);
            const creator = creators[index];
            if (!creator) return;
            if (inner) {
              peopleTimeline.fromTo(item, { y: 110, scale: 0.7 }, { y: 0, scale: 1, duration: 0.94 }, 0);
            } else {
              peopleTimeline.fromTo(
                item,
                { x: side * travel, y: 56, scale: 0.72 },
                {
                  motionPath: {
                    path: [
                      { x: side * travel, y: 56 },
                      { x: side * travel * 0.43, y: -28 },
                      { x: 0, y: 0 },
                    ],
                    curviness: 1.2,
                  },
                  scale: 1,
                  duration: 1.05,
                },
                0.48,
              );
            }
            peopleTimeline
              .fromTo(
                plate,
                { opacity: 0, rotation: creator.tilt + side * 16 },
                { opacity: 1, rotation: creator.tilt, duration: 0.85 },
                inner ? 0 : 0.2,
              )
              .fromTo(avatar, { scale: 0.1, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.46, ease: 'power3.out' }, at)
              .fromTo(
                body,
                { clipPath: 'circle(2% at 50% 27%)', opacity: 0 },
                { clipPath: 'circle(100% at 50% 45%)', opacity: 1, duration: 0.48 },
                at + 0.24,
              )
              .fromTo(caption, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25 }, at + 0.47);
          });
          select('.daytake-particle-arrival').forEach((dot: HTMLElement, index: number) => {
            const direction = index % 2 ? -1 : 1;
            const reach = wide ? 135 : 45;
            peopleTimeline.fromTo(
              dot,
              { x: direction * -reach, y: 62, autoAlpha: 0 },
              {
                autoAlpha: 1,
                duration: 1.9,
                ease: 'none',
                motionPath: {
                  path: [
                    { x: direction * -reach, y: 62 },
                    { x: direction * -reach * 0.2, y: -48 - index * 7 },
                    { x: 0, y: 0 },
                  ],
                  curviness: 1.5,
                },
              },
              index * 0.035,
            );
          });

          const revealFocusedCreator = (event: FocusEvent) => {
            if ((event.target as HTMLElement).matches('.daytake-creator:focus-visible')) {
              peopleTimeline.scrollTrigger?.getTween()?.progress(1);
              peopleTimeline.progress(1);
            }
          };
          field.addEventListener('focusin', revealFocusedCreator);

          let disposed = false;
          const refresh = () => {
            if (!disposed) ScrollTrigger.refresh();
          };
          document.fonts.ready.then(refresh);
          return () => {
            disposed = true;
            field.removeEventListener('focusin', revealFocusedCreator);
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [copy.counterValue, creators] },
  );

  useEffect(() => {
    const strip = gallery.current;
    if (!strip) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const tracks = gsap.utils.toArray<HTMLDivElement>('.daytake-gallery-lane', strip).map((lane, index) => ({
        lane,
        group: lane.firstElementChild as HTMLElement,
        direction: index === 0 ? 1 : -1,
        period: 0,
        position: 0,
        rendered: 0,
        resumeAt: 0,
      }));
      const measure = () => {
        tracks.forEach((track) => {
          const period = track.group.offsetWidth;
          if (period === track.period) return;
          track.position = track.period
            ? (track.position / track.period) * period
            : track.direction === 1
              ? 0
              : period;
          track.period = period;
          track.lane.scrollLeft = track.position;
          track.rendered = track.lane.scrollLeft;
        });
      };
      const tick = (time: number, elapsed: number) => {
        if (document.hidden || root.current?.dataset.motionPaused === 'true') return;
        const inspecting = !!strip.querySelector(':focus-visible') || strip.matches(':active');
        for (const track of tracks) {
          if (track.lane.scrollLeft !== track.rendered) {
            track.position = track.lane.scrollLeft;
            track.rendered = track.lane.scrollLeft;
            track.resumeAt = time + 0.8;
          }
          if (time < track.resumeAt || inspecting || !track.period) continue;
          track.position = gsap.utils.wrap(
            0,
            track.period,
            track.position + track.direction * Math.min(elapsed, 48) * 0.032,
          );
          track.lane.scrollLeft = track.position;
          track.rendered = track.lane.scrollLeft;
        }
      };
      measure();
      const resize = new ResizeObserver(measure);
      tracks.forEach((track) => resize.observe(track.group));
      const view = new IntersectionObserver(([entry]) => {
        gsap.ticker.remove(tick);
        if (entry.isIntersecting) gsap.ticker.add(tick);
      });
      view.observe(strip);
      return () => {
        resize.disconnect();
        view.disconnect();
        gsap.ticker.remove(tick);
      };
    });
    return () => media.revert();
  }, []);

  function tileCard(tile: LandingTile, copyLane = false) {
    return (
      <div className="daytake-photo-arrival" key={`${tile.id}-${copyLane ? 'c' : 'm'}`}>
        <button
          className="daytake-photo"
          type="button"
          tabIndex={copyLane ? -1 : undefined}
          onMouseDown={copyLane ? (event) => event.preventDefault() : undefined}
          aria-label={tile.title}
          onClick={() => setSelected(tile)}
        >
          <TileFace tile={tile} />
          <span className="daytake-photo-badge daytake-play-badge">
            <Play aria-hidden="true" fill="currentColor" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="daytake daytake-business"
      ref={root}
      id="top"
      data-motion-paused={motionPaused || !!selected}
    >
      <a className="preview-skip" href="#library">
        Skip to catalog
      </a>
      <div className="daytake-window-bar" aria-hidden="true">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>{copy.windowLabel}</span>
        <Sparkles />
      </div>
      <header className="daytake-header daytake-wrap">
        <Link className="daytake-logo" to="/">
          <GraduationCap aria-hidden="true" />
          {copy.brandName}
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/courses">{copy.navCourses}</Link>
          <Link to="/videos">{copy.navVideos}</Link>
          <Link to="/pricing">{copy.navPricing}</Link>
        </nav>
        <div className="daytake-lang" role="group" aria-label="Language">
          <button
            type="button"
            className={locale === 'en' ? 'is-active' : undefined}
            onClick={() => onLocaleChange('en')}
          >
            {copy.langEn}
          </button>
          <button
            type="button"
            className={locale === 'km' ? 'is-active' : undefined}
            onClick={() => onLocaleChange('km')}
          >
            {copy.langKm}
          </button>
        </div>
      </header>
      <main>
        <section className="daytake-hero" ref={hero} aria-labelledby="daytake-title">
          <div className="daytake-mosaic" aria-hidden="true">
            <div className="daytake-mosaic-grid">
              {mosaic.map((column, index) => (
                <div className="daytake-mosaic-column" key={index}>
                  <div className="daytake-mosaic-track">
                    {[0, 1].map((lane) => (
                      <div className="daytake-mosaic-set" key={lane}>
                        {column.map((tile) => (
                          <div key={`${tile.id}-${lane}`} className="daytake-mosaic-tile">
                            <TileFace tile={tile} compact />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="daytake-wrap daytake-hero-content">
            <h1 id="daytake-title">
              {copy.heroTitleLead}
              <br />
              <span>{copy.heroTitleAccent}</span>
            </h1>
            <p>{copy.heroDesc}</p>
            <Link to="/courses" className="daytake-primary daytake-hero-cta">
              {copy.primaryCta} <ArrowRight aria-hidden="true" />
            </Link>
            <div className="daytake-counter">
              <span className="daytake-counter-icon">
                <Users aria-hidden="true" />
              </span>
              <span>
                <small>{copy.counterLabel}</small>
                <strong aria-label={String(copy.counterValue)}>
                  <span ref={counter} aria-hidden="true">
                    {copy.counterValue.toLocaleString('en-US')}
                  </span>
                </strong>
              </span>
            </div>
          </div>
          <div className="daytake-hero-foot daytake-wrap">
            <span>{copy.heroFoot}</span>
            <a href="#about">
              {copy.heroFootLink} <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="daytake-features daytake-wrap" id="about" aria-label={copy.featuresAria}>
          <div className="daytake-feature-grid">
            {features.map(({ title, description, icon }) => {
              const Icon = featureIcons[icon];
              return (
                <article className="daytake-feature" key={title}>
                  <span className="daytake-feature-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="daytake-library" id="library" ref={library} aria-labelledby="library-title">
          <div className="daytake-library-heading daytake-wrap">
            <h2 id="library-title">
              {copy.libraryTitleLead} <span>{copy.libraryTitleAccent}</span>
            </h2>
            <p>{copy.librarySub}</p>
          </div>
          <div className="daytake-gallery" ref={gallery}>
            <div className="daytake-gallery-tilt">
              {galleryRows.map((row, index) => (
                <div
                  className="daytake-gallery-lane"
                  key={index}
                  aria-label={index === 0 ? 'Featured courses' : 'Popular videos'}
                >
                  {[0, 1, 2].map((lane) => (
                    <div
                      key={lane}
                      className={'daytake-gallery-group' + (lane ? ' daytake-gallery-copy' : '')}
                      aria-hidden={lane ? 'true' : undefined}
                    >
                      {row.map((tile) => tileCard(tile, !!lane))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="daytake-gallery-footer daytake-wrap">
            <span>{copy.libraryFoot}</span>
            <button
              className="daytake-motion-toggle"
              type="button"
              aria-label={motionPaused ? copy.resumeMotion : copy.pauseMotion}
              aria-pressed={motionPaused}
              onClick={() => setMotionPaused((value) => !value)}
            >
              {motionPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              <span>{motionPaused ? copy.resumeMotion : copy.pauseMotion}</span>
            </button>
          </div>
        </section>

        <section className="daytake-editorial daytake-wrap" aria-labelledby="daytake-editorial-title">
          <figure className="daytake-editorial-figure">
            <div className="daytake-editorial-stage">
              <div className="daytake-editorial-media">
                <button
                  className="daytake-editorial-photo"
                  type="button"
                  aria-label={editorial.title}
                  onClick={() => setSelected(editorial)}
                >
                  <TileFace tile={editorial} />
                </button>
                <Link className="daytake-editorial-open" to={editorial.href} aria-label={copy.primaryCta}>
                  <Play fill="currentColor" aria-hidden="true" />
                </Link>
              </div>
              <div className="daytake-editorial-toolbar" role="group" aria-label="Featured course tools">
                <button aria-label={editorial.title} onClick={() => setSelected(editorial)}>
                  <BookOpen aria-hidden="true" />
                </button>
                <Link to={editorial.href} aria-label={copy.getStarted}>
                  <PlayCircle aria-hidden="true" />
                </Link>
                <button
                  aria-label={saved ? 'Unsave' : 'Save'}
                  aria-pressed={saved}
                  onClick={() => setSaved((value) => !value)}
                >
                  {saved ? <Check aria-hidden="true" /> : <Award aria-hidden="true" />}
                </button>
                <Link to="/pricing" aria-label={copy.navPricing}>
                  <Download aria-hidden="true" />
                </Link>
              </div>
              <div className="daytake-audio" aria-label="Lesson progress preview">
                <div className="daytake-waveform" aria-hidden="true">
                  {waveform.map((height, index) => (
                    <i key={index} style={{ height }} />
                  ))}
                </div>
                <div className="daytake-audio-meta">
                  <span>
                    <Play size={10} fill="currentColor" /> Lesson preview
                  </span>
                  <span>12:40</span>
                </div>
                <span className="daytake-audio-progress" aria-hidden="true" />
              </div>
              <svg className="daytake-editorial-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path
                  className="daytake-editorial-connector"
                  d="M 86 61 H 94 Q 97 61 97 64 V 85 Q 97 88 94 88 H 79 M 82 86 L 79 88 L 82 90"
                />
              </svg>
              <button
                className="daytake-editorial-card daytake-editorial-question"
                type="button"
                aria-label={question.title}
                onClick={() => setSelected(question)}
              >
                <span className="daytake-mini-image">
                  <div className={`daytake-mini-thumb bg-gradient-to-br ${question.theme}`} />
                  <i>
                    <Play fill="currentColor" />
                  </i>
                </span>
                <strong>{question.label}</strong>
                <small>{question.title}</small>
              </button>
              <button
                className="daytake-editorial-card daytake-editorial-result"
                type="button"
                aria-label={result.title}
                onClick={() => setSelected(result)}
              >
                <div className={`daytake-mini-thumb bg-gradient-to-br ${result.theme}`} />
                <strong>{result.title}</strong>
              </button>
            </div>
            <figcaption>{copy.editorialCaption}</figcaption>
          </figure>
          <div className="daytake-editorial-content">
            <h2 id="daytake-editorial-title">
              {copy.editorialTitleLead}
              <br />
              <span>{copy.editorialTitleAccent}</span>
            </h2>
            <p>{copy.editorialDesc}</p>
            <div className="daytake-editorial-actions">
              <Link className="daytake-primary" to="/courses">
                {copy.getStarted} <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="daytake-watch" to="/videos">
                <span>
                  <Play fill="currentColor" aria-hidden="true" />
                </span>
                {copy.watchVideo}
              </Link>
            </div>
            <div className="daytake-trust">
              <div className="daytake-trust-item">
                <GraduationCap aria-hidden="true" />
                <span>{copy.trust1}</span>
              </div>
              <div className="daytake-trust-item">
                <BadgeCheck aria-hidden="true" />
                <span>{copy.trust2}</span>
              </div>
              <div className="daytake-trust-item">
                <MessageCircle aria-hidden="true" />
                <span>{copy.trust3}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="daytake-people" id="portraits" aria-labelledby="daytake-people-title">
          <div className="daytake-wrap">
            <h2 id="daytake-people-title">
              {copy.peopleTitleLead}
              <br />
              <span>{copy.peopleTitleAccent}</span>
            </h2>
            <p>{copy.peopleSub}</p>
          </div>
          <div className="daytake-portrait-field">
            {waves.map(({ layout, box, path }) => (
              <svg
                key={layout}
                className={'daytake-portrait-line daytake-portrait-line-' + layout}
                viewBox={box}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path className="daytake-portrait-trace" d={path} />
              </svg>
            ))}
            {[0, 1, 2, 3].map((index) => (
              <span className={'daytake-particle-arrival particle-' + index} key={index} aria-hidden="true">
                <i className="daytake-particle" />
              </span>
            ))}
            <ul className="daytake-creators">
              {creators.slice(0, 4).map(({ id, name, specialty, initials, avatarColor, color, tilt }) => (
                <li className="daytake-creator-arrival" key={id}>
                  <div className="daytake-creator">
                    <span
                      className={'daytake-creator-plate ' + color}
                      style={{ '--tilt': tilt + 'deg' } as CSSProperties}
                    >
                      <span className={'daytake-creator-backplate ' + color} aria-hidden="true" />
                      <span className="daytake-creator-body" aria-hidden="true" />
                      <span
                        className="daytake-creator-avatar daytake-creator-initials"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </span>
                      <span className="daytake-creator-caption">
                        <strong>{name}</strong>
                        <span className="daytake-creator-badge">
                          Instructor <ArrowUpRight aria-hidden="true" />
                        </span>
                      </span>
                    </span>
                    <small className="daytake-creator-specialty">{specialty}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Link className="daytake-text-link" to="/courses">
            {copy.peopleLink} <ArrowUpRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="daytake-footer daytake-wrap">
        <div>
          <Link className="daytake-logo" to="/">
            <GraduationCap aria-hidden="true" />
            {copy.brandName}
          </Link>
          <p>{copy.footerTagline}</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/courses">{copy.navCourses}</Link>
          <Link to="/videos">{copy.navVideos}</Link>
          <Link to="/pricing">{copy.navPricing}</Link>
        </nav>
        <small className="daytake-demo-note">{copy.demoNote}</small>
      </footer>
      {selected && (
        <PreviewDialog label={selected.title} onClose={() => setSelected(null)}>
          <div className={`daytake-dialog-photo daytake-dialog-tile bg-gradient-to-br ${selected.theme}`}>
            <TileFace tile={selected} />
          </div>
          <div className="daytake-dialog-info">
            <div>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
            <Link className="daytake-primary" to={selected.href} onClick={() => setSelected(null)}>
              {copy.getStarted}
            </Link>
          </div>
        </PreviewDialog>
      )}
    </div>
  );
}

export default DaytakeLandingPage;
