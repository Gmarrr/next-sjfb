import { Fragment } from 'react';

/**
 * Renders admin-editable title text:
 *   [word] → wrapped in a highlight span (orange gradient by default)
 *   newline → <br />
 */
export default function RichTitle({ text, hl = 'text-grad', as: Tag = 'span' }: { text: string; hl?: string; as?: 'span' | 'strong' }) {
  const lines = (text ?? '').split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\[[^\]]+\])/g).map((part, pi) =>
            /^\[[^\]]+\]$/.test(part) ? <Tag key={pi} className={hl}>{part.slice(1, -1)}</Tag> : <Fragment key={pi}>{part}</Fragment>,
          )}
        </Fragment>
      ))}
    </>
  );
}

/** Plain-text version (for alt text / metadata). */
export const plainTitle = (text: string) => (text ?? '').replace(/[[\]]/g, '').replace(/\n/g, ' ');

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '').replace(/^0/, '+63')}`;
