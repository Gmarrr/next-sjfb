'use client';

import { useRef, useState } from 'react';

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf'];
const inputCls = 'py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500 focus:outline-none focus:ring-1 bg-white';

type Status = { kind: 'idle' | 'loading' | 'success' | 'error'; message?: string };

// Ported from the "General Inquiry" form in contact.php. Submits to /api/contact
// (saved in Supabase + emailed through Brevo).
export default function InquiryForm({ title, text }: { title: string; text: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const rejected: string[] = [];
    const next = [...files];
    Array.from(list).forEach((f) => {
      if (!ALLOWED.includes(f.type) || f.size > MAX_FILE_BYTES) { rejected.push(f.name); return; }
      if (next.length >= MAX_FILES) { rejected.push(`${f.name} (max ${MAX_FILES} files)`); return; }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    });
    setFiles(next);
    if (rejected.length) setStatus({ kind: 'error', message: `Skipped: ${rejected.join(', ')} — JPG, PNG or PDF up to 2MB each.` });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus({ kind: 'loading' });
    const data = new FormData(form);
    data.delete('attachments');
    files.forEach((f) => data.append('attachments', f));
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setStatus({ kind: 'success' });
      form.reset();
      setFiles([]);
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{text}</p>

      {status.kind === 'loading' && (
        <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium" role="status">
          <svg className="animate-spin size-5 flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" /></svg>
          Sending your message…
        </div>
      )}
      {status.kind === 'success' && (
        <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium" role="status">
          <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>Message sent! We&apos;ll get back to you within 1–2 business days.</p>
        </div>
      )}
      {status.kind === 'error' && (
        <div className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium" role="alert">
          <svg className="size-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{status.message}</span>
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} noValidate>
        <input type="hidden" name="form_type" value="inquiry" />
        {/* Honeypot — real visitors never see or fill this */}
        <div className="hidden" aria-hidden="true"><input type="text" name="website" tabIndex={-1} autoComplete="off" /></div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="firstName">First Name <span className="text-red-500">*</span></label>
            <input id="firstName" type="text" name="firstName" placeholder="Juan" required maxLength={80} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="lastName">Last Name <span className="text-red-500">*</span></label>
            <input id="lastName" type="text" name="lastName" placeholder="dela Cruz" required maxLength={80} className={inputCls} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="email">Email <span className="text-red-500">*</span></label>
            <input id="email" type="email" name="email" placeholder="you@example.com" required autoComplete="email" maxLength={160} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="contact">Contact Number <span className="text-red-500">*</span></label>
            <input id="contact" type="tel" inputMode="tel" name="contact" placeholder="09XX XXX XXXX" required pattern="[0-9+()\s-]{7,20}" maxLength={20} className={inputCls} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="sender_type">I am a… <span className="text-red-500">*</span></label>
          <select id="sender_type" name="sender_type" required className={inputCls} defaultValue="">
            <option value="">— Select one —</option>
            <option value="buyer">Buyer / Restaurant / Business</option>
            <option value="fisherman">Fisherman / Supplier</option>
            <option value="processor">Fish Processor / Exporter</option>
            <option value="partner">Potential Business Partner</option>
            <option value="media">Media / Researcher</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="subject">Subject <span className="text-red-500">*</span></label>
          <input id="subject" type="text" name="subject" placeholder="e.g. Bulk bangus order inquiry" required maxLength={160} className={inputCls} />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="message">Message <span className="text-red-500">*</span></label>
          <textarea id="message" name="message" rows={4} placeholder="Tell us what you need — species, quantity, delivery location, or any questions." required maxLength={5000} className={`${inputCls} resize-y`} />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5" htmlFor="market">Preferred Market Location</label>
          <select id="market" name="market" className={inputCls} defaultValue="">
            <option value="">— Any / Not sure —</option>
            <option value="navotas">Navotas Fish Port Complex</option>
            <option value="malabon">Malabon Consignacion</option>
            <option value="davao">Davao Toril Fish Port</option>
          </select>
        </div>
        <div className="mb-6">
          <span className="block text-xs font-semibold text-gray-700 mb-1.5">Attachments <span className="text-gray-400 font-normal">(optional)</span></span>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInput.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.current?.click(); } }}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all hover:border-amber-500 hover:bg-amber-50 ${drag ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-gray-50'}`}
          >
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-orange-200">
              <svg className="size-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Click to upload or drag &amp; drop</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF — max 2MB each</p>
          </div>
          <input ref={fileInput} type="file" name="attachments" multiple accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((f, i) => (
                <div key={f.name + i} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <span className="truncate text-gray-700">{f.name} <span className="text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span></span>
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" disabled={status.kind === 'loading'} className="w-full py-3 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          Send Message
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">We respond within 1–2 business days. No spam, ever.</p>
      </form>
    </div>
  );
}
