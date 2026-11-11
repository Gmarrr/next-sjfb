'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setInquiryStatus } from '@/lib/admin/actions';

const STATUSES = [
  { value: 'new', label: 'New' }, { value: 'read', label: 'Read' }, { value: 'replied', label: 'Replied' }, { value: 'archived', label: 'Archived' },
] as const;

export default function InquiryActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
      {STATUSES.map((s) => (
        <button key={s.value} type="button" disabled={pending} onClick={() => start(async () => { await setInquiryStatus(id, s.value); router.refresh(); })}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${status === s.value ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          {s.label}
        </button>
      ))}
    </div>
  );
}
