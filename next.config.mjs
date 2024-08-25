/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'imagedelivery.net',
      },
    ],
    domains: ['imagedelivery.net'],
  },
};

export default nextConfig;
