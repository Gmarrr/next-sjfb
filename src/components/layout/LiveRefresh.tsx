'use client';

import { useRouter } from 'next/navigation';
import { useDebounced, useRealtime } from '@/lib/realtime';

const PUBLIC_TABLES = ['events', 'blogs', 'markets', 'market_members', 'site_content'];

/**
 * Keeps an open websocket to Supabase on every public page. When an admin publishes or edits
 * something, the page the visitor is looking at refreshes its data in place (no full reload,
 * scroll position kept). The cached pages are cleared first so the refresh gets new data,
 * even for edits made directly in the Supabase dashboard.
 */
export default function LiveRefresh() {
  const router = useRouter();
  const refresh = useDebounced(async () => {
    try { await fetch('/api/revalidate', { method: 'POST' }); } catch { /* ignore */ }
    router.refresh();
  }, 900);
  useRealtime('site', PUBLIC_TABLES, () => refresh());
  return null;
}
