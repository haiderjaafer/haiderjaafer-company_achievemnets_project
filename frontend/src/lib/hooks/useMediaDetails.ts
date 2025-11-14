// hooks/useMediaDetails.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MediaResponse } from '../api/mediaClient';


/**
 * Fetch single media with all its files
 */
export const useMediaDetails = (mediaId: number): UseQueryResult<MediaResponse, Error> => {
  return useQuery({
    queryKey: ['media', 'details', mediaId],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000'}/api/media/${mediaId}/files`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch media details');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching media details:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
   
    retry: 2,
    enabled: !!mediaId, // Only run if mediaId exists
  });
};