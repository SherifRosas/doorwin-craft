# ⚡ Quick Start Guide

Get DoorWin Craft running in **5 minutes**!

## 🚀 Fast Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Create `.env.local`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key-change-in-production"
```

### 3. Initialize Database
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Visit: **http://localhost:3000**

---

## ✅ Verify It Works

1. **Home Page**: Should see "DoorWin Craft" header
2. **Designer**: Click "Designer" in header → Should see 2D/3D canvas
3. **3D Preview**: Try dragging to rotate, scrolling to zoom
4. **Templates**: Click different templates → 3D preview should update
5. **Quick Sizes**: Click a preset → Dimensions should change

---

## 🎨 First Design

1. Go to `/draw`
2. Select a template (e.g., "Double Casement")
3. Click "Medium" in Quick Sizes
4. Change material to "Aluminum"
5. Click "Calculate Price"
6. See the price appear!

---

## 🔧 Troubleshooting

### Database Errors
```bash
# Reset database (development only)
npx prisma migrate reset --force
npx prisma migrate dev
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### 3D Preview Not Showing
- Check browser console for errors
- Try a different browser (Chrome/Firefox recommended)
- Ensure WebGL is enabled in browser settings

---

## 📚 Next Steps

- **Read**: [README.md](./README.md) for full documentation
- **Explore**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- **Deploy**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production setup

---

## 🎯 Common Tasks

### Add a New Template
1. Add template ID to `WindowTemplate` or `DoorTemplate` type
2. Add to `TemplatePicker.tsx` templates array
3. Add rendering logic in `DesignFrame.tsx`
4. Add price multiplier in `DesignActions.tsx`

### Add Analytics Event
1. Add to `FunnelEvents` in `src/lib/analytics.ts`
2. Call from component: `FunnelEvents.your_event()`

### Customize Styling
- Edit inline styles in components
- Or create CSS modules in `src/styles/`

---

## 🆘 Need Help?

- **Documentation**: Check the `README.md`
- **API Issues**: See `API_DOCUMENTATION.md`
- **Deployment**: Follow `DEPLOYMENT_GUIDE.md`
- **3D Preview**: Read `HOW_TO_USE_3D_PREVIEW.md`

---

**You're all set!** Start designing windows and doors! 🪟✨


