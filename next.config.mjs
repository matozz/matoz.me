import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [{ key: 'Permissions-Policy', value: 'interest-cohort=()' }],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, '.');
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
};

export default nextConfig;
