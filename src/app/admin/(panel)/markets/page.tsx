import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/supabase';
import { Badge, ButtonLink, EmptyState, PageHeader, Thumb } from '@/components/admin/ui';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { deleteMarket } from '@/lib/admin/actions';
import type { MarketRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Ports & Teams' };

export default async function AdminMarketsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('markets').select('*, market_members(member_id)').order('display_order');
  const markets = (data ?? []) as (MarketRow & { market_members: { member_id: number }[] })[];
  return (
    <>
      <PageHeader title="Ports & Teams" description="Port locations on the home page and the Services page tabs, with their teams." actions={<ButtonLink href="/admin/markets/new">+ New port</ButtonLink>} />
      {markets.length === 0 ? (
        <EmptyState title="No ports yet" text="Add Navotas, Malabon, Lucena and Davao to fill the Services page." action={<ButtonLink href="/admin/markets/new">+ New port</ButtonLink>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {markets.map((m) => (
            <div key={m.market_id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4" style={{ borderLeft: `4px solid ${m.accent_color || '#ea580c'}` }}>
              <Thumb src={mediaUrl(m.main_image)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><Link href={`/admin/markets/${m.market_id}`} className="font-bold text-slate-900 hover:text-orange-600 truncate">{m.market_name}</Link><Badge value={m.is_active ? 'active' : 'hidden'} /></div>
                <p className="text-xs text-slate-500">{m.location_short ?? '—'} · {m.stall_count ?? 0} stalls · {m.market_members?.length ?? 0} team members</p>
                <div className="flex gap-3 mt-2">
                  <Link href={`/admin/markets/${m.market_id}`} className="text-xs font-semibold text-orange-600 hover:underline">Edit</Link>
                  <a href={`/services?market=${m.market_key}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate-500 hover:text-slate-800">View</a>
                  <ConfirmButton small action={deleteMarket.bind(null, m.market_id)} confirm={`Delete "${m.market_name}" and its team list?`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
