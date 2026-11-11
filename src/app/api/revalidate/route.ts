import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Called by open public pages when Supabase Realtime reports a content change, so the
 * cached (ISR) pages are rebuilt before the browser refreshes. It only clears the cache —
 * it can't change any data — and is throttled so many open tabs cause one rebuild.
 */
let last = 0;
const THROTTLE_MS = 5000;

export async function POST() {
  const now = Date.now();
  if (now - last > THROTTLE_MS) {
    last = now;
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true, revalidated: true });
  }
  return NextResponse.json({ ok: true, revalidated: false });
}
