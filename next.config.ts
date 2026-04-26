import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  typedRoutes: true,
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jdzc3jyqjv.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
