import { describe, expect, it } from 'vitest';
import { sanitizeRedirectPath } from '../security';

describe('sanitizeRedirectPath', () => {
  it('allows valid relative paths', () => {
    expect(sanitizeRedirectPath('/courses')).toBe('/courses');
    expect(sanitizeRedirectPath('/checkout?type=course&slug=react')).toBe(
      '/checkout?type=course&slug=react',
    );
  });

  it('blocks external and protocol-relative open redirects', () => {
    expect(sanitizeRedirectPath('https://evil.example/phish')).toBe('/');
    expect(sanitizeRedirectPath('//evil.example/phish')).toBe('/');
    expect(sanitizeRedirectPath('/\\evil.example')).toBe('/');
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/');
  });

  it('returns fallback for null or empty values', () => {
    expect(sanitizeRedirectPath(null, '/courses')).toBe('/courses');
    expect(sanitizeRedirectPath('   ', '/courses')).toBe('/courses');
  });
});
