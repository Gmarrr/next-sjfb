import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/ui';
import AccountForms from '@/components/admin/AccountForms';

export const metadata: Metadata = { title: 'My Account' };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { reset } = await searchParams;
  const { admin } = await requireAdmin();
  return (
    <>
      <PageHeader title="My Account" />
      <AccountForms email={admin.email} fullName={admin.full_name ?? ''} role={admin.role} reset={Boolean(reset)} />
    </>
  );
}
