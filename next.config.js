/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*',
        protocol: 'http',
      },
      {
        hostname: '*',
        protocol: 'https',
      },
    ],
  },
};

module.exports = nextConfig;
