/** Minimal Next.js config for a simple static app */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Silence the workspace root warning
  outputFileTracingRoot: require('path').join(__dirname, '../'),
};
module.exports = nextConfig
