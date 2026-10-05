/**
 * Image URL normalization, auto-sanitization & Canvas compression helper
 * LAND OF GOD TATTOO STUDIO
 */

/**
 * Automatically cleans & converts web share links (Google Drive, Unsplash, Imgur, Dropbox)
 * into direct, embeddable image URLs.
 */
export const cleanImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  // If already a Data URL, return as is
  if (url.startsWith('data:image/')) return url;

  try {
    // 1. Google Drive Links
    // Matches: drive.google.com/file/d/FILE_ID/view... or drive.google.com/open?id=FILE_ID or drive.google.com/uc?id=FILE_ID
    const gDriveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    const gDriveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:[a-zA-Z0-9_=&-]*\b)?id=([a-zA-Z0-9_-]+)/i);
    const gDriveId = gDriveFileMatch ? gDriveFileMatch[1] : (gDriveIdMatch ? gDriveIdMatch[1] : null);
    if (gDriveId) {
      // lh3.googleusercontent.com/d/ID is the highest reliability embed link without cookie blocks
      return `https://lh3.googleusercontent.com/d/${gDriveId}`;
    }

    // 2. Unsplash Page Links
    // Matches: unsplash.com/photos/(optional-slug-)ID
    if (url.includes('unsplash.com/photos/')) {
      const match = url.match(/unsplash\.com\/photos\/(?:[^\/?#]+-)?([a-zA-Z0-9_-]+)(?:[/?#]|$)/i);
      if (match && match[1]) {
        return `https://images.unsplash.com/photo-${match[1]}?auto=format&fit=crop&w=1200&q=80`;
      }
    }

    // 3. Imgur Page Links
    // Matches: imgur.com/ID or imgur.com/gallery/ID or imgur.com/a/ID (without .jpg/.png)
    if (url.includes('imgur.com/') && !url.includes('i.imgur.com/') && !/\.(jpe?g|png|gif|webp)$/i.test(url)) {
      const match = url.match(/imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)/i);
      if (match && match[1]) {
        return `https://i.imgur.com/${match[1]}.jpg`;
      }
    }

    // 4. Dropbox Share Links
    // Matches: dropbox.com/s/... with dl=0 -> replace with raw=1
    if (url.includes('dropbox.com/') && url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    }
  } catch (err) {
    console.warn('cleanImageUrl parser error:', err);
  }

  return url;
};

/**
 * Compresses an image File object into an optimized WebP/JPEG Base64 Data URL using HTML5 Canvas.
 * Solves file-size limits, latency, and broken large camera upload payloads.
 */
export const compressImageFile = (
  file,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82, mimeType = 'image/jpeg' } = {}
) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not a valid image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          // Fallback to raw data url if canvas context unavailable
          return resolve(e.target.result);
        }

        // Enable high-quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight Data URL
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};

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
    return cleanImageUrl(url);
  }

  // 2. Relative uploads from backend
  if (url.startsWith('/uploads/')) {
    const backendUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
      : 'https://tattoo-studio-api.onrender.com';
    return `${backendUrl}${url}`;
  }

  return cleanImageUrl(url);
};
