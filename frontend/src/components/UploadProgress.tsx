'use client';

import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  fileName?: string;
}

export default function UploadProgress({ progress, status, fileName }: UploadProgressProps) {
  if (status === 'idle') return null;

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4">
      {/* Status icon and text */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {status === 'uploading' && (
            <>
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-sm font-medium text-gray-700">
                Uploading...
              </span>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                Upload successful!
              </span>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                Upload failed
              </span>
            </>
          )}
        </div>
        
        {/* Progress percentage */}
        {status === 'uploading' && (
          <span className="text-sm font-medium text-gray-700">
            {progress}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {status === 'uploading' && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* File name */}
      {fileName && (
        <p className="text-xs text-gray-500 mt-2 truncate">
          {fileName}
        </p>
      )}
    </div>
  );
}