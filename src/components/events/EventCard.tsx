import Link from 'next/link';
import type { EventRow } from '@/lib/types';
import { mediaUrl } from '@/lib/supabase';
import { fmtDay, fmtMonYear } from '@/lib/format';

// Event card from event.php's "Events" grid.
export default function EventCard({ e, idx }: { e: EventRow; idx: number }) {
  const photoCount = (e.event_gallery?.length ?? 0) + (e.event_image ? 1 : 0);
  return (
    <Link
      href={`/events/${e.event_slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-[5px] hover:shadow-xl"
      data-aos="fade-up"
      data-aos-delay={(idx % 3) * 100}
    >
      <div className="relative h-48 overflow-hidden flex-none">
        {e.event_image ? (
          <img src={mediaUrl(e.event_image)} alt={e.event_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center">
            <span className="text-white text-4xl font-bold font-display">SJ</span>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-md px-3 py-1.5 text-center leading-tight">
          <p className="text-orange-600 font-bold text-lg leading-none">{fmtDay(e.event_date)}</p>
          <p className="text-gray-500 text-[10px] uppercase font-semibold tracking-wide">{fmtMonYear(e.event_date)}</p>
        </div>
        {(e.event_gallery?.length ?? 0) > 0 && (
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/55 text-white text-xs font-semibold rounded-full backdrop-blur">
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              {photoCount}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        {e.event_audience && (
          <span className="inline-flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wide text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full w-fit">{e.event_audience}</span>
        )}
        <h2 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{e.event_title}</h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{e.event_excerpt ?? ''}</p>
        <div className="text-xs text-gray-400 space-y-1 mb-4">
          {e.event_time && (
            <p className="flex items-center gap-1.5">
              <svg className="size-3.5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {e.event_time}
            </p>
          )}
          {e.event_location && (
            <p className="flex items-center gap-1.5">
              <svg className="size-3.5 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {e.event_location}
            </p>
          )}
        </div>
        <div className="flex items-center text-orange-600 font-medium text-sm mt-auto">
          View Details
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </Link>
  );
}
