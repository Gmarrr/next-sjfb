import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import History from '@/components/about/History';
import PhotoMosaic from '@/components/about/PhotoMosaic';
import CoreValues from '@/components/about/CoreValues';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'About | St. Joseph Fish Brokerage Inc. — Leading Fish Broker in the Philippines' },
  description:
    'Learn about St. Joseph Fish Brokerage Inc. — a trusted fish brokerage and seafood trading company in the Philippines with over 40 years of industry experience operating at Navotas Fish Port Complex.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About St. Joseph Fish Brokerage Inc.', description: 'Over 40 years of trusted fish brokerage in the Philippines. Operating at Navotas, Malabon, and Davao Fish Port.', url: '/about' },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'St. Joseph Fish Brokerage Inc.',
  url: SITE_URL,
  logo: `${SITE_URL}/assets/icons/logo.svg`,
  foundingDate: '1979',
  description: 'Leading fish brokerage and seafood trading company in the Philippines with over 40 years of experience.',
  address: { '@type': 'PostalAddress', streetAddress: 'Bulungan Ave. corner HACCP St., NFPC NBBS', addressLocality: 'Navotas', addressCountry: 'PH' },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <div className="px-4">
        <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />
      </div>
      <History />
      <PhotoMosaic />
      <CoreValues />
    </>
  );
}
