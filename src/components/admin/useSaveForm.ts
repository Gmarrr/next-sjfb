'use client';

import { useEffect, useRef, useState } from 'react';
import type { ActionResult } from '@/lib/admin/actions';
import type { SaveState } from './SaveBar';

/** Form state + dirty tracking + "leave page?" warning + save handler. */
export function useSaveForm<T>(initial: T) {
  const [data, setData] = useState<T>(initial);
  const [state, setState] = useState<SaveState>({ kind: 'idle' });
  const saved = useRef(JSON.stringify(initial));
  const dirty = JSON.stringify(data) !== saved.current;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = <K extends keyof T>(key: K, value: T[K]) => { setData((d) => ({ ...d, [key]: value })); if (state.kind !== 'saving') setState({ kind: 'idle' }); };

  const save = async (fn: (d: T) => Promise<ActionResult>, okMessage?: string) => {
    setState({ kind: 'saving' });
    const res = await fn(data);
    if (res.ok) { saved.current = JSON.stringify(data); setState({ kind: 'saved', message: res.message ?? okMessage }); }
    else setState({ kind: 'error', message: res.error });
    return res;
  };

  return { data, setData, set, state, setState, dirty, save, markSaved: () => { saved.current = JSON.stringify(data); } };
}
