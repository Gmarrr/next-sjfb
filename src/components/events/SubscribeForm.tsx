'use client';

import { useState } from 'react';

// "Never Miss an Event" form — now actually saves the email (Supabase table: subscribers).
export default function SubscribeForm() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setState('loading');
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', body: new FormData(form) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || 'Could not subscribe right now.');
      setState('done');
      form.reset();
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Could not subscribe right now.');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <div className="hidden" aria-hidden="true"><input type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
        <input type="email" name="email" required placeholder="Enter your email address" aria-label="Email address" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        <button type="submit" disabled={state === 'loading'} className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-bold transition-all duration-150 shadow-sm hover:shadow-md whitespace-nowrap disabled:opacity-60">
          {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {state === 'done' && <p className="text-sm text-green-700 font-medium mt-3" role="status">Thanks! You&apos;re on the list.</p>}
      {state === 'error' && <p className="text-sm text-red-600 font-medium mt-3" role="alert">{msg}</p>}
    </>
  );
}
