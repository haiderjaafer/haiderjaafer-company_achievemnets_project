'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, AlertCircle } from 'lucide-react';



import CategorySelect from './CategorySelect';
import FilePreview from './FilePreview';
import UploadProgress from './UploadProgress';
import { MediaUploadRequest } from '../types/media';
import { uploadMedia } from '../lib/api/medai';
import { validateFiles } from '../lib/utils/file-validation';

// Form state interface
interface FormState {
  title: string;
  description: string;
  categoryId: number | null;
  mediaType: 'image' | 'video';
  isActive: boolean;
  files: File[];
}

// Form errors interface
interface FormErrors {
  title?: string;
  categoryId?: string;
  files?: string;
}

export default function MediaUploadForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    categoryId: null,
    mediaType: 'image',
    isActive: true,
    files: [],
  });

  // Form errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload mutation using React Query
  const uploadMutation = useMutation({
    mutationFn: (data: MediaUploadRequest) =>
      uploadMedia(data, (progress) => setUploadProgress(progress)),
    onSuccess: (data) => {
      toast.success(`Successfully uploaded ${data.total_files} file(s)!`);
      
      // Invalidate media queries to refetch
      queryClient.invalidateQueries({ queryKey: ['media'] });
      
      // Reset form
      resetForm();
      
      // Optional: Redirect to media list or detail page
      // router.push(`/media/${data.media_id}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Upload failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  // Reset form to initial state
  const resetForm = () => {
    setFormState({
      title: '',
      description: '',
      categoryId: null,
      mediaType: 'image',
      isActive: true,
      files: [],
    });
    setErrors({});
    setUploadProgress(0);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formState.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    // Validate category
    if (!formState.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    // Validate files
    if (formState.files.length === 0) {
      newErrors.files = 'Please select at least one file';
    } else {
      const validation = validateFiles(formState.files, formState.mediaType);
      if (!validation.valid) {
        newErrors.files = validation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    // Prepare upload data
    const uploadData: MediaUploadRequest = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      category_id: formState.categoryId!,
      media_type: formState.mediaType,
      is_active: formState.isActive,
      files: formState.files,
    };

    // Submit upload
    uploadMutation.mutate(uploadData);
  };

  // Handle file drop/selectionf
  const onDrop = (acceptedFiles: File[]) => {
    // Validate files
    const validation = validateFiles(acceptedFiles, formState.mediaType);
    
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    // Add files to state
    setFormState((prev) => ({
      ...prev,
      files: [...prev.files, ...acceptedFiles].slice(0, 10), // Max 10 files
    }));

    // Clear file errors
    setErrors((prev) => ({ ...prev, files: undefined }));
  };

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      formState.mediaType === 'image'
        ? {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
          }
        : {
            'video/mp4': ['.mp4'],
            'video/quicktime': ['.mov'],
            'video/x-msvideo': ['.avi'],
            'video/x-matroska': ['.mkv'],
          },
    multiple: true,
    maxFiles: 10,
    disabled: uploadMutation.isPending,
  });

  // Remove file from list
  const removeFile = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          العنوان <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formState.title}
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, title: e.target.value }));
            setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          disabled={uploadMutation.isPending}
          placeholder="اكتب العنوان"
          className={`
            w-full px-4 py-3 rounded-lg border
            ${errors.title ? 'border-red-500' : 'border-gray-300'}
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          الوصف
        </label>
        <textarea
          id="description"
          value={formState.description}
          onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
          disabled={uploadMutation.isPending}
          placeholder="اكتب وصف للمنشور"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 resize-none"
        />
      </div>

      {/* Category and Media Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Select */}
        <CategorySelect
          value={formState.categoryId}
          onChange={(categoryId) => {
            setFormState((prev) => ({ ...prev, categoryId }));
            setErrors((prev) => ({ ...prev, categoryId: undefined }));
          }}
          error={errors.categoryId}
        />

        {/* Media Type Select */}
        <div>
          <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-2">
            اختر النوع  <span className="text-red-500">*</span>
          </label>
          <select
            id="mediaType"
            value={formState.mediaType}
            onChange={(e) => {
              setFormState((prev) => ({
                ...prev,
                mediaType: e.target.value as 'image' | 'video',
                files: [], // Clear files when changing type
              }));
            }}
            disabled={uploadMutation.isPending}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <option value="image">صور</option>
            <option value="video">فديو</option>
          </select>
        </div>
      </div>

      {/* Active Status Toggle */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isActive"
          checked={formState.isActive}
          onChange={(e) => setFormState((prev) => ({ ...prev, isActive: e.target.checked }))}
          disabled={uploadMutation.isPending}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active (visible to users)
        </label>
      </div>

      {/* File Upload Dropzone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Files <span className="text-red-500">*</span>
          <span className="text-gray-500 font-normal ml-2">
            (Max 10 files, {formState.mediaType === 'image' ? '10MB' : '100MB'} each)
          </span>
        </label>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
            ${errors.files ? 'border-red-500' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop the files here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-700 font-extrabold">
                اسحب وافلت او اختر الملفات من الحاسبة
              </p>
              <p className="text-sm text-gray-500">
                {formState.mediaType === 'image'
                  ? 'الملفات المدعومة: JPG, PNG, GIF, WebP'
                  : 'الملفات المدعومة: MP4, MOV, AVI, MKV'}
              </p>
            </div>
          )}
        </div>

        {errors.files && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.files}
          </p>
        )}
      </div>

      {/* File Previews */}
      {formState.files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-gray-700">
            الملفات المحددة ({formState.files.length}/10)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formState.files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
                mediaType={formState.mediaType}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadMutation.isPending && (
        <UploadProgress
          progress={uploadProgress}
          status="uploading"
          fileName={formState.files[0]?.name}
        />
      )}

      {uploadMutation.isSuccess && (
        <UploadProgress progress={100} status="success" />
      )}

      {uploadMutation.isError && (
        <UploadProgress progress={0} status="error" />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={uploadMutation.isPending || formState.files.length === 0}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {uploadMutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>تحميل...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>حفظ</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetForm}
          disabled={uploadMutation.isPending}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          اعادة تعيين
        </button>
      </div>
    </form>
  );
}