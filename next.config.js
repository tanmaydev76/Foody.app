/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    /* allow images to be served directly without Next.js proxy in dev */
    unoptimized: true,
  },
};

module.exports = nextConfig;
