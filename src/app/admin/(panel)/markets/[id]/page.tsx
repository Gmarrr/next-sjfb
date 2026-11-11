import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui';
import MarketForm from '@/components/admin/MarketForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { requireAdmin } from '@/lib/supabase/server';
import { deleteMarket } from '@/lib/admin/actions';
import type { MarketRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Edit port' };

export default async function EditMarketPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('markets').select('*, market_members(*)').eq('market_id', Number(id)).maybeSingle();
  if (!data) notFound();
  const m = data as MarketRow;
  const members = [...(m.market_members ?? [])].sort((a, b) => a.display_order - b.display_order)
    .map((x) => ({ member_name: x.member_name, position: x.position ?? '', image_url: x.image_url ?? '', is_active: x.is_active !== false }));
  return (
    <>
      <PageHeader title={m.market_name} back={{ href: '/admin/markets', label: 'All ports' }} actions={<ConfirmButton action={deleteMarket.bind(null, m.market_id)} confirm={`Delete "${m.market_name}"?`} label="Delete port" redirectTo="/admin/markets" />} />
      {created && <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3">Port created.</div>}
      <MarketForm key={m.market_id} initial={{
        market_id: m.market_id, market_key: m.market_key, market_name: m.market_name, tag: m.tag ?? '', location_short: m.location_short ?? '',
        location_full: m.location_full ?? '', description: m.description ?? '', highlights: m.highlights ?? [], stall_count: m.stall_count ?? 0,
        main_image: m.main_image ?? '', gallery_images: m.gallery_images ?? [], map_embed: m.map_embed ?? '', accent_color: m.accent_color ?? '#ea580c',
        products_available: m.products_available ?? [], display_order: m.display_order ?? 0, is_active: m.is_active, members,
      }} />
    </>
  );
}
