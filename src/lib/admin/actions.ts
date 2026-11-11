'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSessionClient, getAdmin } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { DEFAULTS, type SectionKey } from '@/lib/content/schema';

export type ActionResult = { ok: true; id?: number | string; message?: string } | { ok: false; error: string };

// Every action re-checks the session; Row Level Security in Supabase enforces it again.
async function ctx(opts: { owner?: boolean } = {}) {
  const c = await getAdmin();
  if (!c) throw new Error('Your session has expired. Please sign in again.');
  if (opts.owner && c.admin.role !== 'owner') throw new Error('Only the site owner can do this.');
  return c;
}

const fail = (e: unknown): ActionResult => ({ ok: false, error: e instanceof Error ? e.message : String(e) });
const friendly = (msg: string) =>
  /duplicate key.*slug/i.test(msg) ? 'That URL slug is already used — choose a different one.'
  : /duplicate key.*market_key/i.test(msg) ? 'That market key is already used — choose a different one.'
  : msg;

/** Refresh every public page after a change (cheap: pages are cached and rebuilt on demand). */
const refreshSite = () => revalidatePath('/', 'layout');

const clean = (v: unknown) => (typeof v === 'string' ? (v.trim() === '' ? null : v.trim()) : v ?? null);
const slugOk = (s: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function signOut() {
  const sb = await createSessionClient();
  await sb.auth.signOut();
  redirect('/admin/login');
}

// ── Events ───────────────────────────────────────────────────────────────────
export type EventInput = {
  event_id?: number;
  event_title: string; event_slug: string; event_status: 'draft' | 'published';
  event_date: string; event_end_date?: string; event_time?: string; event_location?: string; event_address?: string;
  event_category?: string; event_audience?: string; event_excerpt?: string; event_content?: string;
  event_image?: string; event_gallery: string[]; event_rsvp_url?: string; event_rsvp_deadline?: string;
  event_meta_title?: string; event_meta_description?: string; event_meta_keywords?: string;
};

export async function saveEvent(input: EventInput): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    if (!input.event_title?.trim()) return { ok: false, error: 'Event title is required.' };
    if (!input.event_date) return { ok: false, error: 'Start date is required.' };
    if (!slugOk(input.event_slug)) return { ok: false, error: 'URL slug can only contain lowercase letters, numbers and dashes.' };
    const row = {
      event_title: input.event_title.trim(), event_slug: input.event_slug, event_status: input.event_status === 'published' ? 'published' : 'draft',
      event_date: input.event_date, event_end_date: clean(input.event_end_date), event_time: clean(input.event_time),
      event_location: clean(input.event_location), event_address: clean(input.event_address), event_category: clean(input.event_category),
      event_audience: clean(input.event_audience), event_excerpt: clean(input.event_excerpt), event_content: clean(input.event_content),
      event_image: clean(input.event_image), event_gallery: (input.event_gallery ?? []).filter(Boolean),
      event_rsvp_url: clean(input.event_rsvp_url), event_rsvp_deadline: clean(input.event_rsvp_deadline),
      event_meta_title: clean(input.event_meta_title), event_meta_description: clean(input.event_meta_description), event_meta_keywords: clean(input.event_meta_keywords),
    };
    const q = input.event_id
      ? supabase.from('events').update(row).eq('event_id', input.event_id).select('event_id').single()
      : supabase.from('events').insert(row).select('event_id').single();
    const { data, error } = await q;
    if (error) return { ok: false, error: friendly(error.message) };
    refreshSite();
    return { ok: true, id: data.event_id };
  } catch (e) { return fail(e); }
}

export async function deleteEvent(id: number): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('events').delete().eq('event_id', id);
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function setEventStatus(id: number, status: 'draft' | 'published'): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('events').update({ event_status: status }).eq('event_id', id);
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

// ── Blogs ────────────────────────────────────────────────────────────────────
export type BlogInput = {
  blog_id?: number; blog_title: string; blog_slug: string; blog_status: 'draft' | 'published';
  blog_author?: string; blog_excerpt?: string; blog_content?: string; blog_featured_image?: string;
  blog_published_date: string; blog_meta_title?: string; blog_meta_description?: string; blog_meta_keywords?: string;
};

