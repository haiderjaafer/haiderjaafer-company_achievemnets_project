'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockCarouselItems = [
  {
    id: 1,
    title: "Stunning Mountain Vista",
    description: "Experience breathtaking views of majestic mountains",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    category: "Nature",
    fullDescription:
      "Discover the majestic beauty of mountain landscapes. This stunning vista offers breathtaking views of snow-capped peaks and lush valleys. Perfect for adventure seekers and nature lovers.",
    details: [
      "Elevation: 3,500m",
      "Best Season: Summer",
      "Duration: Full Day",
      "Difficulty: Moderate",
    ],
  },
  {
    id: 2,
    title: "Urban Architecture",
    description: "Modern design meets classic elegance",
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=600&fit=crop",
    category: "Architecture",
    fullDescription:
      "Explore the intersection of modern design and classic elegance in urban architecture. These stunning structures showcase innovation and timeless beauty.",
    details: ["Style: Contemporary", "Location: Downtown", "Built: 2020", "Architect: Renowned Studio"],
  },
  {
    id: 3,
    title: "Ocean Serenity",
    description: "Tranquil waters and golden sunsets",
    imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop",
    category: "Landscape",
    fullDescription:
      "Experience the tranquility of ocean waves and golden sunsets. This serene destination offers the perfect escape from the hustle and bustle of daily life.",
    details: ["Water Temperature: 22°C", "Tide: Moderate", "Best Time: Sunset", "Activities: Swimming"],
  },
  {
    id: 4,
    title: "Forest Dreams",
    description: "Lush greenery and peaceful trails",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
    category: "Nature",
    fullDescription:
      "Immerse yourself in the tranquility of ancient forests. Discover hidden trails, diverse wildlife, and the peaceful sounds of nature.",
    details: ["Area: 5,000 hectares", "Best Season: Spring", "Trails: 15+", "Wildlife: Abundant"],
  },
];

export default function CarouselDetail() {
  const params = useParams();
  const itemId = parseInt(params.id as string, 10);
  const item = mockCarouselItems.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-white">Item not found</h1>
          <Link href="/">
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700"
      >
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
              <ArrowLeft size={20} />
              Back to Carousel
            </button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-96 overflow-hidden"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block px-4 py-2 bg-blue-500 rounded-full text-sm font-semibold mb-4"
          >
            {item.category}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold mb-4"
          >
            {item.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-300 mb-8"
          >
            {item.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 rounded-lg p-8 mb-8 border border-slate-700"
          >
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed">{item.fullDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {item.details.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
              >
                <p className="text-sm text-gray-400">Detail</p>
                <p className="text-lg font-semibold text-blue-400">{detail}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold">
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
