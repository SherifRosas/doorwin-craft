"use client";
import { useState, useEffect } from 'react';
import { FunnelEvents } from '@/src/lib/analytics';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';

interface User {
  id: string;
  email: string;
  orgId: string;
}

interface Billing {
  status?: string;
  trialEndsAt?: string;
  currentPeriodEnd?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [billing, setBilling] = useState<Billing | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get user from localStorage or token (client-side only) - Optimized for speed
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    // Fast path: allow guest access immediately, then try to upgrade to authenticated
    setUser({ 
      id: 'guest', 
      email: 'guest@example.com', 
      orgId: 'default-org' 
    });
    setLoading(false);
    
    // Then check for token in background (non-blocking)
    setTimeout(() => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({ 
              id: payload.sub || payload.id, 
              email: payload.email || 'user@example.com', 
              orgId: payload.orgId || 'default-org' 
            });
            FunnelEvents.dashboard_viewed();
          } catch (e) {
            console.error('Invalid token:', e);
            // Keep guest access on error
          }
        }
      } catch (e) {
        console.error('Error accessing localStorage:', e);
        // Keep guest access on error
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (user?.orgId) {
      fetchBilling(user.orgId);
    }
  }, [user]);

  async function fetchBilling(orgId: string) {
    setBillingLoading(true);
    setError(null);
    // Set optimistic default first (fast)
    setBilling({
      status: 'trial_active',
      trialEndsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    });
    
    try {
      const res = await fetch(`/api/billing?orgId=${orgId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch billing: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setBilling(data);
    } catch (error: any) {
      console.error('Failed to fetch billing:', error);
      setError(error.message || 'Failed to load billing information');
      // Keep optimistic default on error
    } finally {
      setBillingLoading(false);
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'subscribed_active':
      case 'active':
        return '#10b981'; // green
      case 'trial_active':
      case 'trial':
        return '#3b82f6'; // blue
      case 'past_due':
        return '#f59e0b'; // amber
      case 'canceled':
      case 'cancelled':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'subscribed_active':
      case 'active':
        return 'Active Subscription';
      case 'trial_active':
      case 'trial':
        return 'Free Trial';
      case 'past_due':
        return 'Payment Due';
      case 'canceled':
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <LoadingSpinner size="large" />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: isMobile ? '24px 16px' : '48px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '32px',
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '12px'
        }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 16px 0' }}>Authentication Required</h2>
          <p style={{ color: '#991b1b', margin: '0 0 24px 0' }}>
            {error || 'Please log in to access your dashboard'}
          </p>
          <a 
            href="/payment/checkout" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#1e3a5f',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d4a6b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a5f'}
          >
            Get Started
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: isMobile ? '24px 16px' : '48px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <h1 style={{
        fontSize: isMobile ? '28px' : '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 32px 0'
      }}>
        Dashboard
      </h1>

      {error && (
        <div style={{
          padding: '16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '24px',
          color: '#dc2626'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* User Info Card */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Account Information
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '16px', color: '#1f2937', fontWeight: '500' }}>{user.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Organization ID</div>
              <div style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>{user.orgId}</div>
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Subscription Status
          </h2>
          {billingLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LoadingSpinner size="small" />
              <span style={{ color: '#6b7280' }}>Loading...</span>
            </div>
          ) : billing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Status</div>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: `${getStatusColor(billing.status)}20`,
                  color: getStatusColor(billing.status),
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {getStatusLabel(billing.status)}
                </div>
              </div>
              {billing.trialEndsAt && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Trial Ends</div>
                  <div style={{ fontSize: '16px', color: '#1f2937' }}>
                    {new Date(billing.trialEndsAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
              {billing.currentPeriodEnd && (
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Next Billing Date</div>
                  <div style={{ fontSize: '16px', color: '#1f2937' }}>
                    {new Date(billing.currentPeriodEnd).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No billing information available</p>
          )}
        </div>
      </div>

      {/* Action Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3 style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '600',
          margin: '0 0 12px 0'
        }}>
          Upgrade to Full Access
        </h3>
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          margin: '0 0 24px 0',
          opacity: 0.9
        }}>
          Get unlimited designs, premium templates, and priority support
        </p>
        <a 
          href="/payment/checkout" 
          style={{
            display: 'inline-block',
            padding: isMobile ? '14px 28px' : '16px 32px',
            backgroundColor: '#ffffff',
            color: '#1e3a5f',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: isMobile ? '15px' : '16px',
            transition: 'all 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          Subscribe Now - 100 SAR/month
        </a>
      </div>
    </div>
  );
}





