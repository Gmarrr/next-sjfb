'use client';

import type { ReactNode } from 'react';
import { inputCls } from './ui';

const Ico = ({ d }: { d: string }) => (
  <svg aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d={d} /></svg>
);
const moveBtn = 'inline-flex size-9 items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none';
const Move = ({ i, len, move, remove }: { i: number; len: number; move: (i: number, d: -1 | 1) => void; remove: (i: number) => void }) => (
  <div className="flex items-center shrink-0">
    <button type="button" title="Move up" aria-label={`Move item ${i + 1} up`} onClick={() => move(i, -1)} disabled={i === 0} className={`${moveBtn} text-slate-600 hover:bg-slate-100`}><Ico d="m18 15-6-6-6 6" /></button>
    <button type="button" title="Move down" aria-label={`Move item ${i + 1} down`} onClick={() => move(i, 1)} disabled={i === len - 1} className={`${moveBtn} text-slate-600 hover:bg-slate-100`}><Ico d="m6 9 6 6 6-6" /></button>
    <button type="button" title="Remove" aria-label={`Remove item ${i + 1}`} onClick={() => remove(i)} className={`${moveBtn} text-red-600 hover:bg-red-50`}><Ico d="M18 6 6 18M6 6l12 12" /></button>
  </div>
);

function useListOps<T>(value: T[], onChange: (v: T[]) => void) {
  return {
    move: (i: number, d: -1 | 1) => {
      const j = i + d;
      if (j < 0 || j >= value.length) return;
      const next = [...value];
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    },
    remove: (i: number) => onChange(value.filter((_, k) => k !== i)),
    update: (i: number, v: T) => onChange(value.map((x, k) => (k === i ? v : x))),
  };
}

/** Editable list of short text lines. */
export function StringListField({ value, onChange, placeholder = 'New item', multiline = false, label = 'Item' }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; multiline?: boolean; label?: string }) {
  const { move, remove, update } = useListOps(value, onChange);
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline
            ? <textarea rows={2} aria-label={`${label} ${i + 1}`} className={inputCls} value={v} onChange={(e) => update(i, e.target.value)} />
            : <input aria-label={`${label} ${i + 1}`} className={inputCls} value={v} onChange={(e) => update(i, e.target.value)} />}
          <Move i={i} len={value.length} move={move} remove={remove} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="inline-flex min-h-9 items-center text-sm font-semibold text-orange-600 hover:text-orange-700">+ Add {placeholder.toLowerCase()}</button>
    </div>
  );
}

/** Editable list of objects; `render` draws the fields for one item. */
export function ObjectListField<T extends Record<string, unknown>>({ value, onChange, blank, render, itemTitle }: {
  value: T[]; onChange: (v: T[]) => void; blank: T; render: (item: T, set: (patch: Partial<T>) => void, index: number) => ReactNode; itemTitle?: (item: T, i: number) => string;
}) {
  const { move, remove, update } = useListOps(value, onChange);
  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500 truncate">{itemTitle?.(item, i) || `Item ${i + 1}`}</span>
            <Move i={i} len={value.length} move={move} remove={remove} />
          </div>
          <div className="grid gap-3">{render(item, (patch) => update(i, { ...item, ...patch }), i)}</div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { ...blank }])} className="text-sm font-semibold text-orange-600 hover:text-orange-700">+ Add item</button>
    </div>
  );
}
