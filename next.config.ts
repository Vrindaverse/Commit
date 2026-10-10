import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    viewTransition: true,
    optimizePackageImports: ['framer-motion', '@base-ui/react'],
  },
};

export default nextConfig;
