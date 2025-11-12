// hooks/useMedia.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiResponse, mediaClient, MediaResponse } from '../api/mediaClient';
import { getSafeImageUrl } from '../utils/imageUrl';


/**
 * Fetch all media from current month
 */
export const useCurrentMonthMedia = (
  categoryId?: number,
  mediaType?: 'image' | 'video'
): UseQueryResult<ApiResponse, Error> => {
  return useQuery({
    queryKey: ['media', 'current-month', categoryId, mediaType],
    queryFn: () => mediaClient.getCurrentMonthMedia(categoryId, mediaType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Fetch media by category
 */
export const useMediaByCategory = (categoryId: number): UseQueryResult<ApiResponse, Error> => {
  return useQuery({
    queryKey: ['media', 'category', categoryId],
    queryFn: () => mediaClient.getMediaByCategory(categoryId),
    staleTime: 5 * 60 * 1000,
  
    retry: 2,
  });
};

/**
 * Fetch only images
 */
export const useImages = (): UseQueryResult<ApiResponse, Error> => {
  return useQuery({
    queryKey: ['media', 'images'],
    queryFn: () => mediaClient.getImages(),
    staleTime: 5 * 60 * 1000,
  
    retry: 2,
  });
};

/**
 * Fetch only videos
 */
export const useVideos = (): UseQueryResult<ApiResponse, Error> => {
  return useQuery({
    queryKey: ['media', 'videos'],
    queryFn: () => mediaClient.getVideos(),
    staleTime: 5 * 60 * 1000,
  
    retry: 2,
  });
};

/**
 * Transform API response to carousel format with proper image URLs
 */
export const transformToCarouselItems = (apiData: MediaResponse[]) => {
  return apiData.map((media) => {
    // Get primary image or first path
    const primaryPath = media.paths.find((p) => p.is_primary) || media.paths[0];

    // Convert file path to accessible URL
    const imageUrl = primaryPath ? getSafeImageUrl(primaryPath.file_path) : '/placeholder.png';

    return {
      id: media.id,
      title: media.title,
      description: media.description,
      imageUrl: imageUrl, // Now this is a proper URL, not a file path
      category: media.category_name,
      mediaType: media.media_type,
      allPaths: media.paths,
      createdAt: media.created_at,
      userId: media.user_id,
      categoryId: media.category_id,
    };
  });
};