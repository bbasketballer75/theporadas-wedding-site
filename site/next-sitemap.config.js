/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://wedding-website-15zx5z06n-austins-projects-bb7c50ab.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  
  // Exclude SPA anchor redirects and admin/API routes
  exclude: [
    '/admin/*',
    '/api/*',
    '/guestbook',      // Redirects to /#guestbook (SPA anchor)
    '/upload',          // Redirects to /#upload (SPA anchor)
    '/gallery',         // Redirects to /#gallery (SPA anchor)
    '/timeline',        // Redirects to /#timeline (SPA anchor)
    '/our-story',       // Redirects to /#our-story (SPA anchor)
    '/venue',           // Redirects to /#venue (SPA anchor)
    '/index-optimized', // Legacy/test file
  ],
  
  // Additional paths to include (single-page app - only real standalone routes)
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/photobooth'),
    await config.transform(config, '/album'),
    await config.transform(config, '/map'),
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
};
