'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Content } from '@/lib/content/schema';

type ModalId = 'privacy' | 'terms' | null;
const LegalCtx = createContext<(id: Exclude<ModalId, null>) => void>(() => {});
export const useLegalModal = () => useContext(LegalCtx);

const META = {
  privacy: { title: 'Privacy Policy', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  terms: { title: 'Terms & Conditions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
} as const;

export function LegalModalProvider({ children, legal }: { children: ReactNode; legal: Content<'legal'> }) {
  const [open, setOpen] = useState<ModalId>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('overflow-hidden');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('overflow-hidden'); document.removeEventListener('keydown', onKey); };
  }, [open, close]);

  return (
    <LegalCtx.Provider value={setOpen}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-3"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="port-modal-box flex flex-col w-full sm:max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center py-3 px-4 border-b border-gray-200">
              <div className="flex items-center gap-x-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-blue-50">
                  <svg className="size-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={META[open].icon} />
                  </svg>
                </div>
                <div>
                  <h3 id="legal-modal-title" className="font-bold text-gray-800">{META[open].title}</h3>
                  <p className="text-xs text-gray-500">Effective Date: {legal.effectiveDate}</p>
                </div>
              </div>
              <button type="button" onClick={close} className="flex justify-center items-center size-8 text-gray-500 hover:bg-gray-100 rounded-full">
                <span className="sr-only">Close</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div
              className="legal-content overflow-y-auto px-4 py-4 text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: open === 'privacy' ? legal.privacyHtml : legal.termsHtml }}
            />
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t border-gray-200">
              <button type="button" onClick={close} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </LegalCtx.Provider>
  );
}

export function LegalLink({ id, children }: { id: 'privacy' | 'terms'; children: ReactNode }) {
  const openModal = useLegalModal();
  return (
    <button
      type="button"
      onClick={() => openModal(id)}
      className="group flex items-center gap-1.5 text-sm text-white/80 hover:text-orange-400 transition-colors duration-150 text-left"
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150">
        <path d="M9 18l6-6-6-6" />
      </svg>
      {children}
    </button>
  );
}
