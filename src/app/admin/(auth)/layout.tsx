// Centered card layout for login / forgot password.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[radial-gradient(ellipse_at_80%_15%,rgba(251,146,60,.12)_0%,transparent_55%),radial-gradient(ellipse_at_10%_85%,rgba(234,88,12,.08)_0%,transparent_55%)] bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/assets/icons/square-logo.png" alt="St. Joseph Fish Brokerage Inc." className="h-20 w-auto mx-auto drop-shadow" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[.2em] text-orange-600">Website Admin</p>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,.08),0_28px_56px_rgba(0,0,0,.06)] border border-slate-100 p-7 sm:p-8">{children}</div>
        <p className="text-center text-xs text-slate-400 mt-6">
          <a href="/" className="hover:text-orange-600">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
