// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Generate file preview URL
export function getFilePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

// Clean up preview URL
export function revokeFilePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}