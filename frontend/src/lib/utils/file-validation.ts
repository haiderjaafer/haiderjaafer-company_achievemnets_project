// File validation utilities
export const FILE_CONSTRAINTS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'],
    allowedExtensions: ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
  },
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Validate file type
export function validateFileType(file: File, mediaType: 'image' | 'video'): ValidationResult {
  const constraints = FILE_CONSTRAINTS[mediaType];
  
  // Check MIME type
  if (!constraints.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${constraints.allowedExtensions.join(', ')}`,
    };
  }
  
  return { valid: true };
}

// Validate file size
export function validateFileSize(file: File, mediaType: 'image' | 'video'): ValidationResult {
  const constraints = FILE_CONSTRAINTS[mediaType];
  
  if (file.size > constraints.maxSize) {
    const maxSizeMB = constraints.maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }
  
  return { valid: true };
}

// Validate all files
export function validateFiles(files: File[], mediaType: 'image' | 'video'): ValidationResult {
  // Check file count (max 10)
  if (files.length > 10) {
    return {
      valid: false,
      error: 'Maximum 10 files allowed per upload',
    };
  }
  
  // Validate each file
  for (const file of files) {
    const typeValidation = validateFileType(file, mediaType);
    if (!typeValidation.valid) return typeValidation;
    
    const sizeValidation = validateFileSize(file, mediaType);
    if (!sizeValidation.valid) return sizeValidation;
  }
  
  return { valid: true };
}