// Media types matching your backend
export interface MediaUploadRequest {
  title: string;
  category_id: number;
  media_type: 'image' | 'video';
  description?: string;
  is_active: boolean;
  files: File[];
}

export interface UploadedFile {
  file_name: string;
  file_size: number;
  file_extension: string;
  mime_type: string;
  file_path: string;
}

export interface MediaUploadResponse {
  media_id: number;
  title: string;
  description: string | null;
  category_id: number;
  media_type: string;
  uploaded_files: UploadedFile[];
  total_files: number;
}

export interface Category {
  id: number;
  category_name: string;
  description: string | null;
  icon: string | null;
  color_code: string | null;
  is_active: boolean;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}