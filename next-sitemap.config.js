/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://wedding-website-sepia-ten.vercel.app',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: 'weekly',
    priority: 0.7,

    // Exclude admin and API routes
    exclude: ['/admin/*', '/api/*', '/404', '/500'],

    // Additional paths with custom priorities and changefreqs
    additionalPaths: async (config) => [
        // Homepage - highest priority, check daily
        {
            loc: '/',
            changefreq: 'daily',
            priority: 1.0,
            lastmod: new Date().toISOString(),
        },
        // Gallery - high priority, frequently updated
        {
            loc: '/gallery',
            changefreq: 'daily',
            priority: 0.9,
            lastmod: new Date().toISOString(),
        },
        // Video section - high priority
        {
            loc: '/#video',
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
        },
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/api', '/_next', '/private'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin', '/api'],
            },
        ],
        additionalSitemaps: [],
    },

    // Transform function for custom metadata
    transform: async (config, path) => {
        return {
            loc: path,
            changefreq: config.changefreq,
            priority: config.priority,
            lastmod: new Date().toISOString(),
            alternateRefs: config.alternateRefs ?? [],
        };
    },
};
