import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory cache in dev to avoid Windows EPERM/memory errors
      config.cache = {
        type: "memory",
      }
    }
    return config
  },
};

export default nextConfig;
