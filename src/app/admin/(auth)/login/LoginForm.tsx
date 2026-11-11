'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const sb = getBrowserSupabase();
    const { data, error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (err || !data.user) {
      setLoading(false);
      setError(err?.message === 'Invalid login credentials' ? 'Wrong email or password.' : err?.message || 'Could not sign in.');
      return;
    }
    // Make sure this account is an admin before entering the panel
    const { data: admin } = await sb.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (!admin) {
      await sb.auth.signOut();
      setLoading(false);
      setError("This account isn't allowed to use the admin panel. Ask the site owner to add you.");
      return;
    }
    window.location.assign(next); // full reload so the server sees the new session cookie
  };

  const inputCls = 'w-full py-2.5 px-3.5 rounded-xl border-[1.5px] border-slate-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3" role="alert">{error}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@fishbrokers.net" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
          <Link href="/admin/forgot-password" className="text-xs font-semibold text-orange-600 hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputCls} pr-16`} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1">
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 text-white font-bold text-sm shadow-[0_4px_14px_rgba(234,88,12,.28)] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(234,88,12,.38)] transition disabled:opacity-60 disabled:translate-y-0">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
