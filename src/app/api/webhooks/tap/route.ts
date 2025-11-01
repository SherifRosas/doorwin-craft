import { NextRequest, NextResponse } from 'next/server';
import { activateSubscription, cancelSubscription, markPastDue } from '@/src/lib/billing';
import { verifyTapSignature } from '@/src/lib/gateways/tap';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('tap-signature');
  const payload = await req.text();
  const ok = verifyTapSignature(payload, signature);
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  const event = JSON.parse(payload);
  // switch (event.type) {
  //   case 'charge.succeeded':
  //     activateSubscription(event.data.metadata.orgId, new Date(Date.now() + 30*24*3600*1000).toISOString());
  //     break;
  //   case 'invoice.payment_failed':
  //     markPastDue(event.data.metadata.orgId);
  //     break;
  //   case 'subscription.canceled':
  //     cancelSubscription(event.data.metadata.orgId);
  //     break;
  // }
  return NextResponse.json({ received: true });
}


