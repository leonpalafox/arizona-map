import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Transpile mapbox-gl for Next.js
  transpilePackages: ['mapbox-gl'],

  // Turbopack configuration (empty to silence warning)
  turbopack: {},
};

export default nextConfig;
