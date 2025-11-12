// components/ContinuousCarousel.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { DetailPage } from './Detailpage';
import { transformToCarouselItems, useCurrentMonthMedia } from '../lib/hooks/useMedia';


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
  const [selectedItem, setSelectedItem] = useState<CarouselItemType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch data using React Query
  const { data: apiResponse, isLoading, error } = useCurrentMonthMedia(categoryId, mediaType);

  // Transform API data to carousel format
  const items: CarouselItemType[] = apiResponse
    ? transformToCarouselItems(apiResponse.data)
    : [];

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || items.length === 0) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, scrollSpeed);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [items.length, scrollSpeed, autoScroll]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Open detail page
  const handleImageClick = (item: CarouselItemType) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close detail page
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Get visible items
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
          <p className="text-white">Loading media...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-96 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold">Failed to load media</p>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center">
        <p className="text-slate-400 text-lg font-semibold">No media available</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-5 flex justify-end bg-black/30 w-full">
        <strong className="mr-5 flex items-center">أخر النشاطات</strong>
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
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="group h-full cursor-pointer w-full mb-8"
              onClick={() => handleImageClick(item)}
            >
              <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {/* Card Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-black/0 via-black/20 to-black/70 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

                {/* Content - Text on Bottom Left */}
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
              </div>
            </div>
          ))}
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

      {/* Detail Page Modal */}
      {selectedItem && (
        <DetailPage item={selectedItem} isOpen={isDetailOpen} onClose={handleCloseDetail} />
      )}
    </>
  );
};