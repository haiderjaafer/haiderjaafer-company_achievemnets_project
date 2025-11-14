// components/DetailPagePremium.FIXED.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ChevronLeft, ChevronRight, Download, Eye, Share2, Heart, Play } from 'lucide-react';
import { useMediaDetails } from '../lib/hooks/useMediaDetails';
import { getSafeImageUrl } from '../lib/utils/imageUrl';


interface DetailPageProps {
  mediaId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DetailPagePremium: React.FC<DetailPageProps> = ({ mediaId, isOpen, onClose }) => {
  // ✅ All hooks MUST be at the top, before any conditional logic
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  // Always call the hook, even if mediaId is null
  const { data: media, isLoading, error } = useMediaDetails(mediaId || 0);

  // ✅ useEffect must be called unconditionally
  useEffect(() => {
    // Reset image index when media changes
    setSelectedImageIndex(0);
    setAutoScroll(true);
    setVideoError(null);
  }, [mediaId]);

  // ✅ Auto scroll effect - unconditional call (but skip for videos)
  useEffect(() => {
    const totalImages = media?.paths?.length || 0;
    const currentItem = media?.paths?.[selectedImageIndex];
    const isCurrentVideo = currentItem?.mime_type?.startsWith('video/');
    
    // Early return is OK, but hook call itself must be unconditional
    // Don't auto-scroll if current item is a video
    if (!autoScroll || totalImages === 0 || !isOpen || isCurrentVideo) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prev) => {
        const nextIndex = (prev + 1) % totalImages;
        // Check if next item is video, if so, disable auto-scroll
        const nextItem = media?.paths?.[nextIndex];
        if (nextItem?.mime_type?.startsWith('video/')) {
          setAutoScroll(false);
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, media?.paths, selectedImageIndex, isOpen]);

  // ✅ Early return AFTER all hooks
  if (!isOpen || !mediaId) return null;

  const item = media;
  const currentImage = item?.paths[selectedImageIndex];
  const totalImages = item?.paths.length || 0;
  const isCurrentVideo = currentImage?.mime_type?.startsWith('video/');

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    setAutoScroll(false);
    setVideoError(null);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % totalImages);
    setAutoScroll(false);
    setVideoError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get proper video URL - videos use the same getSafeImageUrl function
  const getMediaUrl = (path: string, isVideo: boolean = false) => {
    const url = getSafeImageUrl(path);
    console.log('🎬 Media URL:', { path, isVideo, url });
    return url;
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-slate-900 rounded-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-white mt-4">جاري التحميل...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-red-900 rounded-lg p-8">
            <p className="text-white">خطأ في التحميل</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
            >
              إغلاق
            </button>
          </div>
        </div>
      </>
    );
  }

  // Debug current media
  console.log('🔍 Current Media:', {
    mediaId,
    currentImage,
    isVideo: isCurrentVideo,
    path: currentImage?.file_path,
    mimeType: currentImage?.mime_type,
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Detail Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-r from-black/80 to-transparent backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={24} />
                <span className="hidden sm:inline text-sm">العودة</span>
              </button>

              <h1 className="text-xl md:text-2xl font-bold text-white truncate px-4">{item.title}</h1>

              <button
                onClick={onClose}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-all hover:scale-110"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Image Gallery Section */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Main Image/Video Viewer */}
              <div className="lg:col-span-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group">
                  {/* Main Image/Video */}
                  <div className="relative h-[400px] md:h-[500px] bg-slate-900">
                    {isCurrentVideo ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {videoError ? (
                          <div className="text-center p-8">
                            <p className="text-red-400 mb-2">❌ خطأ في تحميل الفيديو</p>
                            <p className="text-gray-400 text-sm mb-4">{videoError}</p>
                            <p className="text-gray-500 text-xs">المسار: {currentImage?.file_path}</p>
                          </div>
                        ) : (
                          <video
                            key={`video-${currentImage?.id}`}
                            src={getMediaUrl(currentImage?.file_path || '', true)}
                            className="w-full h-full object-contain bg-black"
                            controls
                            autoPlay
                            loop
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              const error = (e.target as HTMLVideoElement).error;
                              const errorMsg = error ? 
                                `Error Code: ${error.code} - ${error.message}` : 
                                'Unknown video error';
                              console.error('❌ Video Error:', {
                                path: currentImage?.file_path,
                                url: getMediaUrl(currentImage?.file_path || '', true),
                                error: errorMsg
                              });
                              setVideoError(errorMsg);
                            }}
                            onLoadStart={() => {
                              console.log('▶️ Video loading started');
                              setVideoError(null);
                            }}
                            onLoadedData={() => {
                              console.log('✅ Video loaded successfully');
                            }}
                          >
                            <source 
                              src={getMediaUrl(currentImage?.file_path || '', true)} 
                              type={currentImage?.mime_type || 'video/mp4'} 
                            />
                            متصفحك لا يدعم تشغيل الفيديو
                          </video>
                        )}
                      </div>
                    ) : (
                      <img
                        src={getMediaUrl(currentImage?.file_path || '')}
                        alt={currentImage?.file_name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('❌ Image Error:', currentImage?.file_path);
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    )}

