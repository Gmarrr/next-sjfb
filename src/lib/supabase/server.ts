import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Supabase client bound to the signed-in admin's session (cookies). RLS applies. */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — the middleware refreshes cookies instead.
        }
      },
    },
  });
}

export type AdminProfile = { user_id: string; email: string; full_name: string | null; role: 'owner' | 'editor' };

/** Returns the signed-in admin, or null if not signed in / not in admin_users. */
export async function getAdmin(): Promise<{ supabase: Awaited<ReturnType<typeof createSessionClient>>; admin: AdminProfile } | null> {
  const supabase = await createSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('admin_users').select('user_id, email, full_name, role').eq('user_id', user.id).maybeSingle();
  if (!data) return null;
  return { supabase, admin: data as AdminProfile };
}

/** For admin pages & server actions: redirect to login if not an admin. */
export async function requireAdmin(opts: { owner?: boolean } = {}) {
  const ctx = await getAdmin();
  if (!ctx) redirect('/admin/login');
  if (opts.owner && ctx.admin.role !== 'owner') redirect('/admin?denied=1');
  return ctx;
}
