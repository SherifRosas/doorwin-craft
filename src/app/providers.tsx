"use client";
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN && !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    try {
      if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 });
      }
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        });
        (window as any).posthog = posthog;
      }
    } catch {}
  }, []);

  return <>{children}</>;
}








