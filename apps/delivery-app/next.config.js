/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:4000/api',
    NEXT_PUBLIC_WS_URL: process.env.API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.GOOGLE_MAPS_KEY || 'demo_key',
  },
};
module.exports = nextConfig;