                    {/* Gradient Overlay - Only for images */}
                    {!isCurrentVideo && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    )}

                    {/* Navigation Arrows */}
                    {totalImages > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 z-10"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Image/Video Counter */}
                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold z-10">
                      {selectedImageIndex + 1} / {totalImages}
                    </div>

                    {/* Media Type Badge */}
                    {isCurrentVideo ? (
                      <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold border border-blue-400/50 flex items-center gap-1 z-10">
                        <Play size={14} className="fill-white" />
                        <span>فيديو</span>
                      </div>
                    ) : currentImage?.is_primary ? (
                      <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold z-10">
                        ⭐ الصورة الأساسية
                      </div>
                    ) : null}

                    {/* Action Buttons - Only for images */}
                    {!isCurrentVideo && (
                      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm">
                          <Heart size={20} fill="currentColor" />
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm">
                          <Share2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Image/Video Info Bar */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-t border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-lg">{currentImage?.file_name}</h3>
                          {isCurrentVideo && (
                            <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full border border-blue-500/50">
                              فيديو
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{currentImage?.mime_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">الحجم</p>
                        <p className="text-white font-semibold">{formatFileSize(currentImage?.file_size || 0)}</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs">
                      تم الإنشاء: {formatDate(currentImage?.created_at || '')}
                    </p>
                  </div>

                  {/* Thumbnails */}
                  {totalImages > 1 && (
                    <div className="bg-slate-900 border-t border-white/10 p-4">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {item.paths.map((path, index) => {
                          const isVideo = path.mime_type?.startsWith('video/');
                          return (
                            <button
                              key={path.id}
                              onClick={() => {
                                setSelectedImageIndex(index);
                                setAutoScroll(false);
                              }}
                              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                                selectedImageIndex === index
                                  ? 'border-blue-500 scale-105'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <img
                                src={getMediaUrl(path.file_path)}
                                alt={path.file_name}
                                className="w-full h-full object-cover"
                              />
                              {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <Play size={20} className="text-white fill-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Sidebar */}
              <div className="space-y-6">
                {/* Main Info Card */}
                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-4">المعلومات</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">النوع</p>
                      <p className="text-white font-semibold capitalize">{item.media_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">الفئة</p>
                      <p className="text-white font-semibold">{item.category_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">عدد الملفات</p>
                      <p className="text-white font-semibold">{totalImages}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">تاريخ الإنشاء</p>
                      <p className="text-white font-semibold text-sm">{formatDate(item.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Description Card */}
                <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">الوصف</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4">الإحصائيات</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">جودة الملفات</span>
                        <span className="text-blue-300 font-bold">92%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-blue-400 to-blue-600"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">المشاهدات</span>
                        <span className="text-green-300 font-bold">88%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[88%] bg-gradient-to-r from-green-400 to-green-600"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 ${
                      isLiked
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <Heart size={18} className="inline mr-2" fill={isLiked ? 'currentColor' : 'none'} />
                    {isLiked ? 'مفضل' : 'إضافة للمفضلة'}
                  </button>
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95">
                    <Download size={18} className="inline mr-2" />
                    تحميل
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>

            {/* Files Section */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Eye size={24} className="text-blue-400" />
                جميع الملفات ({totalImages})
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {item.paths.map((path, index) => {
                  const isVideo = path.mime_type?.startsWith('video/');
                  return (
                    <div
                      key={path.id}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-700/20 border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setAutoScroll(false);
                      }}
                    >
                      <div className="flex gap-4">
                        {/* Thumbnail */}
                        <div className="shrink-0 relative">
                          <img
                            src={getMediaUrl(path.file_path)}
                            alt={path.file_name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                              <Play size={20} className="text-white fill-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h4 className="text-white font-semibold truncate">{path.file_name}</h4>
                            {isVideo && (
                              <span className="px-2 py-1 bg-blue-600/30 text-blue-300 text-xs rounded-full border border-blue-500/50 shrink-0">
                                فيديو
                              </span>
                            )}
                            {path.is_primary && (
                              <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs rounded-full border border-green-500/50 shrink-0">
                                أساسي
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                            <div>
                              <p className="text-gray-500">النوع</p>
                              <p className="text-white font-semibold">{path.file_extension.toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">الحجم</p>
                              <p className="text-white font-semibold">{formatFileSize(path.file_size)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">الترتيب</p>
                              <p className="text-white font-semibold">{index + 1}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Icons */}
                        <div className="flex flex-col gap-2 justify-center">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Eye size={16} className="text-blue-400" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Download size={16} className="text-green-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 mt-20 py-8 bg-slate-950/50">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-sm">
                © 2024 نظام إنجازيات الشركة | تم الإنشاء: {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </>
  );
};