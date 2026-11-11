#!/usr/bin/env node
/**
 * One-time migration: old PHP/MySQL site  →  Supabase (tables + Storage images)
 *
 * Copies: events (incl. gallery), blogs, markets (+ product names), market_members.
 * Images are uploaded to the public "media" bucket. Each image is read from your local
 * PHP project folder first (OLD_SITE_DIR/uploads/...), falling back to the live site URL.
 *
 * Run from the Next.js project folder:
 *   1. Add the MIGRATE_* values below to .env.local (see .env.example)
 *   2. npm install            (installs mysql2, a dev dependency)
 *   3. node --env-file=.env.local scripts/migrate-from-mysql.mjs
 *
 * Safe to re-run: rows are upserted by slug / market_key, files with the same path are overwritten.
 * Shop data (products, orders, accounts) is NOT migrated.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { createClient } from '@supabase/supabase-js';

const env = (k, fallback) => {
  const v = process.env[k] ?? fallback;
  if (v === undefined || v === '') { console.error(`Missing ${k} in .env.local`); process.exit(1); }
  return v;
};

const SUPABASE_URL = env('NEXT_PUBLIC_SUPABASE_URL');
const sb = createClient(SUPABASE_URL, env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
const OLD_SITE_DIR = env('MIGRATE_OLD_SITE_DIR', 'C:\Users\ITSTAFF1\Desktop\NextJS\sjfb-website');
const OLD_SITE_URL = env('MIGRATE_OLD_SITE_URL', 'https://www.fishbrokers.net').replace(/\/$/, '');
const BUCKET = 'media';

const db = await mysql.createConnection({
  host: env('MIGRATE_DB_HOST'),
  user: env('MIGRATE_DB_USER'),
  password: process.env.MIGRATE_DB_PASS ?? '',
  database: env('MIGRATE_DB_NAME'),
  dateStrings: true, // keep MySQL dates as plain strings (Manila local time)
  charset: 'utf8mb4',
});

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml' };
const publicUrl = (p) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${p}`;
const uploadedCache = new Map();
const stats = { uploaded: 0, missing: [] };

/**
 * Upload one old image and return its storage path (e.g. "events/abc.jpg"), or null if not found.
 * `value` can be "/uploads/events/x.jpg", "/sjfbi-js/uploads/events/x.jpg", or a bare filename + `folder`.
 */
