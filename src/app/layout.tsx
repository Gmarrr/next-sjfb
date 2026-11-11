import type { Metadata, Viewport } from 'next';
// Self-hosted fonts (no runtime call to Google Fonts)
import '@fontsource-variable/lexend';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import './globals.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'St. Joseph Fish Brokerage Inc. | Largest Fish Brokerage in the Philippines',
    template: '%s | St. Joseph Fish Brokerage Inc.',
  },
  description:
    'St. Joseph Fish Brokerage Inc. is the largest fish brokerage in the Philippines, providing fresh seafood trading, wholesale supply, and nationwide sourcing services.',
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  icons: { icon: '/assets/icons/logo.svg', apple: '/assets/icons/logo.svg' },
  openGraph: { type: 'website', siteName: 'St. Joseph Fish Brokerage Inc.', images: ['/assets/icons/square-logo.png'] },
  twitter: { card: 'summary_large_image' },
  verification: { google: 'SEvyztm_VEss7pZNU7eN79PfVCh0D6MskG7f9mKpJow' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className="bg-white font-sans">{children}</body>
    </html>
  );
}
