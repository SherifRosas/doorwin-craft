import { NextRequest, NextResponse } from 'next/server';
import { activateSubscription, cancelSubscription, markPastDue } from '@/src/lib/billing';
import { verifyMoyasarSignature } from '@/src/lib/gateways/moyasar';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get('moyasar-signature') || req.headers.get('authorization');
  const ok = verifyMoyasarSignature(raw, signature);
  if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  const body = JSON.parse(raw);
  // switch (body.event) {
  //   case 'invoice.paid':
  //     activateSubscription(body.data.metadata.orgId, new Date(Date.now() + 30*24*3600*1000).toISOString());
  //     break;
  //   case 'invoice.failed':
  //     markPastDue(body.data.metadata.orgId);
  //     break;
  //   case 'subscription.canceled':
  //     cancelSubscription(body.data.metadata.orgId);
  //     break;
  // }
  return NextResponse.json({ ok: true });
}


