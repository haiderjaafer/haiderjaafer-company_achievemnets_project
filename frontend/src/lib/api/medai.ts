import { Category, MediaUploadRequest, MediaUploadResponse } from '@/src/types/media';
import axios, { AxiosProgressEvent } from 'axios';


// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

// Create axios instance with cookie support
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: This sends cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      withCredentials: config.withCredentials,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
    });

    // If 401, redirect to login
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);



// Upload media (requires auth - cookie sent automatically)
export async function uploadMedia(
  data: MediaUploadRequest,
  onProgress?: (progress: number) => void
): Promise<MediaUploadResponse> {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('category_id', data.category_id.toString());
  formData.append('media_type', data.media_type);
  formData.append('is_active', data.is_active.toString());
  
  if (data.description) {
    formData.append('description', data.description);
  }
  
  data.files.forEach((file) => {
    formData.append('files', file);
  });
  
  const response = await apiClient.post<MediaUploadResponse>(
    '/api/media/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(progress);
        }
      },
    }
  );
  
  return response.data;
}

// Fetch categories
export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/api/categories');
  return response.data;
}

// Fetch media by ID
export async function fetchMediaById(mediaId: number): Promise<MediaUploadResponse> {
  const response = await apiClient.get<MediaUploadResponse>(`/api/media/${mediaId}/files`);
  return response.data;
}