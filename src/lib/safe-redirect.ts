export function safeRedirect(
  value: string | string[] | null | undefined,
  fallback = '/',
) {
  const target = Array.isArray(value) ? value[0] : value;
  if (
    !target ||
    !target.startsWith('/') ||
    target.startsWith('//') ||
    target.startsWith('/\\')
  ) {
    return fallback;
  }
  if (target.startsWith('/login') || target.startsWith('/register')) {
    return fallback;
  }
  return target;
}
