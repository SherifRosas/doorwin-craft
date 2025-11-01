"use client";
import { useEffect } from 'react';

export function Polyfills() {
  useEffect(() => {
    // Load ResizeObserver polyfill for older browsers (iOS Safari < 13.4)
    // This must load BEFORE any component tries to use ResizeObserver
    if (typeof window !== 'undefined') {
      // Check if ResizeObserver is missing or incomplete
      if (!window.ResizeObserver || typeof window.ResizeObserver !== 'function') {
        // Load synchronously if possible, otherwise async
        try {
          // Try to require it synchronously (works in some builds)
          const ResizeObserverPolyfill = require('resize-observer-polyfill');
          window.ResizeObserver = ResizeObserverPolyfill.default || ResizeObserverPolyfill;
        } catch (e) {
          // Fallback to async import
          import('resize-observer-polyfill').then((module) => {
            window.ResizeObserver = module.default;
            // Force a small delay to ensure it's loaded before other components
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 0);
          }).catch((error) => {
            console.error('Failed to load ResizeObserver polyfill:', error);
          });
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

