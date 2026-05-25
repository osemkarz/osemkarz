/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow build to succeed even when Google Fonts are temporarily unavailable
  experimental: {
    optimizePackageImports: [],
  },
};
export default nextConfig;
