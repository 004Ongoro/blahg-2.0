'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function LinkTracker() {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href && typeof window.gtag === 'function') {
        window.gtag('event', 'click', {
          'event_category': 'link_click',
          'event_label': anchor.href,
          'transport_type': 'beacon',
          'outbound': anchor.href.startsWith('http') && !anchor.href.includes(window.location.hostname)
        });
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return null
}