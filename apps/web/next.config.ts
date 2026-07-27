import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress assets using Gzip and Brotli
  compress: true,

  // Optimize heavy package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@xyflow/react"],
  },

  // Image optimization formats
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
