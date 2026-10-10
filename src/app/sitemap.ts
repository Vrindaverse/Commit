import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
