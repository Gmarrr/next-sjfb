'use client';

import { getBrowserSupabase } from '@/lib/supabase/browser';

const MAX_DIM = 2000;

/** Shrinks big photos in the browser before upload (keeps PNG/GIF/SVG/WebP small files untouched). */
async function compress(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png)$/.test(file.type) || file.size < 600 * 1024) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const isPng = file.type === 'image/png';
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, isPng ? 'image/png' : 'image/jpeg', 0.82));
  return blob && blob.size < file.size ? blob : file;
}

/** Uploads a file to the public "media" bucket and returns its storage path (e.g. "events/abc.jpg"). */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const isImage = file.type.startsWith('image/');
  const body = isImage ? await compress(file) : file;
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder.replace(/^\/|\/$/g, '')}/${crypto.randomUUID().slice(0, 8)}-${Date.now()}.${ext}`;
  const { error } = await getBrowserSupabase().storage.from('media').upload(path, body, { contentType: body.type || file.type, upsert: false });
  if (error) throw new Error(error.message.includes('row-level security') ? 'Upload blocked — are you signed in as an admin?' : error.message);
  return path;
}
