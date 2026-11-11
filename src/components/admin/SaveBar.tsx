'use client';

import type { ReactNode } from 'react';
import { btnPrimary } from './ui';

export type SaveState = { kind: 'idle' | 'saving' | 'saved' | 'error'; message?: string };

/** Sticky bottom bar with the save button and status message. */
export default function SaveBar({ state, label = 'Save changes', extra, dirty }: { state: SaveState; label?: string; extra?: ReactNode; dirty?: boolean }) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 mt-6 border-t border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm min-h-5" role="status">
        {state.kind === 'saving' && <span className="text-slate-500">Saving…</span>}
        {state.kind === 'saved' && <span className="text-emerald-600 font-semibold">✓ {state.message ?? 'Saved — the website is updated.'}</span>}
        {state.kind === 'error' && <span className="text-red-600 font-semibold">{state.message}</span>}
        {state.kind === 'idle' && dirty && <span className="text-amber-600">You have unsaved changes</span>}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <button type="submit" className={btnPrimary} disabled={state.kind === 'saving'}>{state.kind === 'saving' ? 'Saving…' : label}</button>
      </div>
    </div>
  );
}
