import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { activateSubscription, cancelSubscription, markPastDue } from '@/src/lib/billing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') as string;
  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const orgId = String(pi.metadata?.orgId || 'default-org');
      const periodEnd = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      await activateSubscription(orgId, periodEnd);
      
      // Record payment
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          amount: pi.amount,
          currency: pi.currency,
          gateway: 'stripe',
          gatewayId: pi.id,
          status: 'SUCCEEDED'
        })
      });
      break;
    }
    case 'invoice.payment_succeeded': {
      const inv = event.data.object as Stripe.Invoice;
      const orgId = String(inv.metadata?.orgId || 'default-org');
      const periodEnd = new Date((inv.lines.data[0]?.period?.end || Math.floor(Date.now()/1000)) * 1000).toISOString();
      await activateSubscription(orgId, periodEnd);
      break;
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      const orgId = String(inv.metadata?.orgId || 'default-org');
      await markPastDue(orgId);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const orgId = String(sub.metadata?.orgId || 'default-org');
      await cancelSubscription(orgId);
      break;
    }
    default:
      break;
  }
  return NextResponse.json({ received: true });
}


