# Analytics & Telemetry Plan (Sentry + PostHog)

## Tools
- Errors: Sentry (source maps, release tracking)
- Product analytics: PostHog (self-hosted optional) or Mixpanel
- Session replay: PostHog recordings

## SDK setup
- Add Sentry/PH SDKs in app root provider; load only client-side for replay

```ts
// src/app/providers.tsx (example)
import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 });
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, { api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST });
}
```

## Event schema
- user_signed_up { method }
- design_created { type, material, width_mm, height_mm }
- quote_generated { total_sar, items_count }
- quote_sent { channel }
- payment_succeeded { amount_sar, gateway }
- subscription_state_changed { from, to }

## Wrapper
```ts
// src/lib/analytics.ts
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try { (window as any).posthog?.capture(event, props); } catch {}
}
```

## Funnel dashboards
- Sign up → first design → quote → payment
- Time-to-value (signup → first design)
- Errors per 1k sessions, rage clicks, slow loads

## Acceptance
- Events visible in PostHog within 5 minutes
- Error traces in Sentry with release and environment tags
- Session recordings available for trial users (respect consent)






