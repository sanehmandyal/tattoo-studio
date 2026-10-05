/**
 * Image URL normalization helper for LAND OF GOD TATTOO STUDIO
 * Handles Data URLs (Base64), External CDN URLs, and backend relative uploads.
 */

export const getFullImageUrl = (
  url,
  fallback = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=800&q=80'
) => {
  if (!url || typeof url !== 'string') return fallback;

  // 1. Direct Data URLs (Base64) or fully-qualified web URLs
  if (url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 2. Relative uploads from backend
  if (url.startsWith('/uploads/')) {
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
      : 'https://tattoo-studio-api.onrender.com';
    return `${backendUrl}${url}`;
  }

  return url;
};
