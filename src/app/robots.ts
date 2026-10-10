import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/signup'],
      disallow: ['/api/', '/verify', '/reset-password'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
