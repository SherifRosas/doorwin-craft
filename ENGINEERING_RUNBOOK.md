# Engineering Runbook (Deploy, Rollback, On‑Call)

## Environments
- dev: preview deployments per PR
- staging: release candidates; mirrors prod env vars
- prod: customer traffic

## Deploy
1. Merge to main → CI: lint, type-check, tests, build
2. Auto-deploy to staging; smoke tests run (Playwright)
3. Approve promotion to prod
4. Tag release: `vX.Y.Z`

## Rollback
- Keep last 5 prod builds
- One-click rollback in hosting (Vercel) to previous build
- DB migrations: use `prisma migrate` with down scripts; for unsafe changes, gated rollout

## Secrets
- Stored in platform secret manager
- Rotate JWT, ENCRYPTION, webhook secrets every 90 days

## Monitoring
- Sentry alerts: P1 on crash rate > 1%, P2 on spike > 0.5%
- Uptime (Pingdom): 30s interval; alert after 2 failures
- PostHog dashboards: funnel, conversion, TTV

## On‑Call
- Business hours: primary + secondary
- Escalation: Pager → WhatsApp → Phone

## Incident response
1. Declare severity (SEV1/2/3)
2. Create incident doc: timeline, impact, hypothesis
3. Mitigate (feature flag, rollback, scale up)
4. Root cause analysis within 24h; action items with owners

## Backups / DR
- DB: daily full + 7-day PITR; test restore monthly
- Storage: versioned bucket; lifecycle rules
- DR: plan to restore in another region within 4h RTO

## Performance budgets
- LCP < 2.5s, CLS < 0.1, TBT < 200ms (web)
- 3D scene memory < 500MB on mid-tier device

## Security checks
- CSP enforced; headers present
- Automated deps scan and secret scan in CI
- Pentest checklist quarterly






