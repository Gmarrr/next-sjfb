import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/supabase/server';

// CSV download of all subscribers (admins only).
export async function GET() {
  const ctx = await getAdmin();
  if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await ctx.supabase.from('subscribers').select('email, source, created_at').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = ['email,source,signed_up', ...(data ?? []).map((r) => [r.email, r.source, r.created_at].map(esc).join(','))].join('\n');
  return new NextResponse(csv, {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
