// components/NewsScroller.UPDATED.tsx
'use client';

import React, { useEffect, useState } from "react";
import { Bell, Zap, TrendingUp, Loader } from "lucide-react";

interface NewsItem {
  id: number;
  text: string;
  icon?: 'bell' | 'zap' | 'trending';
  urgency?: 'high' | 'medium' | 'low';
}

interface NewsScrollerProps {
  news?: NewsItem[];
  isLoading?: boolean;
  error?: Error | null;
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const NewsScroller: React.FC<NewsScrollerProps> = ({
  news = [],
  isLoading = false,
  error = null,
  speed = 4000,
  backgroundColor = "bg-linear-to-r from-blue-600 via-purple-600 to-pink-600",
  textColor = "text-white",
}) => {
  const [offset, setOffset] = useState(0);

  // Duplicate news items for seamless loop
  const duplicatedNews = Array.from({ length: 20 }, () => news).flat();
  const itemWidth = 320;

  // Continuous scrolling animation
  useEffect(() => {
    if (news.length === 0 || isLoading || error) return;

    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev + 3;
        if (newOffset >= news.length * itemWidth) {
          return 0;
        }
        return newOffset;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [news.length, isLoading, error]);

  const getIcon = (iconType?: 'bell' | 'zap' | 'trending') => {
    switch (iconType) {
      case 'bell':
        return <Bell className="w-4 h-4 shrink-0" />;
      case 'zap':
        return <Zap className="w-4 h-4 shrink-0" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 shrink-0" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`w-full ${backgroundColor} overflow-hidden relative`}>
        <div className="py-3 px-4 flex items-center justify-center gap-2">
          <Loader className="w-5 h-5 animate-spin text-white" />
          <span className={`${textColor} font-semibold`}>جاري تحميل الأخبار...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full bg-linear-to-r from-red-600 to-red-700 overflow-hidden relative`}>
        <div className="py-3 px-4">
          <span className={`${textColor} font-semibold`}>
            ⚠️ خطأ في تحميل الأخبار
          </span>
        </div>
      </div>
    );
  }

  // Empty state
  if (news.length === 0) {
    return (
      <div className={`w-full ${backgroundColor} overflow-hidden relative`}>
        <div className="py-3 px-4">
          <span className={`${textColor} font-semibold`}>
            لا توجد أخبار في هذا الوقت
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${backgroundColor} overflow-hidden relative`}>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

      {/* News Container */}
      <div className="py-3 px-4 overflow-hidden">
        <div
          className="flex gap-6 whitespace-nowrap"
          style={{
            transform: `translateX(-${offset}px)`,
            transition: 'transform 0.03s linear',
          }}
        >
          {duplicatedNews.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-pointer shrink-0"
              style={{
                minWidth: `${itemWidth}px`,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              {/* Icon */}
              <div className="shrink-0 text-blue-300">
                {getIcon(item.icon)}
              </div>

              {/* Text */}
              <span className={`${textColor} text-lg md:text-base font-extrabold whitespace-nowrap`}>
                {item.text}
              </span>

              {/* Urgency indicator */}
              {item.urgency && (
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  item.urgency === 'high'
                    ? 'bg-red-500 animate-pulse'
                    : item.urgency === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};