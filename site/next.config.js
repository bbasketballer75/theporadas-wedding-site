/** Next.js config with modern PWA support */

// Detect Turbopack via environment flags commonly used by Next.js and tooling.
const isTurbopack =
  process.env.TURBOPACK === '1' ||
  process.env.NEXT_TURBOPACK === '1' ||
  process.env.TURBOPACK === 'true' ||
  process.env.NEXT_TURBOPACK === 'true';

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Ensure PWA plugin is explicitly disabled during development and when Turbopack is active
  disable:
    process.env.NODE_ENV === 'development' ||
    (typeof isTurbopack !== 'undefined' && isTurbopack === true),
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

  // Silence workspace root inference warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),

  // Security headers for production
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },



  // Removed 'output: export' to enable API routes for Canva integration
  // Note: For Firebase hosting, we'll use 'next export' in build script
  images: {
    unoptimized: false, // Enable optimization for better performance
    domains: ['wedding-website-jgfleztfx-austins-projects-bb7c50ab.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow Supabase CDN images
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app', // Allow Vercel preview domains
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack config for FFmpeg.wasm
  // NOTE: Turbopack (Next's new dev server) will warn if a `webpack` field is present.
  // To avoid the "Webpack is configured while Turbopack is not" developer warning
  // we only add the webpack override to the exported config when Turbopack is NOT enabled.
  // If Turbopack is enabled in the environment, we omit the property entirely so Next
  // does not surface the developer warning.
  //
};

// Only inject a webpack override when Turbopack is not enabled
if (!isTurbopack) {
  nextConfig.webpack = (config) => {
    // Disable Webpack's pack file cache on Windows network paths to prevent
    // repeated "Unable to snapshot resolve dependencies" warnings during builds.
    config.cache = false;

    // FFmpeg.wasm support
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ffmpeg/ffmpeg': require.resolve('@ffmpeg/ffmpeg'),
    };

    return config;
  };
}

// Export config with PWA wrapper
const finalConfig = withPWA(nextConfig);

// If Turbopack is active, remove any webpack property that may have been injected by plugins
if (isTurbopack && finalConfig && Object.prototype.hasOwnProperty.call(finalConfig, 'webpack')) {
  delete finalConfig.webpack;
}

module.exports = finalConfig;
