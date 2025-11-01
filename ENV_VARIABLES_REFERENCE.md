# Environment Variables Reference

This document lists all environment variables used in the DoorWin Craft application.

## File Location
- **Local Development**: `.env.local` (in project root, git-ignored)
- **Production**: Set in Vercel/Docker environment variables

## Required Variables

### Core Application
```env
DATABASE_URL=file:./dev.db                    # SQLite for local dev, PostgreSQL for production
JWT_SECRET=your-secure-jwt-secret-key         # Secret for JWT token signing
NEXTAUTH_SECRET=your-nextauth-secret         # NextAuth.js secret key
NEXTAUTH_URL=http://localhost:3000            # Local dev URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000    # Public site URL
```

## Optional Variables

### Payment Gateways

#### Stripe
```env
STRIPE_SECRET_KEY=sk_test_...                # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...              # Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Stripe publishable key (client-side)
```

#### Tap Payments (Saudi Arabia)
```env
TAP_SECRET_KEY=sk_test_...                   # Tap Payments secret key
TAP_WEBHOOK_SECRET=tap_whsec_...             # Tap webhook signing secret
```

#### Moyasar (Middle East)
```env
MOYASAR_SECRET_KEY=sk_test_...               # Moyasar secret key
MOYASAR_WEBHOOK_SECRET=moyasar_whsec_...     # Moyasar webhook signing secret
```

### Analytics & Monitoring

#### Sentry (Error Tracking)
```env
NEXT_PUBLIC_SENTRY_DSN=https://...           # Sentry DSN for error tracking
```

#### PostHog (Product Analytics)
```env
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key     # PostHog project API key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # PostHog host (default)
```

### Encryption
```env
ENCRYPTION_KEY=your-32-character-key-here    # AES-256-GCM encryption key
```

## Production Setup

For production deployment (e.g., Vercel), update these:
- `DATABASE_URL`: Use PostgreSQL connection string
- `NEXTAUTH_URL`: Your production domain
- `NEXT_PUBLIC_SITE_URL`: Your production domain
- All payment gateway keys: Use live keys (not test keys)
- Webhook secrets: Update webhook endpoints in payment dashboards

## Security Notes

⚠️ **NEVER commit `.env.local` to git** - It's automatically git-ignored.

✅ **Best Practices:**
- Use strong, random secrets (32+ characters)
- Rotate secrets regularly
- Use different secrets for dev/staging/production
- Store production secrets in secure vaults (Vercel, AWS Secrets Manager, etc.)

## Getting Keys

### Stripe
1. Go to https://dashboard.stripe.com
2. Developers → API keys
3. Copy Secret key and Publishable key
4. Developers → Webhooks → Add endpoint → Copy signing secret

### Tap Payments
1. Go to https://tap.company
2. Dashboard → API Keys
3. Copy Secret key
4. Dashboard → Webhooks → Configure → Copy signing secret

### Moyasar
1. Go to https://moyasar.com
2. Dashboard → API Keys
3. Copy Secret key
4. Dashboard → Webhooks → Configure → Copy signing secret

### Sentry
1. Go to https://sentry.io
2. Projects → Your Project → Settings → Client Keys (DSN)
3. Copy DSN

### PostHog
1. Go to https://app.posthog.com
2. Project Settings → Project API Key
3. Copy API key


