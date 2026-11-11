import type { Metadata } from 'next';
import { PageHeader } from '@/components/admin/ui';
import MarketForm from '@/components/admin/MarketForm';
import { requireAdmin } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'New port' };

export default async function NewMarketPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New port" back={{ href: '/admin/markets', label: 'All ports' }} />
      <MarketForm initial={{ market_key: '', market_name: '', highlights: [], stall_count: 0, gallery_images: [], products_available: [], accent_color: '#ea580c', display_order: 0, is_active: true, members: [] }} />
    </>
  );
}
