"use client";
import Link from 'next/link';

export function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
      padding: '16px 24px',
      borderBottom: '2px solid #3a5a7a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
          <div style={{
            position: 'relative',
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            background: '#ffffff'
          }}>
            <img
              src="/logo.jpeg"
              alt="MAHMOUD SAAD KITCHEN Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '4px'
              }}
            />
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              DoorWin Craft
            </h1>
            <p style={{
              margin: 0,
              fontSize: '12px',
              color: '#b0c4de',
              fontStyle: 'italic'
            }}>
              Professional Window & Door Design
            </p>
          </div>
        </Link>

        <nav style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Home
          </Link>
          <Link href="/draw" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Designer
          </Link>
          <Link href="/dashboard" style={{
            color: '#ffffff',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

