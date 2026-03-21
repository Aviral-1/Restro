/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:4040/api',
    NEXT_PUBLIC_WS_URL: process.env.API_URL || 'http://localhost:4040',
  },
};
module.exports = nextConfig;
