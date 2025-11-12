'use client';

import { X, File, Image as ImageIcon, Video } from 'lucide-react';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatFileSize } from '../lib/utils/format';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  mediaType: 'image' | 'video';
}

export default function FilePreview({ file, onRemove, mediaType }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Generate preview URL for images
  useEffect(() => {
    if (mediaType === 'image') {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Cleanup on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [file, mediaType]);

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow duration-200">
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center space-x-3">
        {/* File icon or preview */}
        <div className="shrink-0">
          {mediaType === 'image' && previewUrl ? (
            <div className="relative w-16 h-16 rounded-md overflow-hidden">
              <Image
                src={previewUrl}
                alt={file.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md">
              {mediaType === 'image' ? (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <Video className="w-8 h-8 text-gray-400" />
              )}
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    </div>
  );
}