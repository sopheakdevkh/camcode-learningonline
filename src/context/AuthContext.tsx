import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/authService';
import type { BillingCycle, Course, PlanTier, User, VideoItem } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  enrollFreeCourse: (courseId: string) => void;
  grantPurchasedCourse: (courseId: string) => void;
  grantSubscription: (plan: PlanTier, billingCycle: BillingCycle) => void;
  toggleWatchlist: (videoId: string) => boolean;
  hasCourseAccess: (course: Course) => 'purchased' | 'subscription' | 'free_enrolled' | 'none';
  hasVideoAccess: (video: VideoItem) => boolean;
  switchDemoPreset: (preset: 'visitor' | 'free' | 'basic' | 'premium' | 'purchased') => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getSessionSync());

  const login = async (payload: LoginPayload) => {
    const next = await authService.login(payload);
    setUser(next);
    return next;
  };

  const register = async (payload: RegisterPayload) => {
    const next = await authService.register(payload);
    setUser(next);
    return next;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const enrollFreeCourse = (courseId: string) => {
    const updated = authService.updateMockUser((prev) => ({
      ...prev,
      enrolledFreeCourseIds: Array.from(new Set([...prev.enrolledFreeCourseIds, courseId])),
    }));
    if (updated) setUser(updated);
  };

  const grantPurchasedCourse = (courseId: string) => {
    if (!user) {
      // Create guest-converted session if user checked out directly after entering details
      const created = authService.setDemoUser('free');
      if (created) {
        const updated = authService.updateMockUser((prev) => ({
          ...prev,
          purchasedCourseIds: Array.from(new Set([...prev.purchasedCourseIds, courseId])),
        }));
        if (updated) setUser(updated);
      }
      return;
    }
    const updated = authService.updateMockUser((prev) => ({
      ...prev,
      purchasedCourseIds: Array.from(new Set([...prev.purchasedCourseIds, courseId])),
    }));
    if (updated) setUser(updated);
  };

  const grantSubscription = (plan: PlanTier, billingCycle: BillingCycle) => {
    if (!user) {
      const created = authService.setDemoUser('free');
      if (created) {
        const updated = authService.updateMockUser((prev) => ({
          ...prev,
          activePlan: plan,
          billingCycle,
        }));
        if (updated) setUser(updated);
      }
      return;
    }
    const updated = authService.updateMockUser((prev) => ({
      ...prev,
      activePlan: plan,
      billingCycle,
    }));
    if (updated) setUser(updated);
  };

  const toggleWatchlist = (videoId: string): boolean => {
    if (!user) return false;
    const updated = authService.updateMockUser((prev) => {
      const exists = prev.watchlistVideoIds.includes(videoId);
      return {
        ...prev,
        watchlistVideoIds: exists
          ? prev.watchlistVideoIds.filter((id) => id !== videoId)
          : [...prev.watchlistVideoIds, videoId],
      };
    });
    if (updated) setUser(updated);
    return true;
  };

  const hasCourseAccess = (course: Course) => {
    if (!user) return 'none';
    if (user.purchasedCourseIds.includes(course.id)) return 'purchased';
    if (course.price === 0 && user.enrolledFreeCourseIds.includes(course.id)) return 'free_enrolled';
    if (
      user.activePlan !== 'free' &&
      course.includedInPlans.includes(user.activePlan)
    ) {
      return 'subscription';
    }
    return 'none';
  };

  const hasVideoAccess = (video: VideoItem) => {
    if (video.accessType === 'free') return true;
    if (!user) return false;
    return video.requiredPlans.includes(user.activePlan);
  };

  const switchDemoPreset = (preset: 'visitor' | 'free' | 'basic' | 'premium' | 'purchased') => {
    const next = authService.setDemoUser(preset);
    setUser(next);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      enrollFreeCourse,
      grantPurchasedCourse,
      grantSubscription,
      toggleWatchlist,
      hasCourseAccess,
      hasVideoAccess,
      switchDemoPreset,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

