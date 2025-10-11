/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://wedding-website-15zx5z06n-austins-projects-bb7c50ab.vercel.app',
    generateRobotsTxt: true,
    generateIndexSitemap: false,

    // Exclude admin and API routes
    exclude: ['/admin/*', '/api/*'],

    // Additional paths to include
    additionalPaths: async (config) => [
        await config.transform(config, '/'),
        await config.transform(config, '/gallery'),
        await config.transform(config, '/upload'),
        await config.transform(config, '/guestbook'),
        await config.transform(config, '/venue'),
        await config.transform(config, '/map'),
        await config.transform(config, '/timeline'),
        await config.transform(config, '/our-story'),
        await config.transform(config, '/photobooth'),
        await config.transform(config, '/album'),
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
