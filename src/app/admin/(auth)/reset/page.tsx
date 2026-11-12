import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSessionClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Reset password' };
export const dynamic = 'force-dynamic';

const TYPES: EmailOtpType[] = ['recovery', 'invite', 'magiclink', 'email', 'signup', 'email_change'];

/**
 * Landing page for the "Reset password" email.
 * The link is only used up when the person clicks the button — so email security scanners
 * (Outlook Safe Links etc.) that open links automatically can't "expire" it first, and it works
 * in any browser, not just the one that requested it.
 */
async function verify(formData: FormData) {
  'use server';
  const token_hash = String(formData.get('token_hash') ?? '');
  const type = String(formData.get('type') ?? 'recovery') as EmailOtpType;
  if (!token_hash || !TYPES.includes(type)) redirect('/admin/login?error=link');
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash, type });
  if (error) redirect('/admin/login?error=link');
  redirect(type === 'recovery' || type === 'invite' ? '/admin/account?reset=1' : '/admin');
}

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token_hash?: string; type?: string }> }) {
  const { token_hash, type } = await searchParams;
  if (!token_hash) {
    return (
      <>
        <h1 className="text-xl font-extrabold text-slate-900">Link not valid</h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">This reset link is incomplete. Request a new one.</p>
        <Link href="/admin/forgot-password" className="block w-full text-center py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition">Send a new link</Link>
      </>
    );
  }
  return (
    <>
      <h1 className="text-xl font-extrabold text-slate-900">{type === 'invite' ? 'Accept invitation' : 'Reset your password'}</h1>
      <p className="text-sm text-slate-500 mt-1 mb-6">Click below to continue. You&apos;ll then choose a new password.</p>
      <form action={verify}>
        <input type="hidden" name="token_hash" value={token_hash} />
        <input type="hidden" name="type" value={type ?? 'recovery'} />
        <button type="submit" className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition">Continue</button>
      </form>
    </>
  );
}
