export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fishbrokers.net').replace(/\/$/, '');
export const SITE_NAME = 'St. Joseph Fish Brokerage Inc.';

export const NAV_LINKS = [
  { label: 'Home', href: '/', title: 'St. Joseph Fish Brokerage Inc. – Largest Fish Brokerage in the Philippines' },
  { label: 'About', href: '/about', title: 'About St. Joseph Fish Brokerage Inc. – The Largest Fish Brokerage in the Philippines' },
  { label: 'Events', href: '/events', title: 'Event and Life at St. Joseph – St. Joseph Fish Brokerage Inc.' },
  { label: 'Services', href: '/services', title: 'Fish Brokerage Services in the Philippines – Seafood Trading & Wholesale' },
  { label: 'Contact', href: '/contact', title: 'Contact us at St. Joseph Fish Brokerage Inc. – Contact us Directly' },
] as const;

/** Footer "Explore" list (nav links + pages that aren't in the top bar). */
export const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Services', href: '/services' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
] as const;
