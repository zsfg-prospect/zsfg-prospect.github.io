/**
 * Utility to get the correct API path for both development and production
 */
export function getApiPath(path: string): string {
  // In production, we need to prefix with /hospital-flow
  // In development, we use the path as-is
  const basePath = process.env.NODE_ENV === 'production' ? '/hospital-flow' : '';
  return `${basePath}${path}`;
}