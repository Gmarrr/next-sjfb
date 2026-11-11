import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/queries';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { events, blogs } = await getAllSlugs();
  const pages = ['', '/about', '/services', '/sustainability', '/events', '/blogs', '/contact'];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...events.map((s) => ({ url: `${SITE_URL}/events/${s}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...blogs.map((s) => ({ url: `${SITE_URL}/blogs/${s}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
