import type { BillingCycle, Locale, PlanTier, User } from '@/types';
import { API_CONFIG, apiRequest, delay } from './apiClient';

const SESSION_KEY = 'camcodelearn_mock_user';

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  preferredLanguage: Locale;
}

function loadSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function persistUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export const authService = {
  getSessionSync(): User | null {
    return loadSavedUser();
  },

  async login(payload: LoginPayload): Promise<User> {
    if (!API_CONFIG.useMock) {
      return apiRequest<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
    await delay(320);
    if (!payload.identifier.trim() || payload.password.length < 6) {
      throw new Error('Invalid credentials. Please check your email/phone and password.');
    }

    const existing = loadSavedUser();
    const user: User = existing ?? {
      id: 'user-demo-1',
      fullName: payload.identifier.includes('@')
        ? payload.identifier.split('@')[0].replace(/[._]/g, ' ')
        : 'Sokha Learner',
      email: payload.identifier.includes('@') ? payload.identifier : 'sokha@example.com',
      phone: payload.identifier.includes('@') ? '+855 12 345 678' : payload.identifier,
      preferredLanguage: 'en',
      activePlan: 'free',
      purchasedCourseIds: [],
      enrolledFreeCourseIds: [],
      watchlistVideoIds: ['vid-1'],
    };

    persistUser(user);
    return user;
  },

  async register(payload: RegisterPayload): Promise<User> {
    if (!API_CONFIG.useMock) {
      return apiRequest<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }
    await delay(350);
    const user: User = {
      id: `user-${Date.now()}`,
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || undefined,
      preferredLanguage: payload.preferredLanguage,
      activePlan: 'free',
      purchasedCourseIds: [],
      enrolledFreeCourseIds: [],
      watchlistVideoIds: [],
    };
    persistUser(user);
    return user;
  },

  async logout(): Promise<void> {
    if (!API_CONFIG.useMock) {
      await apiRequest('/auth/logout', { method: 'POST' });
    }
    persistUser(null);
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (!API_CONFIG.useMock) {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return;
    }
    await delay(280);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!API_CONFIG.useMock) {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      return;
    }
    await delay(280);
  },

  updateMockUser(updater: (prev: User) => User): User | null {
    const current = loadSavedUser();
    if (!current) return null;
    const next = updater(current);
    persistUser(next);
    return next;
  },

  setDemoUser(preset: 'visitor' | 'free' | 'basic' | 'premium' | 'purchased'): User | null {
    if (preset === 'visitor') {
      persistUser(null);
      return null;
    }
    const base: User = {
      id: 'user-demo-1',
      fullName: 'Sokha Chan',
      email: 'sokha.chan@example.com',
      phone: '+855 12 889 900',
      preferredLanguage: 'en',
      activePlan: preset === 'basic' ? 'basic' : preset === 'premium' ? 'premium' : ('free' as PlanTier),
      billingCycle: preset === 'basic' || preset === 'premium' ? ('monthly' as BillingCycle) : undefined,
      purchasedCourseIds: preset === 'purchased' ? ['course-1'] : [],
      enrolledFreeCourseIds: ['course-4'],
      watchlistVideoIds: ['vid-1', 'vid-2'],
    };
    persistUser(base);
    return base;
  },
};

