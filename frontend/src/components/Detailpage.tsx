// components/DetailPage.refactored.tsx
'use client';

import React, { useState } from 'react';
import { X, ArrowLeft, Download, Eye } from 'lucide-react';
import { getSafeImageUrl } from '../lib/utils/imageUrl';


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

interface CarouselItemType {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  mediaType: 'image' | 'video';
  allPaths: MediaPath[];
  createdAt: string;
  userId: number;
  categoryId: number;
}

interface DetailPageProps {
  item: CarouselItemType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ item, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const currentImage = item.allPaths[selectedImageIndex];

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      />

      {/* Detail Page Modal */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-out',
        }}
      >
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-linear-to-br from-black/80 to-transparent backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors duration-300"
              >
                <ArrowLeft size={24} />
                <span className="hidden sm:inline">Back</span>
              </button>

              <h1 className="text-2xl md:text-3xl font-bold text-white truncate">{item.title}</h1>

              <button
                onClick={onClose}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Hero Image Section */}
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-12"
              style={{
                animation: isOpen ? 'slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
            >
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-black">
                <img
                  src={getSafeImageUrl(currentImage?.file_path || item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  style={{
                    animation: isOpen ? 'zoomIn 0.8s ease-out' : 'none',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div
                  className="absolute top-6 left-6 px-4 py-2 bg-blue-600/80 backdrop-blur-md rounded-full text-white text-sm font-bold border border-blue-400/50"
                  style={{
                    animation: isOpen ? 'fadeInDown 0.6s ease-out 0.2s both' : 'none',
                  }}
                >
                  {item.category}
                </div>

                {/* Media Type Badge */}
                <div
                  className="absolute top-6 right-6 px-4 py-2 bg-purple-600/80 backdrop-blur-md rounded-full text-white text-sm font-bold border border-purple-400/50 uppercase"
                  style={{
                    animation: isOpen ? 'fadeInDown 0.6s ease-out 0.2s both' : 'none',
                  }}
                >
                  {item.mediaType}
                </div>

                {/* Image Info Overlay */}
                <div
                  className="absolute bottom-6 left-6 right-6"
                  style={{
                    animation: isOpen ? 'fadeInUp 0.6s ease-out 0.3s both' : 'none',
                  }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{item.title}</h2>
                  <p className="text-lg text-gray-200 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div
                className="md:col-span-2"
                style={{
                  animation: isOpen ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
                }}
              >
                {/* Description Card */}
                <div className="bg-linear-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">About</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{item.description}</p>
                </div>

                {/* All Media Files Section */}
                <div
                  className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                  style={{
                    animation: isOpen ? 'fadeInUp 0.6s ease-out 0.5s both' : 'none',
                  }}
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Media Files ({item.allPaths.length})</h3>

                  {/* File List */}
                  <div className="space-y-3">
                    {item.allPaths.map((path, index) => (
                      <div
                        key={path.id}
                        className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                          selectedImageIndex === index
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'bg-slate-700/20 border-white/10 hover:border-white/30'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-semibold truncate">{path.file_name}</h4>
                              {path.is_primary && (
                                <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full border border-green-500/50">
                                  Primary
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                              <div>
                                <p className="text-gray-500 text-xs">Type</p>
                                <p className="text-white">{path.file_extension.toUpperCase()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Size</p>
                                <p className="text-white">{formatFileSize(path.file_size)}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-500 text-xs">Created</p>
                                <p className="text-white text-xs">{formatDate(path.created_at)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} className="text-blue-400" />
                            </button>
                            <button
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download size={18} className="text-green-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div
                className="space-y-6"
                style={{
                  animation: isOpen ? 'fadeInRight 0.6s ease-out 0.4s both' : 'none',
                }}
              >
                {/* Info Cards */}
                <div className="bg-linear-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Media Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="text-white font-semibold uppercase">{item.mediaType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="text-white font-semibold">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Files</p>
                      <p className="text-white font-semibold">{item.allPaths.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="text-white font-semibold text-xs">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Current File Info */}
                {currentImage && (
                  <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Current File
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-white text-xs font-mono truncate">{currentImage.file_name}</p>
                      <p className="text-gray-400">Size: {formatFileSize(currentImage.file_size)}</p>
                      <p className="text-gray-400">Type: {currentImage.mime_type}</p>
                      {currentImage.is_primary && (
                        <p className="text-green-400 font-semibold">Primary File</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="border-t border-white/10 mt-20 py-8"
            style={{
              animation: isOpen ? 'fadeIn 0.6s ease-out 0.6s both' : 'none',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500">
                © 2024 Company Achievements. Created on {formatDate(item.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};