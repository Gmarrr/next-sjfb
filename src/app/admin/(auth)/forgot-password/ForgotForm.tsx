'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export default function ForgotForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const { error: err } = await getBrowserSupabase().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/auth/callback?next=/admin/account?reset=1`,
    });
    if (err) { setState('error'); setError(err.message); return; }
    setState('sent');
  };

  if (state === 'sent') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-3">If that email belongs to an admin, a reset link is on its way. Check your inbox (and spam folder).</div>
        <Link href="/admin/login" className="block text-center text-sm font-semibold text-orange-600 hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {state === 'error' && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-2.5 px-3.5 rounded-xl border-[1.5px] border-slate-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10" />
      </div>
      <button type="submit" disabled={state === 'sending'} className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Send reset link'}
      </button>
      <Link href="/admin/login" className="block text-center text-sm font-semibold text-slate-500 hover:text-orange-600">Back to sign in</Link>
    </form>
  );
}
