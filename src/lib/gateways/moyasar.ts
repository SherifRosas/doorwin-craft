export async function createMoyasarInvoice(amount: number, currency: string, orgId: string) {
  const secret = process.env.MOYASAR_SECRET_KEY;
  if (!secret) throw new Error('MOYASAR_SECRET_KEY not set');
  const resp = await fetch('https://api.moyasar.com/v1/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(secret + ':').toString('base64'),
    },
    body: JSON.stringify({
      amount,
      currency,
      description: 'DoorWin Craft Subscription',
      metadata: { orgId },
      callback_url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/payment/checkout` : 'http://localhost:3000/payment/checkout',
    }),
  });
  if (!resp.ok) throw new Error(`Moyasar error: ${resp.status}`);
  return resp.json();
}

export function verifyMoyasarSignature(rawBody: string, signature: string | null) {
  // Moyasar webhook: HMAC SHA256 with webhook secret, often provided in header 'Moyasar-Signature' or 'Authorization' depending on config
  const secret = process.env.MOYASAR_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const crypto = require('crypto');
  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  return digest === signature;
}






