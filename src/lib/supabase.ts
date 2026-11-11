import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase env vars are set (lets the site render empty states before setup). */
export const supabaseConfigured = Boolean(url && anonKey);

let publicClient: SupabaseClient | null = null;

/** Read-only client (anon key). Row Level Security only exposes published / active rows. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!publicClient) {
    publicClient = createClient(url!, anonKey!, { auth: { persistSession: false } });
  }
  return publicClient;
}

/** Server-only client with the service role key — bypasses RLS. Use only in route handlers. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Turns a stored image value into a usable URL.
 * - Full URLs and site paths ("/assets/...") are returned as-is.
 * - Anything else is treated as a path inside the public "media" storage bucket,
 *   e.g. "events/abc.jpg" → https://<project>.supabase.co/storage/v1/object/public/media/events/abc.jpg
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
  if (!url) return '';
  return `${url}/storage/v1/object/public/media/${path.replace(/^\/+/, '')}`;
}
