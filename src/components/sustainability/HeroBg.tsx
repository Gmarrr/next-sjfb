'use client';

import { useEffect, useState } from 'react';

/** Slow zoom-out on the hero background once the page has loaded (sustainability.php). */
export default function HeroBg() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 50); return () => clearTimeout(t); }, []);
  return <div className={`sustain-hero__bg ${loaded ? 'loaded' : ''}`} />;
}