async function migrateImage(value, folder) {
  if (!value || typeof value !== 'string') return null;
  let rel; // path relative to the old "uploads" folder
  const i = value.indexOf('uploads/');
  if (i !== -1) rel = value.slice(i + 'uploads/'.length);
  else if (/^https?:\/\//.test(value)) return value; // already an external URL — keep as-is
  else rel = `${folder}/${value.replace(/^\/+/, '')}`;
  rel = rel.split('?')[0];
  if (uploadedCache.has(rel)) return uploadedCache.get(rel);

  const ext = path.extname(rel).slice(1).toLowerCase();
  let buf = null;
  try {
    buf = await fs.readFile(path.join(OLD_SITE_DIR, 'uploads', rel));
  } catch {
    try {
      const res = await fetch(`${OLD_SITE_URL}/uploads/${rel}`);
      if (res.ok) buf = Buffer.from(await res.arrayBuffer());
    } catch { /* ignore */ }
  }
  if (!buf) { stats.missing.push(rel); uploadedCache.set(rel, null); return null; }

  const { error } = await sb.storage.from(BUCKET).upload(rel, buf, { contentType: MIME[ext] || 'application/octet-stream', upsert: true });
  if (error) { console.warn(`  ! upload failed ${rel}: ${error.message}`); uploadedCache.set(rel, null); return null; }
  stats.uploaded++;
  uploadedCache.set(rel, rel);
  return rel;
}

/** Re-host <img src=".../uploads/..."> found inside rich-text HTML and rewrite the URLs. */
async function migrateHtmlImages(html) {
  if (!html) return html;
  const srcs = [...html.matchAll(/src=["']([^"']*uploads\/[^"']+)["']/gi)].map((m) => m[1]);
  for (const src of new Set(srcs)) {
    const p = await migrateImage(src, 'content');
    if (p) html = html.split(src).join(publicUrl(p));
  }
  return html;
}

const parseJsonArray = (v) => { try { const a = typeof v === 'string' ? JSON.parse(v) : v; return Array.isArray(a) ? a : []; } catch { return []; } };
const cleanDate = (d) => (!d || d.startsWith('0000') ? null : d.slice(0, 10));
const manilaTs = (d) => (!d || d.startsWith('0000') ? new Date().toISOString() : `${d.replace(' ', 'T')}+08:00`);
const nn = (v) => (v === '' || v === undefined ? null : v);

async function tableExists(name) {
  const [rows] = await db.query('SHOW TABLES LIKE ?', [name]);
  return rows.length > 0;
}
async function hasColumn(table, col) {
  const [rows] = await db.query(`SHOW COLUMNS FROM \`${table}\` LIKE ?`, [col]);
  return rows.length > 0;
}

// ── EVENTS ───────────────────────────────────────────────────────────────────
if (await tableExists('events')) {
  const [events] = await db.query('SELECT * FROM events');
  console.log(`Events: ${events.length}`);
  const withGallery = await hasColumn('events', 'event_gallery');
  for (const e of events) {
    const gallery = [];
    for (const g of withGallery ? parseJsonArray(e.event_gallery) : []) {
      const p = await migrateImage(g, 'events/gallery');
      if (p) gallery.push(p);
    }
    const row = {
      event_title: e.event_title, event_slug: e.event_slug, event_status: e.event_status === 'published' ? 'published' : 'draft',
      event_date: cleanDate(e.event_date) ?? new Date().toISOString().slice(0, 10), event_end_date: cleanDate(e.event_end_date),
      event_time: nn(e.event_time), event_location: nn(e.event_location), event_address: nn(e.event_address),
      event_category: nn(e.event_category), event_audience: nn(e.event_audience), event_excerpt: nn(e.event_excerpt),
      event_content: await migrateHtmlImages(e.event_content), event_image: await migrateImage(e.event_image, 'events'),
      event_gallery: gallery, event_rsvp_url: nn(e.event_rsvp_url), event_rsvp_deadline: cleanDate(e.event_rsvp_deadline),
      event_meta_title: nn(e.event_meta_title), event_meta_description: nn(e.event_meta_description), event_meta_keywords: nn(e.event_meta_keywords),
    };
    const { error } = await sb.from('events').upsert(row, { onConflict: 'event_slug' });
    console.log(error ? `  ✗ ${e.event_slug}: ${error.message}` : `  ✓ ${e.event_slug}`);
  }
}

// ── BLOGS ────────────────────────────────────────────────────────────────────
if (await tableExists('blogs')) {
  const [blogs] = await db.query('SELECT * FROM blogs');
  console.log(`Blogs: ${blogs.length}`);
  for (const b of blogs) {
    const row = {
      blog_title: b.blog_title, blog_slug: b.blog_slug, blog_status: b.blog_status === 'published' ? 'published' : 'draft',
      blog_author: nn(b.blog_author), blog_excerpt: nn(b.blog_excerpt), blog_content: await migrateHtmlImages(b.blog_content),
      blog_featured_image: await migrateImage(b.blog_featured_image, 'blogs'), blog_published_date: manilaTs(b.blog_published_date),
      blog_meta_title: nn(b.blog_meta_title), blog_meta_description: nn(b.blog_meta_description), blog_meta_keywords: nn(b.blog_meta_keywords),
    };
    const { error } = await sb.from('blogs').upsert(row, { onConflict: 'blog_slug' });
    console.log(error ? `  ✗ ${b.blog_slug}: ${error.message}` : `  ✓ ${b.blog_slug}`);
  }
}

// ── MARKETS + MEMBERS ────────────────────────────────────────────────────────
if (await tableExists('markets')) {
  const [markets] = await db.query('SELECT * FROM markets');
  console.log(`Markets: ${markets.length}`);
  const canListProducts = (await tableExists('market_products')) && (await tableExists('products'));
  for (const m of markets) {
    let products = [];
    if (canListProducts) {
      const [rows] = await db.query(
        `SELECT p.product_name FROM market_products mp JOIN products p ON p.product_id = mp.product_id
         WHERE mp.market_id = ? AND (p.is_deleted = 0 OR p.is_deleted IS NULL) ORDER BY mp.display_order LIMIT 12`, [m.market_id]);
      products = rows.map((r) => r.product_name);
    }
    const gallery = [];
    for (const g of parseJsonArray(m.gallery_images)) { const p = await migrateImage(g, 'markets'); if (p) gallery.push(p); }
    const row = {
      market_key: m.market_key, market_name: m.market_name, tag: nn(m.tag), location_short: nn(m.location_short),
      location_full: nn(m.location_full), description: nn(m.description), highlights: parseJsonArray(m.highlights),
      stall_count: Number(m.stall_count) || 0, main_image: await migrateImage(m.main_image, 'markets'), gallery_images: gallery,
      map_embed: nn(m.map_embed), accent_color: m.accent_color || '#ea580c', products_available: products,
      display_order: Number(m.display_order) || 0, is_active: m.is_active === undefined ? true : Boolean(Number(m.is_active)),
    };
    const { data, error } = await sb.from('markets').upsert(row, { onConflict: 'market_key' }).select('market_id').single();
    if (error) { console.log(`  ✗ ${m.market_key}: ${error.message}`); continue; }
    console.log(`  ✓ ${m.market_key}`);

    if (await tableExists('market_members')) {
      const [members] = await db.query('SELECT * FROM market_members WHERE market_id = ?', [m.market_id]);
      await sb.from('market_members').delete().eq('market_id', data.market_id);
      const rows = [];
      for (const mm of members) {
        rows.push({
          market_id: data.market_id, member_name: mm.member_name, position: nn(mm.position),
          image_url: await migrateImage(mm.image_url, 'members'), display_order: Number(mm.display_order) || 0,
          is_active: mm.is_active === undefined ? true : Boolean(Number(mm.is_active)),
        });
      }
      if (rows.length) {
        const { error: mErr } = await sb.from('market_members').insert(rows);
        console.log(mErr ? `    ✗ members: ${mErr.message}` : `    ✓ ${rows.length} team members`);
      }
    }
  }
}

await db.end();
console.log(`\nDone. Uploaded ${stats.uploaded} images.`);
if (stats.missing.length) {
  console.log(`Could not find ${stats.missing.length} image(s) (left empty):`);
  stats.missing.forEach((m) => console.log(`  - uploads/${m}`));
}
