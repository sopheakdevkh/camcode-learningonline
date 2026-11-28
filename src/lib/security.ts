/**
 * Sanitizes an internal redirect target to prevent open-redirect vulnerabilities.
 * Only allows relative same-origin paths starting with a single '/'.
 */
export function sanitizeRedirectPath(
  raw: string | null | undefined,
  fallback = '/',
): string {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  return trimmed;
}
