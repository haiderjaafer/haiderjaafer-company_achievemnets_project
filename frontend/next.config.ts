import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "www.stickpng.com",  // For barrel
      },
      {
        protocol: "https",
        hostname: "www.seekpng.com",   // For tanker & refinery
      },
    ],
  },
};

export default nextConfig;