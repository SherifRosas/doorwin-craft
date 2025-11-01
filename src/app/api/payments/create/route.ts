import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createTapCharge } from '@/src/lib/gateways/tap';
import { createMoyasarInvoice } from '@/src/lib/gateways/moyasar';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : undefined;

export async function POST(req: NextRequest) {
  const { gateway, amount, currency, orgId } = await req.json();
  // Create a payment intent/token per gateway
  switch (gateway) {
    case 'tap':
      try {
        const charge = await createTapCharge(amount, currency, orgId);
        return NextResponse.json({ gateway, charge });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    case 'moyasar':
      try {
        const invoice = await createMoyasarInvoice(amount, currency, orgId);
        return NextResponse.json({ gateway, invoice });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    case 'stripe':
      if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
      try {
        const pi = await stripe.paymentIntents.create({
          amount,
          currency: String(currency).toLowerCase(),
          metadata: { orgId: String(orgId) },
          automatic_payment_methods: { enabled: true },
        });
        return NextResponse.json({ gateway, client_secret: pi.client_secret, amount, currency, orgId });
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    default:
      return NextResponse.json({ error: 'Unsupported gateway' }, { status: 400 });
  }
}


