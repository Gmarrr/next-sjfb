import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getAdmin, createSessionClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Every page inside the admin panel requires a signed-in admin.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdmin();
  if (!ctx) {
    // Signed in but not an admin → sign out and explain on the login page
    const sb = await createSessionClient();
    const { data: { user } } = await sb.auth.getUser();
    if (user) { await sb.auth.signOut(); redirect('/admin/login?error=not-admin'); }
    redirect('/admin/login');
  }
  const { count } = await ctx.supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new');
  return <AdminShell admin={ctx.admin} newMessages={count ?? 0}>{children}</AdminShell>;
}
