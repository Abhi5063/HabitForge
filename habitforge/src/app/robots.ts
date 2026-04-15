import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habitforge.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/register'],
      disallow: ['/dashboard', '/habits', '/social', '/analytics', '/paths', '/focus', '/settings', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
