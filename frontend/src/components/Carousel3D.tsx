'use client';

import React, { useState, useEffect } from 'react';

interface CardData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string[];
}

interface AutoCarouselProps {
  autoPlayInterval?: number; // Time in milliseconds (default: 3000)
  pauseOnHover?: boolean; // Pause when hovering over carousel (default: true)
}

const cardsData: CardData[] = [
  {
    id: 1,
    image: '/p1.jpg',
    title: 'Zenitsu Agatsuma',
    subtitle: 'THUNDER BREATHING USER',
    description: [
      'A skilled demon slayer with incredible speed',
      'Master of Thunder Breathing techniques',
      'Transforms when unconscious'
    ]
  },
  {
    id: 2,
    image: '/p2.jpg',
    title: 'Inosuke Hashibira',
    subtitle: 'BEAST BREATHING USER',
    description: [
      'Wild and aggressive fighting style',
      'Dual wielding sword master',
      'Raised by boars in the mountains'
    ]
  },
  {
    id: 3,
    image: '/p3.jpg',
    title: 'Giyu Tomioka',
    subtitle: 'WATER HASHIRA',
    description: [
      'Water Hashira of the Demon Slayer Corps',
      'Master of Water Breathing',
      'Calm and collected warrior'
    ]
  },
  {
    id: 4,
    image: '/p4.jpg',
    title: 'Nezuko Kamado',
    subtitle: 'DEMON SLAYER',
    description: [
      'Tanjiro\'s younger sister',
      'Demon with human emotions',
      'Powerful blood demon art'
    ]
  }
];

export default function AutoCarousel({ 
  autoPlayInterval = 3000, 
  pauseOnHover = true 
}: AutoCarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % cardsData.length);
      setTimeout(() => setIsAnimating(false), 600);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, autoPlayInterval]);

  const getCardStyle = (index: number) => {
    const diff = (index - currentIndex + cardsData.length) % cardsData.length;
    
    if (diff === 0) {
      return {
        transform: 'translateX(0) translateY(0) translateZ(0) scale(1)',
        opacity: 1,
        zIndex: 50,
        filter: 'grayscale(0%) brightness(100%)',
      };
    } else if (diff === 1) {
      return {
        transform: 'translateX(-30px) translateY(-40px) translateZ(-100px) scale(0.85) rotateY(-5deg)',
        opacity: 0.7,
        zIndex: 40,
        filter: 'grayscale(70%) brightness(60%)',
      };
    } else if (diff === 2) {
      return {
        transform: 'translateX(-60px) translateY(-80px) translateZ(-200px) scale(0.7) rotateY(-8deg)',
        opacity: 0.5,
        zIndex: 30,
        filter: 'grayscale(90%) brightness(40%)',
      };
    } else if (diff === 3) {
      return {
        transform: 'translateX(-90px) translateY(-120px) translateZ(-300px) scale(0.6) rotateY(-10deg)',
        opacity: 0.3,
        zIndex: 20,
        filter: 'grayscale(100%) brightness(30%)',
      };
    } else {
      return {
        transform: 'translateX(-120px) translateY(-160px) translateZ(-400px) scale(0.5)',
        opacity: 0,
        zIndex: 10,
        filter: 'grayscale(100%) brightness(20%)',
      };
    }
  };

  const currentCard = cardsData[currentIndex];

  return (
    <div 
      className="relative w-full h-screen bg-linear-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div className="absolute inset-0 flex items-center justify-between px-20">
        
        {/* Left side - 3D Card Stack */}
        <div className="relative w-[600px] h-[600px]" style={{ perspective: '2000px' }}>
          <div className="relative w-full h-full">
            {cardsData.map((card, index) => (
              <div
                key={card.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] transition-all duration-700 ease-out"
                style={{
                  ...getCardStyle(index),
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Info Panel */}
        <div className="flex-1 max-w-xl pl-20">
          <div className="space-y-8">

            {/* Character Info */}
            <div className="space-y-4 animate-fadeIn" key={currentIndex}>
              <div>
                <h2 className="text-5xl font-bold text-red-500 mb-2 tracking-tight">
                  {currentCard.title}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-linear-to-r from-red-500/50 to-transparent" />
                </div>
                <p className="text-gray-400 text-sm tracking-[0.3em] mt-2 uppercase">
                  {currentCard.subtitle}
                </p>
              </div>

              {/* Description Lines */}
              <div className="space-y-3 mt-8">
                {currentCard.description.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="h-px flex-1 bg-linear-to-r from-gray-600 to-gray-800 group-hover:from-red-500/50 transition-all" />
                  </div>
                ))}
                <div className="h-0.5 w-full bg-linear-to-r from-red-500 via-red-400 to-transparent" />
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-linear-to-r from-gray-700 to-gray-800" />
                  </div>
                ))}
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2 mt-8 justify-center">
                {cardsData.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex 
                        ? 'w-8 bg-red-500' 
                        : 'w-2 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}