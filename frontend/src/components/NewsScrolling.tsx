'use client';

import React, { useEffect, useState } from "react";
import { Bell, Zap, TrendingUp } from "lucide-react";

interface NewsItem {
  id: number;
  text: string;
  icon?: 'bell' | 'zap' | 'trending';
  urgency?: 'high' | 'medium' | 'low';
}

interface NewsScrollerProps {
  news: NewsItem[];
  speed?: number; // milliseconds per item
  backgroundColor?: string;
  textColor?: string;
}

export const NewsScroller: React.FC<NewsScrollerProps> = ({
  news,
  speed = 4000,
  backgroundColor = "bg-linear-to-r from-blue-600 via-purple-600 to-pink-600",
  textColor = "text-white",
}) => {
  const [offset, setOffset] = useState(0);

  // Duplicate news items many times for seamless loop
  const duplicatedNews = Array.from({ length: 20 }, () => news).flat();
  const itemWidth = 320; // Approximate width of each item in pixels

  // Continuous scrolling animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev + 3; // Scroll by 2 pixels each frame
        // Reset when we've scrolled through one cycle
        if (newOffset >= news.length * itemWidth) {
          return 0;
        }
        return newOffset;
      });
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(interval);
  }, [news.length]);

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