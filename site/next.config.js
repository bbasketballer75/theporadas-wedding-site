/** Next.js config with modern PWA support */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = {
  reactStrictMode: true,
  // Removed 'output: export' to enable API routes for Canva integration
  // Note: For Firebase hosting, we'll use 'next export' in build script
  images: {
    unoptimized: true,
  },
  // Silence the workspace root warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),

  // Webpack config for FFmpeg.wasm
  webpack: (config) => {
    // FFmpeg.wasm support
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ffmpeg/ffmpeg': require.resolve('@ffmpeg/ffmpeg'),
    };

    return config;
  },
};

module.exports = withPWA(nextConfig);
