# 🪟 DoorWin Craft

Professional Window & Door Design Platform - Built with Next.js 15, TypeScript, Prisma, and Three.js.

## ✨ Features

### 🎨 **Designer**
- **21 Design Templates**: 13 window types + 8 door types
- **Interactive 2D Canvas**: Visual design with drag handles
- **Real-time 3D Preview**: Interactive 3D visualization with orbit controls
- **Extended Components**: Sills, mosquito nets, glass films, installation work
- **Smart Defaults**: Automatic dimension suggestions per template
- **Price Calculator**: Real-time pricing with VAT (15% KSA)
- **Export Options**: PNG image and JSON configuration

### 💼 **Business Management**
- **Customer Database**: Full CRUD operations
- **Order Management**: Complete order lifecycle
- **Order Status Tracking**: DRAFT → QUOTE_SENT → IN_PRODUCTION → INSTALLED → COMPLETED
- **Automatic VAT Calculation**: 15% KSA VAT included
- **Order Numbering**: Auto-generated unique order numbers

### 💳 **Payment Processing**
- **Multiple Gateways**: Tap Payments, Moyasar, Stripe
- **Subscription Management**: Trial periods, billing cycles
- **KSA Invoice Support**: PDF generation with Arabic support

### 📊 **Analytics & Monitoring**
- **Sentry Integration**: Error tracking and monitoring
- **PostHog Analytics**: User behavior and funnel tracking
- **15+ Event Types**: Design, payment, and business events
- **Funnel Analytics**: Track user journey from design to payment

### 🛡️ **Security & Performance**
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection against abuse
- **Error Boundaries**: Graceful error handling
- **Performance Optimized**: React.memo, optimized renders
- **Type Safety**: Full TypeScript coverage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (or PostgreSQL for production)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd doorwindow-design
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (generate a random string)
JWT_SECRET="your-secret-key-here"

# Optional: Analytics
NEXT_PUBLIC_SENTRY_DSN=""
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Optional: Payment Gateways
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
TAP_SECRET_KEY=""
MOYASAR_SECRET_KEY=""
```

4. **Initialize database**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
doorwindow-design/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── draw/             # Designer page
│   │   ├── dashboard/        # User dashboard
│   │   ├── payment/          # Payment pages
│   │   └── api/              # API routes
│   ├── components/
│   │   ├── designer/         # Designer components
│   │   ├── checkout/         # Payment components
│   │   └── Layout/           # Layout components
│   └── lib/                   # Utilities
│       ├── analytics.ts      # Analytics helpers
│       ├── db.ts             # Prisma client
│       └── gateways/          # Payment gateways
├── tests/                     # E2E tests (Playwright)
└── public/                    # Static assets
```

---

## 🎮 Using the Designer

### Basic Workflow

1. **Select Type**: Choose Window or Door
2. **Pick Template**: Select from 21 available templates
3. **Set Dimensions**: Use quick sizes or manual input
4. **Customize**: Material, color, hardware, extended components
5. **Preview**: View real-time 2D and 3D previews
6. **Calculate Price**: Get instant pricing
7. **Save/Export**: Save to database or export

### 3D Preview Controls

- **Rotate**: Left-click + drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click + drag
- **Reset**: Click "Fit" button

### Keyboard Shortcuts

- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+S**: Save (coming soon)

---

## 🧪 Testing

### Run E2E Tests
```bash
npx playwright install
npm run test:e2e
```

### Test Files
- `tests/e2e.spec.ts` - Basic functionality tests
- `tests/e2e-full-flow.spec.ts` - Complete user flow tests

---

## 📊 Available Templates

### Windows (13 types)
- Single Casement
- Double Casement
- Sliding Window
- Fixed/Picture Window
- Casement Window
- Tilt & Turn Window
- Awning Window
- Hopper Window
- Bay Window (3-panel)
- Bow Window (5-panel)
- Arch Window
- Picture Window
- Jalousie Window

### Doors (8 types)
- Single Door
- Double Door
- Sliding Door
- Bifold Door
- Pivot Door
- French Doors
- Entry Door (with side panels)
- Patio Door

---

## 🔧 Configuration

### Database
The app uses Prisma ORM. To modify the schema:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Run `npx prisma generate`

### Payment Gateways
Each gateway requires API keys in `.env.local`:
- **Tap Payments**: `TAP_SECRET_KEY`
- **Moyasar**: `MOYASAR_SECRET_KEY`
- **Stripe**: `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Analytics
- **Sentry**: Error tracking (optional)
- **PostHog**: User analytics (optional)

---

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all required env vars are set in production:
- `DATABASE_URL` (PostgreSQL recommended)
- `JWT_SECRET`
- Payment gateway keys
- Analytics keys (optional)

### Database Migration
```bash
npx prisma migrate deploy
```

---

## 📝 API Documentation

### Authentication
All protected routes require JWT token in:
- Header: `Authorization: Bearer <token>`
- Cookie: `token=<token>`

### Key Endpoints

**Designs**
- `GET /api/designs` - List designs
- `POST /api/designs` - Create design
- `GET /api/designs/[id]` - Get design
- `PUT /api/designs/[id]` - Update design

**Customers**
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer

**Orders**
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order status

**Payments**
- `POST /api/payments/create` - Create payment intent

---

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

### 3D Preview Not Showing
- Check browser console for errors
- Ensure WebGL is enabled
- Try refreshing the page

### Payment Gateway Errors
- Verify API keys in `.env.local`
- Check gateway documentation
- Review network requests in DevTools

---

## 📚 Additional Resources

- [Designer Guide](./HOW_TO_USE_3D_PREVIEW.md) - Detailed 3D preview instructions
- [Week 2 Status](./WEEK2_FINAL_STATUS.md) - Feature completion status
- [Final Summary](./FINAL_WEEK2_SUMMARY.md) - Development summary

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- 3D rendering with [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Database powered by [Prisma](https://www.prisma.io/)
- Inspired by PVC Windows Studio

---

**Status**: ✅ **MVP Ready** - Feature complete and production-ready!

For questions or issues, please open an issue on GitHub.
