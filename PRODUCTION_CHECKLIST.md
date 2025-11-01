# ✅ Production Deployment Checklist

Complete checklist before going live with DoorWin Craft.

## 🔐 Security

### Environment Variables
- [ ] `JWT_SECRET` - Strong, random secret (32+ characters)
- [ ] `DATABASE_URL` - Production database connection string
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Error tracking (optional but recommended)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` - Analytics (optional but recommended)
- [ ] Payment gateway keys are **production keys** (not test keys)
  - [ ] `STRIPE_SECRET_KEY` (starts with `sk_live_`)
  - [ ] `TAP_SECRET_KEY` (production key)
  - [ ] `MOYASAR_SECRET_KEY` (production key)

### Security Headers
- [ ] HTTPS enabled (SSL certificate valid)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled on API routes
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Prisma)
- [ ] XSS protection (sanitized inputs)

### Authentication
- [ ] JWT tokens expire appropriately (24h recommended)
- [ ] Password hashing uses Argon2
- [ ] Rate limiting on login (5 req/min)
- [ ] Secure cookie settings (httpOnly, secure, sameSite)

---

## 🗄️ Database

### Setup
- [ ] Production database created (PostgreSQL recommended)
- [ ] All migrations applied: `npx prisma migrate deploy`
- [ ] Prisma client generated: `npx prisma generate`
- [ ] Database connection tested

### Backup
- [ ] Automated daily backups configured
- [ ] Backup restoration tested
- [ ] Backup retention policy set (30 days minimum)

### Performance
- [ ] Database indexes on frequently queried fields
- [ ] Connection pooling configured
- [ ] Query performance tested

---

## 🚀 Application

### Build & Deploy
- [ ] Application builds successfully: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] All environment variables set in deployment platform
- [ ] Application starts without errors
- [ ] Health check endpoint responding

### Features
- [ ] User registration/login works
- [ ] Designer loads and renders correctly
- [ ] 3D preview displays and is interactive
- [ ] Template selection works
- [ ] Price calculation works
- [ ] Design save/export works
- [ ] Customer creation works
- [ ] Order creation works
- [ ] Payment flow works (test with test cards)

### Performance
- [ ] Page load times < 3 seconds
- [ ] 3D preview renders smoothly (60fps)
- [ ] No console errors in browser
- [ ] API response times < 500ms

---

## 📊 Monitoring & Analytics

### Error Tracking
- [ ] Sentry configured and receiving errors
- [ ] Error alerts configured
- [ ] Error tracking tested (throw test error)

### Analytics
- [ ] PostHog configured and receiving events
- [ ] Funnel tracking verified
- [ ] User events logging correctly

### Logging
- [ ] Application logs accessible
- [ ] Log levels appropriate (not logging sensitive data)
- [ ] Log rotation configured

### Uptime Monitoring
- [ ] Uptime monitoring service configured (UptimeRobot, Pingdom)
- [ ] Alerts set up for downtime
- [ ] Health check endpoint monitored

---

## 💳 Payment Processing

### Configuration
- [ ] All payment gateways configured with production keys
- [ ] Webhook endpoints configured
- [ ] Webhook signatures verified
- [ ] Test payments completed successfully

### Testing
- [ ] Stripe test card works
- [ ] Tap Payments test flow works
- [ ] Moyasar test flow works
- [ ] Payment success tracking works
- [ ] Payment failure handling works

### Compliance
- [ ] PCI compliance verified (using hosted payment forms)
- [ ] Refund process documented
- [ ] Customer data handling compliant with regulations

---

## 🌐 Domain & DNS

### Domain
- [ ] Custom domain configured
- [ ] SSL certificate installed and valid
- [ ] HTTPS redirects HTTP
- [ ] DNS records configured correctly

### CDN (Optional)
- [ ] CDN configured for static assets
- [ ] Cache headers set appropriately
- [ ] CDN performance tested

---

## 📱 User Experience

### Browser Compatibility
- [ ] Works in Chrome (latest)
- [ ] Works in Firefox (latest)
- [ ] Works in Safari (latest)
- [ ] Works in Edge (latest)
- [ ] Mobile responsive (test on real devices)

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader tested (basic)
- [ ] ARIA labels on interactive elements
- [ ] Color contrast meets WCAG AA standards

### Content
- [ ] All placeholder text replaced
- [ ] Error messages are user-friendly
- [ ] Loading states visible
- [ ] Success/error toasts working

---

## 📝 Documentation

### User Documentation
- [ ] README.md up to date
- [ ] Quick Start guide available
- [ ] User help/FAQ (if applicable)

### Developer Documentation
- [ ] API documentation complete
- [ ] Deployment guide accurate
- [ ] Environment variables documented
- [ ] Code comments adequate

### Internal Documentation
- [ ] Runbooks for common issues
- [ ] Contact information for support
- [ ] Escalation procedures

---

## 🔄 CI/CD

### Automated Deployments
- [ ] CI pipeline configured (GitHub Actions, etc.)
- [ ] Tests run automatically
- [ ] Deployments triggered on main branch
- [ ] Rollback procedure documented

### Testing
- [ ] E2E tests passing
- [ ] Unit tests passing (if applicable)
- [ ] Smoke tests after deployment

---

## 🎯 Launch

### Pre-Launch
- [ ] All checklist items completed
- [ ] Stakeholder approval obtained
- [ ] Launch announcement prepared
- [ ] Support team briefed

### Launch Day
- [ ] Monitor error rates closely
- [ ] Watch analytics dashboard
- [ ] Check payment processing
- [ ] Monitor server resources

### Post-Launch (First 48 Hours)
- [ ] Monitor user feedback
- [ ] Track error rates
- [ ] Verify analytics data
- [ ] Check payment processing
- [ ] Review performance metrics

---

## 📊 Success Metrics

After launch, track:
- [ ] User registrations
- [ ] Designs created
- [ ] Orders placed
- [ ] Payment completion rate
- [ ] Error rate (should be < 1%)
- [ ] Average page load time
- [ ] 3D preview interaction rate

---

## 🆘 Emergency Contacts

Document:
- [ ] Database administrator contact
- [ ] Payment gateway support contacts
- [ ] Hosting provider support
- [ ] On-call developer contact

---

## ✅ Final Sign-Off

- [ ] Technical lead approval: ________________
- [ ] Product owner approval: ________________
- [ ] Security review completed: ________________
- [ ] Launch date/time: ________________

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

**Last Updated**: ________________

---

## 🎉 You're Ready to Launch!

Once all items are checked, you're ready to go live. Good luck! 🚀


