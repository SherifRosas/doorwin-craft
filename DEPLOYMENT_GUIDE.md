# 🚀 Deployment Guide

Complete guide to deploying DoorWin Craft to production.

## 📋 Prerequisites

- Node.js 18+ installed
- Database (SQLite for dev, PostgreSQL recommended for production)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt is free)
- Environment variables configured

---

## 🎯 Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel is the recommended platform as it's built by the Next.js team.

#### Steps:

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the project

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   JWT_SECRET=your-secret-key-here
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
   NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
   STRIPE_SECRET_KEY=sk_live_...
   TAP_SECRET_KEY=sk_live_...
   MOYASAR_SECRET_KEY=sk_live_...
   ```

4. **Deploy**
   - Vercel automatically builds and deploys
   - Get your deployment URL (e.g., `your-app.vercel.app`)

5. **Database Setup**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

#### Vercel Configuration File (optional)

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

### 2. Railway

1. **Create Railway account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway auto-creates `DATABASE_URL`

4. **Configure Environment Variables**
   - Add all required env vars in Railway dashboard

5. **Deploy**
   - Railway auto-deploys on git push

---

### 3. DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean dashboard
   - Create → Apps → GitHub
   - Connect repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment: Node.js 18+

3. **Add Database**
   - Create managed PostgreSQL database
   - Add `DATABASE_URL` to environment variables

4. **Deploy**

---

### 4. Self-Hosted (VPS/Docker)

#### Option A: Direct Node.js

1. **Setup Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd doorwindow-design
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with production values
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "doorwin-craft" -- start
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Option B: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Build
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=${DATABASE_URL}
         - JWT_SECRET=${JWT_SECRET}
       env_file:
         - .env.local
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

---

## 🔒 Production Checklist

### Before Going Live

- [ ] **Environment Variables**
  - [ ] All secrets are set (JWT_SECRET, API keys)
  - [ ] Database URL is production-ready
  - [ ] Analytics keys are configured
  - [ ] Payment gateway keys are production keys (not test)

- [ ] **Database**
  - [ ] Production database created
  - [ ] Migrations applied (`npx prisma migrate deploy`)
  - [ ] Database backups configured

- [ ] **Security**
  - [ ] HTTPS enabled (SSL certificate)
  - [ ] CORS configured correctly
  - [ ] Rate limiting enabled
  - [ ] Security headers configured

- [ ] **Monitoring**
  - [ ] Sentry configured for error tracking
  - [ ] PostHog configured for analytics
  - [ ] Uptime monitoring set up

- [ ] **Performance**
  - [ ] Image optimization enabled
  - [ ] CDN configured (if using)
  - [ ] Caching headers set

---

## 📊 Post-Deployment

### Health Checks

1. **Verify Application**
   - Visit your domain
   - Test login/register
   - Test designer functionality
   - Test payment flow (with test cards)

2. **Monitor Logs**
   ```bash
   # If using PM2
   pm2 logs doorwin-craft
   
   # If using Docker
   docker-compose logs -f
   ```

3. **Check Analytics**
   - Verify Sentry is receiving errors
   - Check PostHog for events
   - Monitor performance metrics

### Database Migrations

When you need to update the database schema:

```bash
# Generate migration
npx prisma migrate dev --name migration-name

# Apply to production
npx prisma migrate deploy
```

---

## 🔄 CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Errors**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

**2. Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**3. Environment Variables Not Loading**
- Ensure variables are set in deployment platform
- Restart application after adding variables
- Check variable names match exactly

**4. 3D Preview Not Working**
- Check browser console for WebGL errors
- Verify Three.js dependencies installed
- Test in different browsers

---

## 📈 Scaling

### When to Scale

- **Horizontal Scaling**: Add more instances when CPU/RAM is high
- **Database Scaling**: Upgrade database when queries are slow
- **CDN**: Use CDN for static assets at scale

### Monitoring

- **Uptime**: Use UptimeRobot or Pingdom
- **Performance**: Use Vercel Analytics or New Relic
- **Errors**: Monitor Sentry dashboard daily

---

## 🔐 Security Best Practices

1. **Never commit secrets** to git
2. **Use environment variables** for all secrets
3. **Enable HTTPS** everywhere
4. **Set secure cookies** in production
5. **Regular security updates**: `npm audit fix`
6. **Database backups** daily
7. **Rate limiting** enabled
8. **Input validation** on all API endpoints

---

## 📞 Support

If you encounter issues:
1. Check logs first
2. Review error messages
3. Check environment variables
4. Verify database connection
5. Open an issue on GitHub

---

**Last Updated**: 2024-01-01

**Ready to deploy?** Follow the checklist above and you'll be live in minutes! 🚀


