import Link from 'next/link';
import type { ReactNode } from 'react';

export const inputCls = 'w-full py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-[3px] focus:ring-orange-500/10 transition';

export function PageHeader({ title, description, actions, back }: { title: string; description?: string; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-orange-600 mb-2">
          <svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[1.7rem] font-extrabold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ title, description, children, className = '', actions }: { title?: string; description?: string; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,.04),0_4px_16px_-8px_rgba(15,23,42,.08)] ${className}`}>
      {title && (
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-[.95rem] font-bold text-slate-900 flex items-center gap-2"><span className="h-4 w-1 rounded-full bg-gradient-to-b from-orange-500 to-amber-400" />{title}</h2>
            {description && <p className="text-xs text-slate-500 mt-1 pl-3">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5 space-y-4">{children}</div>
    </section>
  );
}

export function Label({ children, htmlFor, required, help }: { children: ReactNode; htmlFor?: string; required?: boolean; help?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="block text-[.8125rem] font-semibold text-slate-700">
        {children} {required && <span className="text-red-500">*</span>}
      </label>
      {help && <p className="text-xs text-slate-400 mt-0.5">{help}</p>}
    </div>
  );
}

export function ButtonLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' }) {
  return (
    <Link href={href} className={variant === 'primary' ? btnPrimary : btnSecondary}>{children}</Link>
  );
}

export const btnPrimary = 'inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-sm font-semibold shadow-[0_4px_12px_-2px_rgba(234,88,12,.35)] transition active:scale-[.98] disabled:opacity-60 disabled:pointer-events-none';
export const btnSecondary = 'inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition disabled:opacity-60';
export const btnDanger = 'inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition disabled:opacity-60';

const BADGE: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  draft: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  new: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  read: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  replied: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  archived: 'bg-slate-50 text-slate-400 ring-slate-400/20',
  owner: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  editor: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  hidden: 'bg-slate-100 text-slate-500 ring-slate-500/20',
};
export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[.7rem] font-semibold capitalize ring-1 ring-inset ${BADGE[value] ?? BADGE.read}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />{label ?? value}
    </span>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-14 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="mx-auto mb-3 size-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
        <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
      </div>
      <p className="font-semibold text-slate-800">{title}</p>
      {text && <p className="text-sm text-slate-500 mt-1">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Thumb({ src, alt = '' }: { src: string; alt?: string }) {
  return src ? (
    <img src={src} alt={alt} className="size-12 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0" />
  ) : (
    <div className="size-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xs font-bold flex items-center justify-center shrink-0">SJ</div>
  );
}
