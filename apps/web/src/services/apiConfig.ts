/**
 * API Configuration & Static Host Detection
 * Handles GitHub Pages static hosting vs full-stack Node.js / Cloud API backends
 */

/**
 * Returns true if running on a static host like GitHub Pages without an external API server
 */
export const isStaticHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  // If explicitly configured with an external API URL, we have a backend
  const apiUrl = typeof process !== 'undefined' ? process.env.VITE_API_URL : '';
  if (apiUrl) return false;

  // GitHub Pages domain (e.g. jsesetty.github.io)
  return window.location.hostname.endsWith('github.io');
};

/**
 * Returns the fully qualified or relative URL for an API endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = typeof process !== 'undefined' ? (process.env.VITE_API_URL || '') : '';
  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBase}${cleanEndpoint}`;
  }
  return endpoint;
};
