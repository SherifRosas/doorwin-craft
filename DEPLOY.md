# Deployment Guide - Vercel

## Quick Deploy Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:
   
   **Required:**
   - `DATABASE_URL` (use Supabase/Neon PostgreSQL URL)
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your Vercel domain)
   - `NEXT_PUBLIC_SITE_URL` (your Vercel domain)

   **Optional (Payments):**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `TAP_SECRET_KEY`
   - `TAP_WEBHOOK_SECRET`
   - `MOYASAR_SECRET_KEY`
   - `MOYASAR_WEBHOOK_SECRET`

   **Optional (Analytics):**
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`

4. **Database Setup**
   - Create PostgreSQL database on Supabase or Neon
   - Copy connection string to `DATABASE_URL`
   - Run migrations:
     ```bash
     npx prisma generate
     npx prisma db push
     ```

5. **Deploy**
   - Vercel will auto-deploy on push to main
   - Check deployment logs for errors

## Post-Deployment

1. **Update Webhook URLs**
   - Stripe: Dashboard → Webhooks → Update endpoint to `https://your-domain.com/api/webhooks/stripe`
   - Tap/Moyasar: Update webhook URLs in their dashboards

2. **Test**
   - Visit your deployed site
   - Test registration/login
   - Test payment flow (with test keys)

3. **Custom Domain (Optional)**
   - Vercel → Project Settings → Domains
   - Add your custom domain

## Rollback

- Vercel → Deployments → Select previous deployment → "Promote to Production"




