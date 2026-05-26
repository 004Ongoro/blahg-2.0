'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function LinkTracker() {
  useEffect(() => {
    // Analytics tracking
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

    // Global toast listener for static content
    const handleToastEvent = (e: any) => {
      const { message, type = 'success' } = e.detail || {};
      if (!message) return;

      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message);
      else toast(message);
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('toast', handleToastEvent);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('toast', handleToastEvent);
    };
  }, []);

  return null
}