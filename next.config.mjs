/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-notion-x'],
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'avatars.githubusercontent.com' }],
    qualities: [50, 75],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...(process.env.NODE_ENV === 'production'
            ? [{ key: 'X-Content-Type-Options', value: 'nosniff' }]
            : []),
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
