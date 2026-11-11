'use client';

import { useEffect } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

/** Enables the Fancybox lightbox for any link with data-fancybox inside the page. */
export default function Lightbox() {
  useEffect(() => {
    Fancybox.bind('[data-fancybox]', { Thumbs: { type: 'classic' } });
    return () => { Fancybox.unbind('[data-fancybox]'); Fancybox.close(); };
  }, []);
  return null;
}
