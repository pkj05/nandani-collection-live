import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Allows HTTP images from anywhere (Development ke liye)
      },
      {
        protocol: "https",
        hostname: "**", // Allows HTTPS images from anywhere
      },
      {
        protocol: "http",
        hostname: "192.168.1.6", // Aapka local IP explicitly allow kiya
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;