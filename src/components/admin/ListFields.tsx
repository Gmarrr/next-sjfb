'use client';

import type { ReactNode } from 'react';
import { inputCls } from './ui';

const Move = ({ i, len, move, remove }: { i: number; len: number; move: (i: number, d: -1 | 1) => void; remove: (i: number) => void }) => (
  <div className="flex items-center gap-0.5 shrink-0">
    <button type="button" title="Move up" onClick={() => move(i, -1)} disabled={i === 0} className="size-7 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30">↑</button>
    <button type="button" title="Move down" onClick={() => move(i, 1)} disabled={i === len - 1} className="size-7 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30">↓</button>
    <button type="button" title="Remove" onClick={() => remove(i)} className="size-7 rounded-md text-red-500 hover:bg-red-50">×</button>
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
export function StringListField({ value, onChange, placeholder = 'New item', multiline = false }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; multiline?: boolean }) {
  const { move, remove, update } = useListOps(value, onChange);
  return (
    <div className="space-y-2">
      {value.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline
            ? <textarea rows={2} className={inputCls} value={v} onChange={(e) => update(i, e.target.value)} />
            : <input className={inputCls} value={v} onChange={(e) => update(i, e.target.value)} />}
          <Move i={i} len={value.length} move={move} remove={remove} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="text-sm font-semibold text-orange-600 hover:text-orange-700">+ Add {placeholder.toLowerCase()}</button>
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
