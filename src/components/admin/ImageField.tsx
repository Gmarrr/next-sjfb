'use client';

import { useRef, useState } from 'react';
import { mediaUrl } from '@/lib/supabase';
import { uploadMedia } from '@/lib/admin/upload';

type Common = { folder: string; accept?: string; label?: string };

function useUploader(folder: string) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState('');
  const upload = async (files: File[]): Promise<string[]> => {
    setError('');
    setBusy((b) => b + files.length);
    const out: string[] = [];
    for (const f of files) {
      try { out.push(await uploadMedia(f, folder)); }
      catch (e) { setError(e instanceof Error ? e.message : 'Upload failed'); }
      finally { setBusy((b) => b - 1); }
    }
    return out;
  };
  return { busy, error, upload };
}

const DropZone = ({ onFiles, multiple, accept, busy, hint }: { onFiles: (f: File[]) => void; multiple?: boolean; accept: string; busy: number; hint: string }) => {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles(Array.from(e.dataTransfer.files)); }}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center cursor-pointer transition ${over ? 'border-orange-500 bg-orange-100' : 'border-orange-200 bg-orange-50/60 hover:border-orange-400 hover:bg-orange-50'}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
      <span className="text-sm font-semibold text-orange-700">{busy ? `Uploading ${busy}…` : multiple ? 'Click or drag photos here' : 'Click or drag a file here'}</span>
      <span className="text-xs text-slate-400">{hint}</span>
      <input ref={input} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
    </div>
  );
};

/** Single image (or video when accept="video/*"). Value = storage path, site path, or URL. */
export function ImageField({ value, onChange, folder, accept = 'image/*' }: Common & { value: string; onChange: (v: string) => void }) {
  const { busy, error, upload } = useUploader(folder);
  const [showUrl, setShowUrl] = useState(false);
  const isVideo = accept.startsWith('video');
  const src = mediaUrl(value);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="flex items-start gap-3">
          {isVideo ? (
            <video src={src} className="w-48 h-28 rounded-lg object-cover border border-slate-200 bg-slate-900" muted controls />
          ) : (
            <img src={src} alt="" className="w-40 h-28 rounded-lg object-cover border border-slate-200 bg-slate-100" />
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer">
              Replace
              <input type="file" accept={accept} className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) { const [p] = await upload([f]); if (p) onChange(p); } }} />
            </label>
            <button type="button" onClick={() => onChange('')} className="text-xs font-semibold text-red-600 hover:underline text-left">Remove</button>
            {busy > 0 && <span className="text-xs text-slate-500">Uploading…</span>}
          </div>
        </div>
      ) : (
        <DropZone accept={accept} busy={busy} hint={isVideo ? 'MP4 (H.264) recommended' : 'JPG, PNG, WebP · large photos are resized automatically'} onFiles={async (f) => { const [p] = await upload(f.slice(0, 1)); if (p) onChange(p); }} />
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="button" onClick={() => setShowUrl(!showUrl)} className="text-[.7rem] text-slate-400 hover:text-slate-600">{showUrl ? 'Hide' : 'Or paste a URL / path'}</button>
      {showUrl && <input className="w-full py-1.5 px-2.5 rounded-md border border-slate-200 text-xs" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /assets/… or events/photo.jpg" />}
    </div>
  );
}

/** Multiple images with reordering. */
export function ImagesField({ value, onChange, folder }: Common & { value: string[]; onChange: (v: string[]) => void }) {
  const { busy, error, upload } = useUploader(folder);
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5">
          {value.map((p, i) => (
            <div key={p + i} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img src={mediaUrl(p)} alt="" className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute left-1 top-1 text-[10px] font-bold bg-black/55 text-white rounded px-1.5">{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 p-1 bg-gradient-to-t from-black/60 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="size-6 rounded bg-white/90 text-slate-700 text-xs font-bold disabled:opacity-40" title="Move left">‹</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="size-6 rounded bg-white/90 text-slate-700 text-xs font-bold disabled:opacity-40" title="Move right">›</button>
                </div>
                <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="size-6 rounded bg-red-600 text-white text-sm font-bold" title="Remove">×</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <DropZone multiple accept="image/*" busy={busy} hint="Select several at once · drag to add more" onFiles={async (f) => { const added = await upload(f); if (added.length) onChange([...value, ...added]); }} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
