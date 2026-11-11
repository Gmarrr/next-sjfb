import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  if (String(fd.get('website') ?? '')) return NextResponse.json({ ok: true }); // honeypot

  const email = String(fd.get('email') ?? '').trim().toLowerCase().slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ ok: false, error: 'Subscriptions are not available yet.' }, { status: 503 });

  // upsert so subscribing twice is not an error
  const { error } = await sb.from('subscribers').upsert({ email, source: 'events-page' }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) {
    console.error('[subscribe]', error.message);
    return NextResponse.json({ ok: false, error: 'Could not subscribe right now.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
