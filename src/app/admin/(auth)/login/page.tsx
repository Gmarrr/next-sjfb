import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  if (supabaseConfigured && (await getAdmin())) redirect(next?.startsWith('/admin') ? next : '/admin');
  return (
    <>
      <h1 className="text-xl font-extrabold text-slate-900">Sign in</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">Manage events, blogs, ports, messages and page content.</p>
      {!supabaseConfigured && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">
          Supabase isn&apos;t configured yet. Add the keys from <code>.env.example</code> to <code>.env.local</code> (or Vercel) first.
        </div>
      )}
      {error === 'not-admin' && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">
          That account isn&apos;t allowed to use the admin panel. Ask the site owner to add you.
        </div>
      )}
      <LoginForm next={next?.startsWith('/admin') ? next : '/admin'} />
    </>
  );
}
