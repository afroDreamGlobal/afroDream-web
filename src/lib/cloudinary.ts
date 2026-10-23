/**
 * Cloudinary Media Architecture
 * Provides signed upload parameter generation, client and server-side upload abstractions,
 * and responsive image transformation helpers.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

/**
 * Generates an optimized Cloudinary delivery URL with automatic format and quality
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg';
  } = {}
): string {
  if (!publicIdOrUrl) return '';

  // If already a full URL and not Cloudinary, return as is
  if (publicIdOrUrl.startsWith('http') && !publicIdOrUrl.includes('res.cloudinary.com')) {
    return publicIdOrUrl;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'demo';
  const { width, height, crop = 'fill', quality = 'auto', format = 'auto' } = options;

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');

  if (publicIdOrUrl.includes('res.cloudinary.com')) {
    // Insert transformations into existing Cloudinary URL
    return publicIdOrUrl.replace('/upload/', `/upload/${transformString}/`);
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicIdOrUrl}`;
}
