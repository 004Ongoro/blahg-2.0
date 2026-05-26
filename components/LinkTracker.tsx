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
    const VIBRANT_COLORS = [
      '#ff007f', // Bright Pink
      '#7000ff', // Electric Purple
      '#00d4ff', // Neon Blue
      '#00ff88', // Vibrant Green
      '#ff5e00', // Hot Orange
      '#d4ff00', // Acid Yellow
      '#ff0033', // Deep Red
      '#00f2ff', // Bright Teal
      '#bc13fe', // Electric Purple
      '#39ff14', // Neon Green
    ];

    let lastColorIndex = -1;

    const getRandomColor = () => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * VIBRANT_COLORS.length);
      } while (newIndex === lastColorIndex);
      
      lastColorIndex = newIndex;
      return VIBRANT_COLORS[newIndex];
    };

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

    // Dynamic hover color
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.closest('.prose-brutal')) {
        anchor.style.setProperty('--hover-color', getRandomColor());
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
    document.addEventListener('mouseenter', handleLinkHover, true);
    window.addEventListener('toast', handleToastEvent);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      document.removeEventListener('mouseenter', handleLinkHover, true);
      window.removeEventListener('toast', handleToastEvent);
    };
  }, []);

  return null
}