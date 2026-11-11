// Date helpers that mirror the PHP date() formats used on the old site.
// Dates are parsed as calendar dates (no timezone shift) so "2025-10-31" never shows as Oct 30.

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parts(value: string) {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return { y, m, d };
}

/** "F d, Y" → October 31, 2025 */
export const fmtLong = (v: string) => { const { y, m, d } = parts(v); return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}, ${y}`; };
/** "M d, Y" → Oct 31, 2025 */
export const fmtShort = (v: string) => { const { y, m, d } = parts(v); return `${MONTHS[m - 1].slice(0, 3)} ${String(d).padStart(2, '0')}, ${y}`; };
/** "d" → 31 */
export const fmtDay = (v: string) => String(parts(v).d).padStart(2, '0');
/** "M Y" → Oct 2025 */
export const fmtMonYear = (v: string) => { const { y, m } = parts(v); return `${MONTHS[m - 1].slice(0, 3)} ${y}`; };
/** "F Y" → October 2025 */
export const fmtMonthYear = (v: string) => { const { y, m } = parts(v); return `${MONTHS[m - 1]} ${y}`; };

/** Today's date in Manila as YYYY-MM-DD. */
export function todayManila(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila' }).format(new Date());
}

export const isPastDate = (v: string) => v.slice(0, 10) < todayManila();

export function truncate(text: string | null | undefined, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
}
