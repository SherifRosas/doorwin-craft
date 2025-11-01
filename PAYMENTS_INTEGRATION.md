# Payments Integration (Tap/Moyasar + Stripe) with Webhooks

## Gateways
- Primary (KSA): Tap or Moyasar
- Global fallback: Stripe
- Collect card data only via hosted fields/elements; never touch PANs on your server

## Plans and trials
- Trial: 24 hours full access
- Subscription: 100 SAR/month recurring

## Required events (all gateways)
- payment_intent.succeeded / charge.succeeded → activate subscription if first payment
- invoice.payment_succeeded → extend access for next period
- invoice.payment_failed → trigger dunning, start grace period
- customer.subscription.deleted/canceled → restrict access at term end

## Tap Payments (example)
- Use Web SDK Hosted Fields: tokenize → send token to server → create charge
- Webhook verify via `signature` header

```ts
// src/app/api/webhooks/tap/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('tap-signature');
  const payload = await req.text();
  // verify signature using your secret
  // const event = verifyTapSignature(payload, signature);
  // switch(event.type) { case 'charge.succeeded': ... }
  return NextResponse.json({ received: true });
}
```

## Moyasar (example)
- Elements for PCI SAQ-A. Tokenize, then server-side charge with secret key

```ts
// src/app/api/webhooks/moyasar/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  // verify via HMAC or secret comparison depending on configuration
  // handle invoice/payment events accordingly
  return NextResponse.json({ ok: true });
}
```

## Stripe (fallback)
- Stripe Elements on web; Apple/Google Pay via Payment Request Button when available
- Webhooks: verify with Stripe-Signature header

```ts
// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  // switch on event.type and update subscription state
  return NextResponse.json({ received: true });
}
```

## Subscription state machine
- trial_active → payment_succeeded: subscribed_active
- invoice_failed (dunning) → past_due (grace 7 days)
- still failed → canceled

## Invoicing (KSA)
- Generate PDF invoice with ZATCA fields (seller name, VAT number, QR code)
- Store invoice URL on `payments` table

## Entitlements gating
- Check `org.subscription_status` server-side (middleware or server actions)
- Limit exports/features during trial; full features when subscribed






