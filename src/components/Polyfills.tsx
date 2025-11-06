"use client";
import { useEffect } from 'react';
import { detectDevice, isOldIOSDevice, isOldAndroidDevice } from '@/src/lib/deviceDetection';

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

      // Add Object.assign polyfill for very old browsers (iOS < 9)
      if (!Object.assign) {
        Object.assign = function(target: any, ...sources: any[]) {
          if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          const to = Object(target);
          for (let index = 0; index < sources.length; index++) {
            const nextSource = sources[index];
            if (nextSource != null) {
              for (const nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        };
      }

      // Add Promise polyfill check (iOS 8+ has Promise, but older might not)
      if (!window.Promise) {
        console.warn('Promise not supported - some features may not work');
      }

      // Add Array.from polyfill for older browsers (Android < 5, iOS < 9)
      if (!Array.from) {
        (Array as any).from = function(arrayLike: any) {
          return [].slice.call(arrayLike);
        };
      }

      // Add Array.includes polyfill for older browsers (Android < 7, iOS < 9)
      if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement: any, fromIndex?: number) {
          const O = Object(this);
          const len = parseInt(O.length) || 0;
          if (len === 0) return false;
          const n = parseInt(fromIndex as any) || 0;
          let k = n >= 0 ? n : Math.max(len + n, 0);
          while (k < len) {
            if (O[k] === searchElement) return true;
            k++;
          }
          return false;
        };
      }

      // Add String.includes polyfill for older browsers
      if (!String.prototype.includes) {
        String.prototype.includes = function(search: string, start?: number) {
          'use strict';
          if (typeof start !== 'number') {
            start = 0;
          }
          if (start + search.length > this.length) {
            return false;
          } else {
            return this.indexOf(search, start) !== -1;
          }
        };
      }

      // Add requestAnimationFrame polyfill for very old browsers
      if (!window.requestAnimationFrame) {
        let lastTime = 0;
        window.requestAnimationFrame = function(callback: FrameRequestCallback) {
          const currTime = Date.now();
          const timeToCall = Math.max(0, 16 - (currTime - lastTime));
          const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
        window.cancelAnimationFrame = function(id: number) {
          clearTimeout(id);
        };
      }

      // Add CSS custom properties (CSS variables) support detection
      if (!CSS || !CSS.supports || !CSS.supports('color', 'var(--fake-var)')) {
        // Older browsers don't support CSS variables - add fallback handling
        document.documentElement.classList.add('no-css-vars');
      }

      // Detect device capabilities and add classes for CSS targeting
      const device = detectDevice();
      if (device.isIOS) {
        document.documentElement.classList.add('ios-device');
        if (device.iosVersion !== null) {
          document.documentElement.classList.add(`ios-${Math.floor(device.iosVersion)}`);
        }
      }
      if (device.isAndroid) {
        document.documentElement.classList.add('android-device');
        if (device.androidVersion !== null) {
          document.documentElement.classList.add(`android-${Math.floor(device.androidVersion)}`);
        }
      }
      if (device.isOldDevice) {
        document.documentElement.classList.add('old-device');
      }
      if (device.isMobile) {
        document.documentElement.classList.add('mobile-device');
      }
      if (device.isTablet) {
        document.documentElement.classList.add('tablet-device');
      }
    }
  }, []);

  return null; // This component doesn't render anything
}

