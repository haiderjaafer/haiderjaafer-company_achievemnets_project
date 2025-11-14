// hooks/useNewsTitles.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';

interface Title {
  id: number;
  title: string;
  description: string;
  category_id: number;
  media_type: 'image' | 'video';
  created_at: string;
  is_active: boolean;
}

interface NewsItem {
  id: number;
  text: string;
  icon: 'bell' | 'zap' | 'trending';
  urgency: 'high' | 'medium' | 'low';
}

interface TitlesResponse {
  success: boolean;
  data: Title[];
  total: number;
  date_range: {
    start: string;
    end: string;
  };
}

/**
 * Fetch titles from current month and convert to NewsItem format
 */
export const useNewsTitles = (): UseQueryResult<NewsItem[], Error> => {
  return useQuery({
    queryKey: ['news', 'titles'],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000'}/api/media/current-month/titles`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch titles');
        }

        const data: TitlesResponse = await response.json();

        // Convert titles to NewsItem format
        const newsItems: NewsItem[] = data.data.map((title, index) => {
          // Rotate through icon types
          const icons: Array<'bell' | 'zap' | 'trending'> = ['bell', 'zap', 'trending'];
          const icon = icons[index % icons.length];

          // Rotate through urgency levels
          const urgencies: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
          const urgency = urgencies[index % urgencies.length];

          return {
            id: title.id,
            text: `${index % 3 === 0 ? '🚀 ' : index % 3 === 1 ? '📈' : '🌟'} ${title.title}`,
            icon,
            urgency,
          };
        });

        return newsItems;
      } catch (error) {
        console.error('Error fetching news titles:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
   
    retry: 2,
  });
};