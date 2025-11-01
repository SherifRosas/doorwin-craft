"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoFullscreen, setLogoFullscreen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
      padding: isMobile ? '12px 16px' : '16px 24px',
      borderBottom: '2px solid #3a5a7a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '24px'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: isMobile ? '8px' : '12px' }}>
          <div 
            onClick={(e) => {
              e.preventDefault();
              setLogoFullscreen(true);
            }}
            style={{
              position: 'relative',
              width: isMobile ? '50px' : '60px',
              height: isMobile ? '50px' : '60px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              background: '#ffffff',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            <img
              src="/logo.jpeg"
              alt="DoorWin Craft Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: isMobile ? '2px' : '4px'
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              margin: 0,
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              DoorWin Craft
            </h1>
            {!isMobile && (
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#b0c4de',
                fontStyle: 'italic'
              }}>
                Professional Window & Door Design
              </p>
            )}
          </div>
        </Link>

        {isMobile ? (
            <>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
              {mobileMenuOpen && (
                <nav style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
                  borderTop: '1px solid #3a5a7a',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px 0',
                  zIndex: 1000
                }}>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    fontSize: '16px'
                  }}>
                    Home
                  </Link>
                  <Link href="/draw" onClick={() => setMobileMenuOpen(false)} style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    fontSize: '16px'
                  }}>
                    Designer
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '12px 24px',
                    fontSize: '16px'
                  }}>
                    Dashboard
                  </Link>
                </nav>
              )}
            </>
          ) : (
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
          )}
        </div>
      </div>
      
      {/* Fullscreen Logo Modal */}
      {logoFullscreen && (
        <div
          onClick={() => setLogoFullscreen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
            padding: '20px'
          }}
        >
          <img
            src="/logo.jpeg"
            alt="DoorWin Craft Logo - Full Size"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLogoFullscreen(false);
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            aria-label="Close fullscreen"
          >
            ✕
          </button>
        </div>
      )}
    </header>
    </>
  );
}

