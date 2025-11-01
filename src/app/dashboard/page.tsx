"use client";
import { useState, useEffect } from 'react';
import { FunnelEvents } from '@/src/lib/analytics';

interface User {
  id: string;
  email: string;
  orgId: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage or token
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT to get user info (in real app, verify token)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.sub, email: payload.email, orgId: payload.orgId });
        // Track dashboard viewed
        FunnelEvents.dashboard_viewed();
      } catch (e) {
        console.error('Invalid token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user?.orgId) {
      fetchBilling(user.orgId);
    }
  }, [user]);

  async function fetchBilling(orgId: string) {
    try {
      const res = await fetch(`/api/billing?orgId=${orgId}`);
      const data = await res.json();
      setBilling(data);
    } catch (error) {
      console.error('Failed to fetch billing:', error);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <div style={{ marginTop: 16 }}>
        <h2>User Info</h2>
        <p>Email: {user.email}</p>
        <p>Org ID: {user.orgId}</p>
      </div>
      
      {billing && (
        <div style={{ marginTop: 16 }}>
          <h2>Subscription Status</h2>
          <p>Status: {billing.status}</p>
          {billing.trialEndsAt && (
            <p>Trial ends: {new Date(billing.trialEndsAt).toLocaleString()}</p>
          )}
          {billing.currentPeriodEnd && (
            <p>Current period ends: {new Date(billing.currentPeriodEnd).toLocaleString()}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <a href="/payment/checkout" style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Subscribe Now (100 SAR/month)
        </a>
      </div>
    </div>
  );
}





