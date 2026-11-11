import Link from 'next/link';

// Ported from 404.php ("Lost at Sea").
export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-300 via-blue-600 to-blue-900 min-h-[80vh] flex flex-col items-center justify-center py-20">
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Uh Oh! Lost at Sea?</h1>
        <p className="text-sm md:text-xl text-blue-100 mb-8">Looks like this page drifted a bit too far into the deep. Let&apos;s navigate you back to calmer waters!</p>
        <div className="flex justify-center mb-8 md:my-16">
          <img src="/assets/icons/404-logo.svg" alt="404" className="w-64 md:w-96 h-auto" />
        </div>
        <Link href="/" className="inline-flex items-center justify-center gap-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-6 py-3 transition-all duration-300 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" /></svg>
          Go Back
        </Link>
      </div>
    </section>
  );
}
