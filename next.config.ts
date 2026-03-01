import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/business/existing-users/ladder/ojt-design-first-3months',
        destination: '/business/existing-users/ladder/ojt-checklist',
        permanent: true,
      },
      {
        source: '/business/existing-users/ladder/tokutei-roadmap-3years',
        destination: '/business/existing-users/ladder/roadmap-y2',
        permanent: true,
      },
      {
        source: '/business/existing-users/ladder/tokutei2-exam-company-support',
        destination: '/business/existing-users/ladder/exam-support',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
