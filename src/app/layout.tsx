import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
// Self-hosted fonts (no runtime call to Google Fonts)
import '@fontsource-variable/lexend';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/layout/ScrollAnimations';
import { LegalModalProvider } from '@/components/layout/LegalModals';
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
  openGraph: {
    type: 'website',
    siteName: 'St. Joseph Fish Brokerage Inc.',
    images: ['/assets/icons/square-logo.png'],
  },
  twitter: { card: 'summary_large_image' },
  verification: { google: 'SEvyztm_VEss7pZNU7eN79PfVCh0D6MskG7f9mKpJow' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const GTM_ID = 'GTM-T2JQR66S';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <body className="bg-white font-sans">
        {/* Google Tag Manager (same container as the PHP site) */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>

        <LegalModalProvider>
          <Header />
          <main id="content">{children}</main>
          <Footer />
        </LegalModalProvider>
        <ScrollAnimations />
      </body>
    </html>
  );
}
