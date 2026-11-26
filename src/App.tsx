import React, { lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { HomePage } from '@/pages/HomePage';

const CoursesPage = lazy(() =>
  import('@/pages/CoursesPage').then((m) => ({ default: m.CoursesPage })),
);
const CourseDetailPage = lazy(() =>
  import('@/pages/CourseDetailPage').then((m) => ({ default: m.CourseDetailPage })),
);
const VideosPage = lazy(() =>
  import('@/pages/VideosPage').then((m) => ({ default: m.VideosPage })),
);
const VideoDetailPage = lazy(() =>
  import('@/pages/VideoDetailPage').then((m) => ({ default: m.VideoDetailPage })),
);
const CategoriesPage = lazy(() =>
  import('@/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
);
const PricingPage = lazy(() =>
  import('@/pages/PricingPage').then((m) => ({ default: m.PricingPage })),
);
const CheckoutPage = lazy(() =>
  import('@/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
);
const LoginPage = lazy(() => import('@/pages/AuthPages').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/AuthPages').then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/AuthPages').then((m) => ({ default: m.ForgotPasswordPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/AuthPages').then((m) => ({ default: m.ResetPasswordPage })),
);
const AboutPage = lazy(() =>
  import('@/pages/StaticPages').then((m) => ({ default: m.AboutPage })),
);
const ContactPage = lazy(() =>
  import('@/pages/StaticPages').then((m) => ({ default: m.ContactPage })),
);
const TermsPage = lazy(() =>
  import('@/pages/StaticPages').then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/StaticPages').then((m) => ({ default: m.PrivacyPage })),
);
const FaqPage = lazy(() => import('@/pages/StaticPages').then((m) => ({ default: m.FaqPage })));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
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

                {/* Categories */}
                <Route path="/categories" element={<CategoriesPage />} />

                {/* PUB-06 Pricing */}
                <Route path="/pricing" element={<PricingPage />} />

                {/* PUB-07 Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

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

