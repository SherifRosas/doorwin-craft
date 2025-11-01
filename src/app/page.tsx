export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 32,
        padding: '32px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%)',
        borderRadius: '12px'
      }}>
        <h1 style={{ margin: '16px 0 8px 0', fontSize: '32px', color: '#1e3a5f' }}>
          DoorWin Craft
        </h1>
        <p style={{ marginTop: 8, fontSize: '18px', color: '#666' }}>
          Professional Window & Door Design Platform
        </p>
      </div>
      
      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <a href="/payment/checkout" style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#0070f3', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Test Payments
        </a>
        
        <a href="/dashboard" style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Dashboard
        </a>
        
        <a href="/draw" style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#ff6b35', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Open Designer 🎨
        </a>
        
        <a href="/api/protected-example" style={{ 
          display: 'inline-block', 
          padding: '12px 24px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          Test Protected API
        </a>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Features</h2>
        <ul>
          <li>✅ Multi-gateway payment processing (Stripe, Tap, Moyasar)</li>
          <li>✅ 24-hour free trial system</li>
          <li>✅ Secure authentication with Argon2</li>
          <li>✅ Rate limiting and security middleware</li>
          <li>✅ Database integration with Prisma</li>
          <li>✅ Subscription billing management</li>
        </ul>
      </div>
    </main>
  );
}


