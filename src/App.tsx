import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from '@/pages/AuthPages';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { CoursesPage } from '@/pages/CoursesPage';
import { HomePage } from '@/pages/HomePage';
import { PricingPage } from '@/pages/PricingPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  TermsPage,
} from '@/pages/StaticPages';
import { VideoDetailPage } from '@/pages/VideoDetailPage';
import { VideosPage } from '@/pages/VideosPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
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

