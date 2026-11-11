import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/ui';
import UsersManager from '@/components/admin/UsersManager';

export const metadata: Metadata = { title: 'Admin Users' };

export default async function UsersPage() {
  const { supabase, admin } = await requireAdmin({ owner: true });
  const { data } = await supabase.from('admin_users').select('*').order('created_at');
  return (
    <>
      <PageHeader title="Admin Users" description="Who can sign in to this admin panel." />
      <UsersManager admins={data ?? []} meId={admin.user_id} />
    </>
  );
}
