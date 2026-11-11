'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { addAdmin, removeAdmin, setAdminRole } from '@/lib/admin/actions';
import { Badge, Card, Label, btnPrimary, inputCls } from './ui';

type AdminRow = { user_id: string; email: string; full_name: string | null; role: 'owner' | 'editor'; created_at: string };

function tempPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  return Array.from(crypto.getRandomValues(new Uint32Array(12)), (n) => chars[n % chars.length]).join('');
}

export default function UsersManager({ admins, meId }: { admins: AdminRow[]; meId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ email: '', full_name: '', role: 'editor' as 'owner' | 'editor', password: tempPassword() });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string }>, after?: () => void) =>
    start(async () => {
      const res = await fn();
      setMsg(res.ok ? { ok: true, text: res.message ?? 'Done.' } : { ok: false, text: res.error ?? 'Something went wrong.' });
      if (res.ok) { after?.(); router.refresh(); }
    });

  return (
    <div className="grid lg:grid-cols-3 gap-5 items-start">
      <Card title="Team" className="lg:col-span-2">
        {msg && <div className={`rounded-lg text-sm p-3 ${msg.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg.text}</div>}
        <ul className="divide-y divide-slate-100 -my-2">
          {admins.map((a) => (
            <li key={a.user_id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="size-9 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">{(a.full_name || a.email).charAt(0).toUpperCase()}</span>
              <div className="flex-1 min-w-[180px]">
                <p className="text-sm font-semibold text-slate-900">{a.full_name || a.email.split('@')[0]} {a.user_id === meId && <span className="text-xs text-slate-400 font-normal">(you)</span>}</p>
                <p className="text-xs text-slate-500">{a.email}</p>
              </div>
              {a.user_id === meId ? <Badge value={a.role} /> : (
                <div className="flex items-center gap-2">
                  <select disabled={pending} value={a.role} onChange={(e) => run(() => setAdminRole(a.user_id, e.target.value as 'owner' | 'editor'))} className="text-xs border border-slate-200 rounded-md py-1 px-2 bg-white">
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button type="button" disabled={pending} className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => {
                      if (!window.confirm(`Remove ${a.email} from the admin panel?`)) return;
                      const del = window.confirm('Also delete their login account completely? (OK = delete account, Cancel = only remove admin access)');
                      run(() => removeAdmin(a.user_id, del));
                    }}>Remove</button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
          <strong>Owner</strong> — everything, including adding/removing admins. <strong>Editor</strong> — events, blogs, ports, page content, messages and subscribers.
        </div>
      </Card>

      <Card title="Add an admin">
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); run(() => addAdmin(form), () => setForm({ email: '', full_name: '', role: 'editor', password: tempPassword() })); }}>
          <div><Label htmlFor="ne" required>Email</Label><input id="ne" type="email" required className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label htmlFor="nn">Full name</Label><input id="nn" className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div>
            <Label htmlFor="nr">Role</Label>
            <select id="nr" className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'owner' | 'editor' })}>
              <option value="editor">Editor</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div>
            <Label htmlFor="np" required help="Share it with them privately; they can change it under My Account.">Temporary password</Label>
            <div className="flex gap-2"><input id="np" required minLength={8} className={`${inputCls} font-mono`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setForm({ ...form, password: tempPassword() })} className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2" title="Generate new">↻</button></div>
          </div>
          <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>{pending ? 'Adding…' : 'Add admin'}</button>
        </form>
      </Card>
    </div>
  );
}
