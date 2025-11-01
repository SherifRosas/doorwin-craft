export async function createTapCharge(amount: number, currency: string, orgId: string) {
  const secret = process.env.TAP_SECRET_KEY;
  if (!secret) throw new Error('TAP_SECRET_KEY not set');
  const resp = await fetch('https://api.tap.company/v2/charges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      amount: amount / 100,
      currency,
      threeDSecure: true,
      save_card: false,
      description: 'DoorWin Craft Subscription',
      statement_descriptor: 'DoorWinCraft',
      metadata: { orgId },
      redirect: {
        url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/payment/checkout` : 'http://localhost:3000/payment/checkout',
      },
      source: { id: 'src_all' },
    }),
  });
  if (!resp.ok) throw new Error(`Tap error: ${resp.status}`);
  return resp.json();
}

export function verifyTapSignature(rawBody: string, signature: string | null) {
  // Tap sends HMAC SHA256 of payload using the webhook secret as key
  const secret = process.env.TAP_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const crypto = require('crypto');
  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  return digest === signature;
}






