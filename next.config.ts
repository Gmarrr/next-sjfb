
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Old PHP URLs → new routes, so existing links and Google results keep working.
  async redirects() {
    return [
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/about.php', destination: '/about', permanent: true },
      { source: '/services.php', destination: '/services', permanent: true },
      { source: '/sustainability.php', destination: '/sustainability', permanent: true },
      { source: '/contact.php', destination: '/contact', permanent: true },
      { source: '/event', destination: '/events', permanent: true },
      { source: '/event.php', destination: '/events', permanent: true },
      { source: '/events.php', destination: '/events', permanent: true },
      // Shop pages were removed from the company website
      { source: '/shop', destination: '/services', permanent: false },
      { source: '/shop.php', destination: '/services', permanent: false },
      { source: '/item/:slug*', destination: '/services', permanent: false },
    ];
  },
};

export default nextConfig;
