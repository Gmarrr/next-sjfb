import 'server-only';
import { cache } from 'react';
import { getSupabase } from '@/lib/supabase';
import { DEFAULTS, type Content, type SectionKey } from './schema';

const isEmpty = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

/** Stored values win; anything missing or left empty falls back to the default copy. */
export function mergeContent<K extends SectionKey>(key: K, stored: Record<string, unknown> | null | undefined): Content<K> {
  const base = DEFAULTS[key] as Record<string, unknown>;
  const out: Record<string, unknown> = { ...base };
  if (stored) for (const k of Object.keys(base)) if (!isEmpty(stored[k])) out[k] = stored[k];
  return out as Content<K>;
}

/** All stored sections in one request (deduplicated per render). */
const loadAll = cache(async (): Promise<Record<string, Record<string, unknown>>> => {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from('site_content').select('key, data');
  if (error) { console.error('[site_content]', error.message); return {}; }
  return Object.fromEntries((data ?? []).map((r: { key: string; data: Record<string, unknown> }) => [r.key, r.data]));
});

export async function getContent<K extends SectionKey>(key: K): Promise<Content<K>> {
  const all = await loadAll();
  return mergeContent(key, all[key]);
}