export async function saveBlog(input: BlogInput): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    if (!input.blog_title?.trim()) return { ok: false, error: 'Title is required.' };
    if (!slugOk(input.blog_slug)) return { ok: false, error: 'URL slug can only contain lowercase letters, numbers and dashes.' };
    const row = {
      blog_title: input.blog_title.trim(), blog_slug: input.blog_slug, blog_status: input.blog_status === 'published' ? 'published' : 'draft',
      blog_author: clean(input.blog_author), blog_excerpt: clean(input.blog_excerpt), blog_content: clean(input.blog_content),
      blog_featured_image: clean(input.blog_featured_image),
      blog_published_date: input.blog_published_date ? `${input.blog_published_date}T09:00:00+08:00` : new Date().toISOString(),
      blog_meta_title: clean(input.blog_meta_title), blog_meta_description: clean(input.blog_meta_description), blog_meta_keywords: clean(input.blog_meta_keywords),
    };
    const q = input.blog_id
      ? supabase.from('blogs').update(row).eq('blog_id', input.blog_id).select('blog_id').single()
      : supabase.from('blogs').insert(row).select('blog_id').single();
    const { data, error } = await q;
    if (error) return { ok: false, error: friendly(error.message) };
    refreshSite();
    return { ok: true, id: data.blog_id };
  } catch (e) { return fail(e); }
}

export async function deleteBlog(id: number): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('blogs').delete().eq('blog_id', id);
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

// ── Markets (ports) + team members ───────────────────────────────────────────
export type MemberInput = { member_name: string; position?: string; image_url?: string; is_active: boolean };
export type MarketInput = {
  market_id?: number; market_key: string; market_name: string; tag?: string; location_short?: string; location_full?: string;
  description?: string; highlights: string[]; stall_count: number; main_image?: string; gallery_images: string[];
  map_embed?: string; accent_color?: string; products_available: string[]; display_order: number; is_active: boolean;
  members: MemberInput[];
};

export async function saveMarket(input: MarketInput): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    if (!input.market_name?.trim()) return { ok: false, error: 'Port / market name is required.' };
    if (!slugOk(input.market_key)) return { ok: false, error: 'Key can only contain lowercase letters, numbers and dashes (e.g. navotas).' };
    const row = {
      market_key: input.market_key, market_name: input.market_name.trim(), tag: clean(input.tag), location_short: clean(input.location_short),
      location_full: clean(input.location_full), description: clean(input.description), highlights: input.highlights.filter((h) => h.trim()),
      stall_count: Number(input.stall_count) || 0, main_image: clean(input.main_image), gallery_images: input.gallery_images.filter(Boolean),
      map_embed: clean(input.map_embed), accent_color: clean(input.accent_color) ?? '#ea580c', products_available: input.products_available.filter((p) => p.trim()),
      display_order: Number(input.display_order) || 0, is_active: Boolean(input.is_active),
    };
    const q = input.market_id
      ? supabase.from('markets').update(row).eq('market_id', input.market_id).select('market_id').single()
      : supabase.from('markets').insert(row).select('market_id').single();
    const { data, error } = await q;
    if (error) return { ok: false, error: friendly(error.message) };

    // Replace the team list
    const marketId = data.market_id as number;
    const { error: delErr } = await supabase.from('market_members').delete().eq('market_id', marketId);
    if (delErr) return { ok: false, error: delErr.message };
    const members = input.members.filter((m) => m.member_name.trim()).map((m, i) => ({
      market_id: marketId, member_name: m.member_name.trim(), position: clean(m.position), image_url: clean(m.image_url), display_order: i, is_active: m.is_active,
    }));
    if (members.length) {
      const { error: mErr } = await supabase.from('market_members').insert(members);
      if (mErr) return { ok: false, error: mErr.message };
    }
    refreshSite();
    return { ok: true, id: marketId };
  } catch (e) { return fail(e); }
}

export async function deleteMarket(id: number): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('markets').delete().eq('market_id', id);
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

