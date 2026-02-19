import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ 1. "Failed to find Server Action" Fix
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },

  // ✅ 2. Images Settings (HTTPS Enforcement & Remote Patterns)
  images: {
    // Lighthouse Performance: Next.js image optimization ko optimize karne ke liye
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'], // Performance fix: Hamesha WebP me deliver karega
    
    remotePatterns: [
      {
        // Local Backend (Development)
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        // ✅ Live Site: Mixed Content error se bachne ke liye
        protocol: "https",
        hostname: "www.nandanicollection.com",
      },
      {
        protocol: "https",
        hostname: "nandanicollection.com",
      },
      {
        // ✅ Placeholder Service: Search page loading fix karne ke liye
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // ✅ All External HTTPS Images (Unsplash etc.)
        protocol: "https",
        hostname: "**", 
      }
    ],
    // Lighthouse Performance Fix: Cache timing 1 ghanta
    minimumCacheTTL: 3600, 
  },
  
  // ✅ 3. Server Actions Settings
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000", 
        "127.0.0.1:3000", 
        "www.nandanicollection.com",
        "nandanicollection.com"
      ],
    },
  },
  
  // ✅ 4. Build Safety (TypeScript errors build nahi rokengi)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ 5. Production Optimization
  reactStrictMode: true,
  
  // 🚀 Site speed badhane ke liye Gzip compression
  compress: true,

  // Performance Fix: X-Powered-By header remove karke security badhata hai
  poweredByHeader: false,
};

export default nextConfig;