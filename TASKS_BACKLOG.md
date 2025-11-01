# Two‑Week Backlog (Execution to Live)

## Week 1
- [ ] Implement Argon2 password hashing in auth service
- [ ] Enforce strict CSP middleware in Next.js
- [ ] Add per-IP rate limiting to `/api/auth/*`
- [ ] Integrate gateway (Tap or Moyasar) hosted fields
- [ ] Implement subscription create → trial → paid flow
- [ ] Add Stripe fallback for international cards
- [ ] Implement webhooks (success, failed, subscription updated)
- [ ] Gate entitlements by subscription status

## Week 2
- [ ] Add Sentry + PostHog SDKs and envs
- [ ] Instrument funnel events (design → quote → pay)
- [ ] Generate KSA-compliant invoice PDF
- [ ] Compress 3D assets (Draco + KTX2) and lazy-load
- [ ] Playwright E2E: sign-up → design → quote → payment
- [ ] Arabic RTL QA and number/currency formatting checks
- [ ] Load test designer open and checkout flows
- [ ] Create landing copy and in-app onboarding checklist

## Definition of Done (Go‑Live)
- [ ] All E2E tests pass on staging and prod preview
- [ ] Payments succeed in live gateway test modes
- [ ] CSP and security headers verified in prod
- [ ] Error rate < 1% and LCP < 2.5s on mid-tier device
- [ ] Runbook, rollback, and backups verified






