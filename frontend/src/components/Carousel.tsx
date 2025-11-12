'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=300&fit=crop',
    title: 'Creative Innovation',
    description: 'Transform your ideas into reality with cutting-edge technology',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1579321338693-c40145078519?w=1200&h=300&fit=crop',
    title: 'Digital Excellence',
    description: 'Experience the future of web development today',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=300&fit=crop',
    title: 'Smart Solutions',
    description: 'Intelligent design meets powerful performance',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=1200&h=300&fit=crop',
    title: 'Future Ready',
    description: 'Building tomorrow, today with modern tech stack',
  },
];

export const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-xl shadow-2xl bg-gray-900">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={carouselItems[current].image}
            alt={carouselItems[current].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center pl-12 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <motion.h2
              className="text-5xl font-bold text-white max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {carouselItems[current].title}
            </motion.h2>
            <motion.p
              className="text-xl text-gray-200 max-w-xl font-light"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {carouselItems[current].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {carouselItems.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1);
              setCurrent(idx);
            }}
            className={`h-3 rounded-full transition-all cursor-pointer ${
              idx === current ? 'bg-white w-8' : 'bg-white/40 w-3'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <motion.button
        onClick={() => {
          setDirection(-1);
          setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Prev
      </motion.button>

      <motion.button
        onClick={() => {
          setDirection(1);
          setCurrent((prev) => (prev + 1) % carouselItems.length);
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Next →
      </motion.button>
    </div>
  );
};