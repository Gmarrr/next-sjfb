import 'server-only';
import { getSupabase } from './supabase';
import type { BlogRow, EventRow, MarketRow } from './types';

// Every query fails soft (returns empty) so a missing table or env var never crashes a page.

export async function getLatestBlogs(limit = 3): Promise<BlogRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('blogs')
    .select('*')
    .eq('blog_status', 'published')
    .order('blog_published_date', { ascending: false })
    .limit(limit);
  if (error) console.error('[getLatestBlogs]', error.message);
  return (data as BlogRow[]) ?? [];
}

export async function getBlogsPage(page: number, perPage = 6): Promise<{ blogs: BlogRow[]; total: number }> {
  const sb = getSupabase();
  if (!sb) return { blogs: [], total: 0 };
  const from = (page - 1) * perPage;
  const { data, count, error } = await sb
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('blog_status', 'published')
    .order('blog_published_date', { ascending: false })
    .range(from, from + perPage - 1);
  if (error) console.error('[getBlogsPage]', error.message);
  return { blogs: (data as BlogRow[]) ?? [], total: count ?? 0 };
}

export async function getBlogBySlug(slug: string): Promise<BlogRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from('blogs').select('*').eq('blog_slug', slug).eq('blog_status', 'published').maybeSingle();
  return (data as BlogRow) ?? null;
}

export async function getRelatedBlogs(excludeId: number, limit = 3): Promise<BlogRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from('blogs')
    .select('blog_id, blog_title, blog_slug, blog_published_date, blog_featured_image')
    .eq('blog_status', 'published')
    .neq('blog_id', excludeId)
    .order('blog_published_date', { ascending: false })
    .limit(limit);
  return (data as BlogRow[]) ?? [];
}

export async function getPublishedEvents(limit = 6): Promise<EventRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('events')
    .select('*')
    .eq('event_status', 'published')
    .order('event_date', { ascending: false })
    .limit(limit);
  if (error) console.error('[getPublishedEvents]', error.message);
  return (data as EventRow[]) ?? [];
}

export async function getExternalEvents(limit = 3): Promise<EventRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from('events')
    .select('*')
    .eq('event_status', 'published')
    .in('event_category', ['External / Industry', 'Conference', 'Trade Show', 'Expo', 'External'])
    .order('event_date', { ascending: false })
    .limit(limit);
  return (data as EventRow[]) ?? [];
}

/** Next upcoming event that has an RSVP deadline (for the announcement banner). */
export async function getAnnouncementEvent(today: string): Promise<EventRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from('events')
    .select('*')
    .eq('event_status', 'published')
    .gte('event_date', today)
    .not('event_rsvp_deadline', 'is', null)
    .order('event_rsvp_deadline', { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as EventRow) ?? null;
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from('events').select('*').eq('event_slug', slug).eq('event_status', 'published').maybeSingle();
  return (data as EventRow) ?? null;
}

export async function getMarkets(): Promise<MarketRow[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from('markets')
    .select('*, market_members(member_id, market_id, member_name, position, image_url, display_order, is_active)')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) console.error('[getMarkets]', error.message);
  const rows = (data as MarketRow[]) ?? [];
  return rows.map((m) => ({
    ...m,
    market_members: (m.market_members ?? [])
      .filter((mm) => mm.is_active !== false)
      .sort((a, b) => a.display_order - b.display_order),
  }));
}

/** All published slugs (for the sitemap). */
export async function getAllSlugs(): Promise<{ events: string[]; blogs: string[] }> {
  const sb = getSupabase();
  if (!sb) return { events: [], blogs: [] };
  const [e, b] = await Promise.all([
    sb.from('events').select('event_slug').eq('event_status', 'published'),
    sb.from('blogs').select('blog_slug').eq('blog_status', 'published'),
  ]);
  return {
    events: (e.data ?? []).map((r: { event_slug: string }) => r.event_slug),
    blogs: (b.data ?? []).map((r: { blog_slug: string }) => r.blog_slug),
  };
}