// ── Inquiries & subscribers ──────────────────────────────────────────────────
export async function setInquiryStatus(id: number, status: 'new' | 'read' | 'replied' | 'archived'): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin', 'layout');
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function deleteInquiry(id: number): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { data } = await supabase.from('inquiries').select('attachments').eq('id', id).maybeSingle();
    const paths = ((data?.attachments ?? []) as { path: string }[]).map((a) => a.path).filter(Boolean);
    if (paths.length) await supabase.storage.from('inquiry-attachments').remove(paths);
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin', 'layout');
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function deleteSubscriber(id: number): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/subscribers');
    return { ok: true };
  } catch (e) { return fail(e); }
}

// ── Page content ─────────────────────────────────────────────────────────────
export async function saveContent(key: SectionKey, data: Record<string, unknown>): Promise<ActionResult> {
  try {
    const { supabase, admin } = await ctx();
    if (!(key in DEFAULTS)) return { ok: false, error: 'Unknown section.' };
    // keep only known fields
    const allowed = Object.keys(DEFAULTS[key]);
    const filtered = Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
    const { error } = await supabase.from('site_content').upsert({ key, data: filtered, updated_at: new Date().toISOString(), updated_by: admin.user_id });
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function resetContent(key: SectionKey): Promise<ActionResult> {
  try {
    const { supabase } = await ctx();
    const { error } = await supabase.from('site_content').delete().eq('key', key);
    if (error) return { ok: false, error: error.message };
    refreshSite();
    return { ok: true };
  } catch (e) { return fail(e); }
}

// ── Admin accounts (owner only; uses the service role key on the server) ─────
export async function addAdmin(input: { email: string; full_name: string; role: 'owner' | 'editor'; password: string }): Promise<ActionResult> {
  try {
    await ctx({ owner: true });
    const svc = getSupabaseAdmin();
    if (!svc) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' };
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Enter a valid email.' };
    if ((input.password ?? '').length < 8) return { ok: false, error: 'Temporary password must be at least 8 characters.' };

    // Reuse an existing auth user with this email, otherwise create one
    let userId: string | undefined;
    const { data: created, error: cErr } = await svc.auth.admin.createUser({ email, password: input.password, email_confirm: true, user_metadata: { full_name: input.full_name } });
    if (created?.user) userId = created.user.id;
    else if (cErr && /already|registered|exists/i.test(cErr.message)) {
      for (let page = 1; page <= 10 && !userId; page++) {
        const { data } = await svc.auth.admin.listUsers({ page, perPage: 200 });
        userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
        if (!data.users.length) break;
      }
      if (userId) await svc.auth.admin.updateUserById(userId, { password: input.password });
    } else if (cErr) return { ok: false, error: cErr.message };
    if (!userId) return { ok: false, error: 'Could not create the account.' };

    const { error } = await svc.from('admin_users').upsert({ user_id: userId, email, full_name: input.full_name.trim() || null, role: input.role === 'owner' ? 'owner' : 'editor' });
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/users');
    return { ok: true, message: `${email} can now sign in with the temporary password.` };
  } catch (e) { return fail(e); }
}

export async function setAdminRole(userId: string, role: 'owner' | 'editor'): Promise<ActionResult> {
  try {
    const { supabase, admin } = await ctx({ owner: true });
    if (userId === admin.user_id && role !== 'owner') return { ok: false, error: "You can't remove your own owner role." };
    const { error } = await supabase.from('admin_users').update({ role }).eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function removeAdmin(userId: string, deleteAccount: boolean): Promise<ActionResult> {
  try {
    const { admin } = await ctx({ owner: true });
    if (userId === admin.user_id) return { ok: false, error: "You can't remove yourself." };
    const svc = getSupabaseAdmin();
    if (!svc) return { ok: false, error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server.' };
    const { error } = await svc.from('admin_users').delete().eq('user_id', userId);
    if (error) return { ok: false, error: error.message };
    if (deleteAccount) await svc.auth.admin.deleteUser(userId);
    revalidatePath('/admin/users');
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function updateMyName(fullName: string): Promise<ActionResult> {
  try {
    const { supabase, admin } = await ctx();
    // owners can update via RLS; editors go through the service role for their own row only
    const svc = getSupabaseAdmin() ?? supabase;
    const { error } = await svc.from('admin_users').update({ full_name: fullName.trim() || null }).eq('user_id', admin.user_id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin', 'layout');
    return { ok: true };
  } catch (e) { return fail(e); }
}
