"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FunnelEvents } from '@/src/lib/analytics';

type Gateway = 'tap' | 'moyasar' | 'stripe';

export default function CheckoutPage() {
  const [gateway, setGateway] = useState<Gateway>('tap');
  const [status, setStatus] = useState<string>('');
  const StripeCheckout = dynamic(() => import('@/src/components/checkout/StripeCheckout'), { ssr: false });

  async function startPayment() {
    setStatus('Creating payment...');
    const amount = 10000; // 100 SAR in cents
    
    // Track checkout started
    FunnelEvents.checkout_started(gateway, amount);
    
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gateway, amount, currency: 'SAR', orgId: 'default-org' }),
    });
    const data = await res.json();
    
    if (data.error) {
      FunnelEvents.payment_failed(gateway, amount, data.error);
      setStatus(`Error: ${data.error}`);
      return;
    }
    
    if (gateway === 'tap' && data?.charge?.transaction?.url) {
      window.location.href = data.charge.transaction.url;
      return;
    }
    if (gateway === 'moyasar' && data?.invoice?.url) {
      window.location.href = data.invoice.url;
      return;
    }
    setStatus(JSON.stringify(data));
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Checkout</h1>
      <div style={{ marginTop: 12 }}>
        <label>
          <input type="radio" name="gw" checked={gateway==='tap'} onChange={() => setGateway('tap')} /> Tap
        </label>
        <label style={{ marginLeft: 12 }}>
          <input type="radio" name="gw" checked={gateway==='moyasar'} onChange={() => setGateway('moyasar')} /> Moyasar
        </label>
        <label style={{ marginLeft: 12 }}>
          <input type="radio" name="gw" checked={gateway==='stripe'} onChange={() => setGateway('stripe')} /> Stripe
        </label>
      </div>
      {gateway === 'stripe' ? (
        <div style={{ marginTop: 16 }}>
          <StripeCheckout />
        </div>
      ) : (
        <>
          <button onClick={startPayment} style={{ marginTop: 16 }}>Start Payment</button>
          <pre style={{ marginTop: 16 }}>{status}</pre>
        </>
      )}
    </div>
  );
}


