// components/ContinuousCarousel.COMPLETE.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader, Play } from 'lucide-react';
import { DetailPagePremium } from './DetailPagePremium';
import { transformToCarouselItems, useCurrentMonthMedia } from '../lib/hooks/useMedia';
import { getSafeImageUrl } from '../lib/utils/imageUrl';


interface CarouselItemType {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  mediaType: 'image' | 'video';
  allPaths: any[];
  createdAt: string;
  userId: number;
  categoryId: number;
}

interface ContinuousCarouselProps {
  scrollSpeed?: number;
  itemsToShow?: number;
  autoScroll?: boolean;
  categoryId?: number;
  mediaType?: 'image' | 'video';
}

export const ContinuousCarousel: React.FC<ContinuousCarouselProps> = ({
  scrollSpeed = 3000,
  itemsToShow = 4,
  autoScroll = true,
  categoryId,
  mediaType,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<number | null>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefsMap = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: number]: string }>({});

  // Fetch data using React Query
  const { data: apiResponse, isLoading, error } = useCurrentMonthMedia(categoryId, mediaType);

  // Transform API data to carousel format
  const items: CarouselItemType[] = apiResponse
    ? transformToCarouselItems(apiResponse.data)
    : [];

  // Auto-scroll effect (pause when hovering video)
  useEffect(() => {
    if (!autoScroll || items.length === 0 || hoveredVideoId !== null) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, scrollSpeed);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [items.length, scrollSpeed, autoScroll, hoveredVideoId]);

  // Generate video thumbnails when video loads
  const captureVideoThumbnail = (videoId: number, videoElement: HTMLVideoElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        setVideoThumbnails((prev) => ({
          ...prev,
          [videoId]: thumbnail,
        }));
      }
    } catch (err) {
      console.error('Error capturing thumbnail:', err);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleImageClick = (item: CarouselItemType) => {
    setSelectedMediaId(item.id);
    setIsDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    document.body.style.overflow = 'unset';
    setSelectedMediaId(null);
  };

  const handleVideoHover = (item: CarouselItemType) => {
    setHoveredVideoId(item.id);
    // Auto-play video on hover
    setTimeout(() => {
      const video = videoRefsMap.current[item.id];
      if (video) {
        video.play().catch((err) => {
          console.log('Video autoplay prevented:', err.message);
        });
      }
    }, 50);
  };

  const handleVideoLeave = (item: CarouselItemType) => {
    setHoveredVideoId(null);
    // Pause video when leaving
    const video = videoRefsMap.current[item.id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      visible.push(items[(currentIndex + i) % items.length]);
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-96 bg-black/30 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin text-blue-500" size={32} />
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-96 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold">فشل في تحميل البيانات</p>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-400 text-lg font-semibold">لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-5 flex justify-end bg-black/30 w-full">
        <strong className="mr-5 flex items-center text-white">أخر النشاطات</strong>
      </div>

      {/* Main Carousel Container */}
      <div className="relative w-full h-40 overflow-hidden bg-black/30 mb-0.5">
        {/* Carousel Items Grid */}
        <div
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsToShow}, 1fr)`,
            gap: '1rem',
            width: '100%',
            padding: '1rem',
          }}
        >
          {visibleItems.map((item) => {
            const isVideo = item.mediaType === 'video';
            const isHovered = hoveredVideoId === item.id && isVideo;
            const mediaUrl = getSafeImageUrl(item.imageUrl);
            const thumbnail = videoThumbnails[item.id];

            return (
              <div
                key={item.id}
                className="group h-full cursor-pointer w-full mb-8"
                onMouseEnter={() => isVideo && handleVideoHover(item)}
                onMouseLeave={() => isVideo && handleVideoLeave(item)}
                onClick={() => handleImageClick(item)}
              >
                <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-black">
                  {/* HIDDEN VIDEO - Used to capture thumbnail */}
                  {isVideo && !isHovered && (
                    <video
                      ref={(el) => {
                        if (el) {
                          videoRefsMap.current[item.id] = el;
                          // Load first frame for thumbnail
                          el.addEventListener('loadedmetadata', () => {
                            el.currentTime = 1; // Seek to 1 second
                          });
                          el.addEventListener('seeked', () => {
                            if (!thumbnail) {
                              captureVideoThumbnail(item.id, el);
                            }
                          });
                        }
                      }}
                      src={mediaUrl}
                      className="hidden"
                      muted
                      playsInline
                      onError={(e) => {
                        console.error('Video load error:', mediaUrl);
                      }}
                    />
                  )}

                  {/* PLAYING VIDEO - Show when hovered */}
                  {isVideo && isHovered ? (
                    <>
                      <video
                        ref={(el) => {
                          if (el) videoRefsMap.current[item.id] = el;
                        }}
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onError={(e) => {
                          console.error('Video error during playback:', mediaUrl);
                        }}
                      />
                      {/* Subtle gradient overlay for playing video */}
                      <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/5 to-black/20 pointer-events-none" />
                    </>
                  ) : (
                    <>
                      {/* THUMBNAIL or IMAGE - Show by default */}
                      {isVideo ? (
                        // For videos, show thumbnail (captured from video) or video element as poster
                        thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          // Fallback: show static frame from video
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <Play size={48} className="text-white/50" />
                          </div>
                        )
                      ) : (
                        // For images, show actual image
                        <img
                          src={mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image load error:', mediaUrl);
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/20 to-black/70 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                    </>
                  )}

                  {/* Video Badge - Always show for videos */}
                  {isVideo && (
                    <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs font-bold border border-blue-400/50 z-20 shadow-lg flex items-center gap-1">
                      <span>🎬</span>
                      <span>فيديو</span>
                    </div>
                  )}

                  {/* Play Icon - Show only when NOT playing */}
                  {isVideo && !isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center z-15 transition-opacity duration-200">
                      <div className="bg-white/60 hover:bg-white/80 backdrop-blur-sm p-3.5 rounded-full transition-all hover:scale-125 shadow-lg border border-white/40">
                        <Play size={32} className="text-white fill-white drop-shadow-lg" />
                      </div>
                    </div>
                  )}

                  {/* Content - Text on Bottom Left (hide when video playing) */}
                  {!isHovered && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white z-10">
                      {/* Category Badge */}
                      <div className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-1 border border-white/30">
                        {item.category}
                      </div>

                      {/* Title */}
                      <h3 className="text-xs md:text-sm font-bold line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-200 line-clamp-1 group-hover:text-gray-100 transition-colors mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Premium Detail Page Modal */}
      <DetailPagePremium
        mediaId={selectedMediaId}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
};