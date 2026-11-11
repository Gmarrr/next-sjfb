'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { ActionResult } from '@/lib/admin/actions';
import { btnDanger } from './ui';

/** Button that asks for confirmation, runs a server action, then refreshes or redirects. */
export default function ConfirmButton({ action, confirm, label = 'Delete', redirectTo, className = btnDanger, small }: {
  action: () => Promise<ActionResult>; confirm: string; label?: string; redirectTo?: string; className?: string; small?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState('');
  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        disabled={pending}
        className={small ? 'text-xs font-semibold text-red-600 hover:underline disabled:opacity-50' : className}
        onClick={() => {
          if (!window.confirm(confirm)) return;
          start(async () => {
            const res = await action();
            if (!res.ok) { setError(res.error); return; }
            if (redirectTo) { window.dispatchEvent(new Event('nav-progress:start')); router.push(redirectTo); } else router.refresh();
          });
        }}
      >
        {pending ? 'Working…' : label}
      </button>
      {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
    </span>
  );
}
