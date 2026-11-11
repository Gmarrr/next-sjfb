import Link from 'next/link';
import { Fragment } from 'react';

type Crumb = { label: string; href?: string };

const Chevron = () => (
  <li className="flex items-center">
    <svg className="shrink-0 mx-2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
  </li>
);

/**
 * Ported from components/nav_crumb.php. `alwaysShow` matches the PHP behaviour:
 * visible on blog/event pages at every size, otherwise only on small screens.
 */
export default function Breadcrumbs({ items, alwaysShow = false, className = '' }: { items: Crumb[]; alwaysShow?: boolean; className?: string }) {
  const all: Crumb[] = [{ label: 'Home', href: '/' }, ...items];
  return (
    <div className={`max-w-[85rem] py-2 ${alwaysShow ? 'block' : 'block md:hidden'} ${className}`}>
      <div className="bg-white">
        <ol className="flex items-center flex-wrap text-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          {all.map((c, i) => (
            <Fragment key={i}>
              {i > 0 && <Chevron />}
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center text-gray-800">
                {c.href ? (
                  <Link href={c.href} itemProp="item" className="hover:text-orange-600"><span itemProp="name">{c.label}</span></Link>
                ) : (
                  <span itemProp="name" className="text-gray-600 font-medium">{c.label}</span>
                )}
                <meta itemProp="position" content={String(i + 1)} />
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
    </div>
  );
}
