/**
 * API Client configuration ready for Backend API on Port 4000.
 * When VITE_USE_MOCK_API is false, calls route directly to VITE_API_BASE_URL (http://localhost:4000/api).
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  useMock: (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false',
  userAppUrl: import.meta.env.VITE_USER_APP_URL || 'http://localhost:3001',
  adminAppUrl: import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3002',
};

export function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `API request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

