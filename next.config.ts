import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    viewTransition: true,
    optimizePackageImports: ['framer-motion', '@base-ui/react'],
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
};

export default nextConfig;
