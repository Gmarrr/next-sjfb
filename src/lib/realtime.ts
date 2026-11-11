'use client';

import { useEffect, useRef, useState } from 'react';
import type { RealtimePostgresChangesPayload, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export type LiveStatus = 'connecting' | 'live' | 'offline';
export type LiveChange = RealtimePostgresChangesPayload<Record<string, unknown>> & { table: string };

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/**
 * Opens one Supabase Realtime (websocket) channel listening to INSERT/UPDATE/DELETE on the given tables.
 * Row Level Security applies: visitors only receive changes to rows they're allowed to read.
 */
export function useRealtime(channelName: string, tables: string[], onChange: (c: LiveChange) => void): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>(configured ? 'connecting' : 'offline');
  const handler = useRef(onChange);
  handler.current = onChange;
  const key = tables.join(',');

  useEffect(() => {
    if (!configured) return;
    const sb = getBrowserSupabase();
    let channel = sb.channel(`${channelName}-${Math.random().toString(36).slice(2, 8)}`);
    for (const table of key.split(',')) {
      channel = channel.on('postgres_changes', { event: '*', schema: 'public', table }, (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => handler.current({ ...payload, table }));
    }
    channel.subscribe((s: `${REALTIME_SUBSCRIBE_STATES}`) => {
      if (s === 'SUBSCRIBED') setStatus('live');
      else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') setStatus('offline');
    });
    const onOnline = () => setStatus((st) => (st === 'offline' ? 'connecting' : st));
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('online', onOnline);
      sb.removeChannel(channel);
    };
  }, [channelName, key]);

  return status;
}

/** Calls `fn` at most once per `ms` burst (many rows can change at once, e.g. a gallery save). */
export function useDebounced<T extends unknown[]>(fn: (...a: T) => void, ms = 700) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const f = useRef(fn);
  f.current = fn;
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return (...a: T) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => f.current(...a), ms);
  };
}
