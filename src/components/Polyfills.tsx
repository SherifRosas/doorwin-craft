"use client";
import { useEffect } from 'react';

export function Polyfills() {
  useEffect(() => {
    // Load ResizeObserver polyfill for older browsers (iOS Safari < 13.4)
    if (typeof window !== 'undefined' && !window.ResizeObserver) {
      import('resize-observer-polyfill').then((module) => {
        window.ResizeObserver = module.default;
      }).catch((error) => {
        console.error('Failed to load ResizeObserver polyfill:', error);
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

