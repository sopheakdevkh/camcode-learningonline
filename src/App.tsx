import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { API_CONFIG } from '@/services/apiClient';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { HomePage } from '@/pages/HomePage';
import { PricingPage } from '@/pages/PricingPage';
import { TrainersPage } from '@/pages/TrainersPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  TermsPage,
} from '@/pages/StaticPages';
import { VideoDetailPage } from '@/pages/VideoDetailPage';
import { VideosPage } from '@/pages/VideosPage';

const canElementScroll = (el: HTMLElement | null, deltaY: number): boolean => {
  let node = el;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
    if (isScrollable && node.scrollHeight > node.clientHeight + 1) {
      const atTop = node.scrollTop <= 0 && deltaY < 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1 && deltaY > 0;
      if (!atTop && !atBottom) return true;
    }
    node = node.parentElement;
  }
  return false;
};

const SmoothScrollController: React.FC = () => {
  const { pathname } = useLocation();

  // Smooth Lenis-style inertia wheel scrolling + anchor smoothing
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReduced || isTouch) return;

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId = 0;
    let lastTime = 0;
    let isAnimating = false;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(32, now - lastTime) : 16.67;
      lastTime = now;
      const factor = 1 - Math.pow(1 - 0.115, dt / 16.67);
      const diff = targetY - currentY;

      if (Math.abs(diff) < 0.35) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        isAnimating = false;
        rafId = 0;
        lastTime = 0;
        return;
      }

      currentY += diff * factor;
      window.scrollTo(0, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!isAnimating) {
        isAnimating = true;
        lastTime = 0;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (document.body.style.overflow === 'hidden') return;
      if (canElementScroll(e.target as HTMLElement | null, e.deltaY)) return;

      e.preventDefault();
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }

      const delta =
        e.deltaMode === 1 ? e.deltaY * 36 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;

      targetY = Math.max(0, Math.min(getMaxScroll(), targetY + delta));
      startLoop();
    };

    const onScrollSync = () => {
      if (!isAnimating) {
        currentY = window.scrollY;
        targetY = window.scrollY;
      }
    };

    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const targetEl = document.getElementById(id);
      if (!targetEl) return;
      e.preventDefault();
      currentY = window.scrollY;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 92;
      targetY = Math.max(0, Math.min(getMaxScroll(), top));
      startLoop();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScrollSync, { passive: true });
    document.addEventListener('click', onAnchorClick);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScrollSync);
      document.removeEventListener('click', onAnchorClick);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Reset scroll on route change & observe [data-reveal] elements
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    const mutation = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((el) => {
        observer.observe(el);
      });
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [pathname]);

  return null;
};

const ExternalUserAuthRedirect: React.FC<{ path: string }> = ({ path }) => {
  useEffect(() => {
    window.location.replace(`${API_CONFIG.userAppUrl}${path}`);
  }, [path]);

  return null;
};

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <SmoothScrollController />
            <Routes>
              <Route element={<MainLayout />}>
                {/* PUB-01 Homepage */}
                <Route path="/" element={<HomePage />} />

                {/* PUB-02 Course Marketplace & PUB-03 Course Detail */}
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />

                {/* PUB-04 Video Library & PUB-05 Video Detail */}
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/videos/:slug" element={<VideoDetailPage />} />

                {/* Categories & Services */}
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/services" element={<CategoriesPage />} />

                {/* Trainers */}
                <Route path="/trainers" element={<TrainersPage />} />

                {/* PUB-06 Pricing */}
                <Route path="/pricing" element={<PricingPage />} />

                {/* PUB-07 Auth Routes Delegated to Learner Workspace */}
                <Route path="/login" element={<ExternalUserAuthRedirect path="/login" />} />
                <Route path="/register" element={<ExternalUserAuthRedirect path="/register" />} />
                <Route
                  path="/forgot-password"
                  element={<ExternalUserAuthRedirect path="/forgot-password" />}
                />
                <Route
                  path="/reset-password"
                  element={<ExternalUserAuthRedirect path="/reset-password" />}
                />

                {/* PUB-08 Checkout */}
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* PUB-09 Static Information Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/faq" element={<FaqPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

