'use client';

import { useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { updateMyName } from '@/lib/admin/actions';
import { Card, Label, btnPrimary, inputCls } from './ui';

export default function AccountForms({ email, fullName, role, reset }: { email: string; fullName: string; role: string; reset: boolean }) {
  const [name, setName] = useState(fullName);
  const [nameMsg, setNameMsg] = useState('');
  const [pw, setPw] = useState({ a: '', b: '' });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.a.length < 8) return setPwMsg({ ok: false, text: 'Use at least 8 characters.' });
    if (pw.a !== pw.b) return setPwMsg({ ok: false, text: 'The two passwords do not match.' });
    setBusy(true);
    const { error } = await getBrowserSupabase().auth.updateUser({ password: pw.a });
    setBusy(false);
    setPwMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Password updated.' });
    if (!error) setPw({ a: '', b: '' });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-5 items-start">
      <Card title="Profile">
        <div><Label>Email</Label><input className={`${inputCls} bg-slate-50`} value={email} disabled /></div>
        <div><Label>Role</Label><input className={`${inputCls} bg-slate-50 capitalize`} value={role} disabled /></div>
        <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const r = await updateMyName(name); setNameMsg(r.ok ? 'Saved.' : r.error); }}>
          <div><Label htmlFor="fn">Display name</Label><input id="fn" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="flex items-center gap-3"><button className={btnPrimary} type="submit">Save name</button>{nameMsg && <span className="text-sm text-slate-500">{nameMsg}</span>}</div>
        </form>
      </Card>
      <Card title={reset ? 'Set a new password' : 'Change password'}>
        {reset && <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">You signed in with a reset link — choose a new password now.</div>}
        <form className="space-y-3" onSubmit={savePw}>
          <div><Label htmlFor="p1">New password</Label><input id="p1" type="password" autoComplete="new-password" className={inputCls} value={pw.a} onChange={(e) => setPw({ ...pw, a: e.target.value })} /></div>
          <div><Label htmlFor="p2">Repeat new password</Label><input id="p2" type="password" autoComplete="new-password" className={inputCls} value={pw.b} onChange={(e) => setPw({ ...pw, b: e.target.value })} /></div>
          {pwMsg && <p className={`text-sm ${pwMsg.ok ? 'text-emerald-600' : 'text-red-600'}`}>{pwMsg.text}</p>}
          <button className={btnPrimary} type="submit" disabled={busy}>{busy ? 'Updating…' : 'Update password'}</button>
        </form>
      </Card>
    </div>
  );
}
