import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { activateSubscription } from '@/src/lib/billing';

export async function POST(req: NextRequest) {
  const { orgId, amount, currency, gateway, gatewayId, status } = await req.json();

  try {
    // Record payment in database
    const payment = await db.payment.create({
      data: {
        orgId,
        amount,
        currency,
        gateway,
        gatewayId,
        status: status || 'PENDING'
      }
    });

    // If payment succeeded, activate subscription
    if (status === 'SUCCEEDED') {
      const periodEnd = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days
      await activateSubscription(orgId, periodEnd.toISOString());
    }

    return NextResponse.json({ payment });

  } catch (error) {
    console.error('Payment recording error:', error);
    return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
  }
}






