// lib/api/mediaClient.ts
import axios, { AxiosInstance } from 'axios';

interface MediaPath {
  id: number;
  file_path: string;
  file_name: string;
  file_size: number;
  file_extension: string;
  mime_type: string;
  is_primary: boolean;
  created_at: string;
}

interface MediaResponse {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category_name: string;
  user_id: number;
  media_type: 'image' | 'video';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: number | null;
  paths: MediaPath[];
}

interface ApiResponse {
  success: boolean;
  data: MediaResponse[];
  total: number;
  date_range: {
    start: string;
    end: string;
  };
}

class MediaClient {
  private api: AxiosInstance;
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add error handling interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        throw error;
      }
    );
  }

  /**
   * Get all media from current month
   */
  async getCurrentMonthMedia(
    categoryId?: number,
    mediaType?: 'image' | 'video'
  ): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId.toString());
      if (mediaType) params.append('media_type', mediaType);

      const response = await this.api.get<ApiResponse>(
        `/api/media/current-month${params.toString() ? '?' + params.toString() : ''}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current month media:', error);
      throw error;
    }
  }

  /**
   * Get media by category
   */
  async getMediaByCategory(categoryId: number): Promise<ApiResponse> {
    try {
      const response = await this.api.get<ApiResponse>(
        `/api/media/current-month?category_id=${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch media by category:', error);
      throw error;
    }
  }

  /**
   * Get only images
   */
  async getImages(): Promise<ApiResponse> {
    try {
      const response = await this.api.get<ApiResponse>(
        `/api/media/current-month?media_type=image`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch images:', error);
      throw error;
    }
  }

  /**
   * Get only videos
   */
  async getVideos(): Promise<ApiResponse> {
    try {
      const response = await this.api.get<ApiResponse>(
        `/api/media/current-month?media_type=video`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const mediaClient = new MediaClient();
export type { MediaResponse, MediaPath, ApiResponse };