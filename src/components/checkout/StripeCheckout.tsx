"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FunnelEvents } from '@/src/lib/analytics';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function CheckoutInner() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<string>('');

  async function handleSubmit() {
    setStatus('Creating PaymentIntent...');
    const amount = 10000; // 100 SAR in cents
    
    FunnelEvents.checkout_started('stripe', amount);
    
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gateway: 'stripe', amount, currency: 'SAR', orgId: 'default-org' }),
    });
    const data = await res.json();
    if (!data.client_secret) {
      FunnelEvents.payment_failed('stripe', amount, data.error || 'No client secret');
      setStatus(`Error: ${data.error || 'No client secret'}`);
      return;
    }
    setStatus('Confirming payment...');
    const result = await stripe?.confirmCardPayment(data.client_secret, {
      payment_method: { card: elements?.getElement(CardElement)! },
    });
    if (result?.error) {
      FunnelEvents.payment_failed('stripe', amount, result.error.message);
      setStatus(`Error: ${result.error.message}`);
    } else if (result?.paymentIntent?.status === 'succeeded') {
      FunnelEvents.payment_completed('stripe', amount, result.paymentIntent.id);
      setStatus('Payment succeeded!');
    } else {
      setStatus(`Status: ${result?.paymentIntent?.status}`);
    }
  }

  return (
    <div>
      <CardElement options={{ hidePostalCode: true }} />
      <button onClick={handleSubmit} style={{ marginTop: 12 }}>Pay 100 SAR</button>
      <div style={{ marginTop: 12 }}>
        <small>{status}</small>
      </div>
    </div>
  );
}

export default function StripeCheckout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}







