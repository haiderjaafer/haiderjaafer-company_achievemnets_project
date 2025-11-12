// lib/utils/imageUrl.ts

/**
 * Convert Windows file path to Next.js API proxy URL
 * Example input: D:\company_achievemnets\pdfDestination\image\user_4\category_1\image.png
 * Example output: /api/media/image?file=D%3A%5Ccompany_achievemnets%5C...
 */
export const getImageUrl = (filePath: string): string => {
  if (!filePath) return '/placeholder.png';

  try {
    // Encode the entire path for safe URL transmission
    const encodedPath = encodeURIComponent(filePath);
    const url = `/api/media/image?file=${encodedPath}`;
    
    console.log('Image URL converted:', {
      original: filePath,
      encoded: encodedPath,
      final: url
    });
    
    return url;
  } catch (error) {
    console.error('Error encoding image URL:', error);
    return '/placeholder.png';
  }
};

/**
 * Check if string is already an HTTP URL
 */
export const isHttpUrl = (str: string): boolean => {
  if (!str) return false;
  return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/api/');
};

/**
 * Get safe image URL (handles both file paths and URLs)
 * If it's already a URL, return as-is
 * If it's a file path, convert to proxy URL
 */
export const getSafeImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    console.warn('No image path provided');
    return '/placeholder.png';
  }

  // If already a URL, return as-is
  if (isHttpUrl(imagePath)) {
    console.log('Already a URL:', imagePath);
    return imagePath;
  }

  // If it looks like a file path, convert to proxy URL
  if (imagePath.includes('\\') || imagePath.includes('/')) {
    const proxyUrl = getImageUrl(imagePath);
    console.log('Converted file path to proxy URL:', proxyUrl);
    return proxyUrl;
  }

  console.warn('Unknown image path format:', imagePath);
  return '/placeholder.png';
};

/**
 * Validate image URL is accessible
 * Use this for debugging
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Image URL validation failed:', imageUrl, error);
    return false;
  }
};