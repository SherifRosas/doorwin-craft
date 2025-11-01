"use client";
import { useState, useEffect } from 'react';

export function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
      padding: isMobile ? '24px 16px' : '32px 24px',
      borderTop: '2px solid #3a5a7a',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '20px' : '24px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: isMobile ? 'center' : 'flex-start'
        }}>
          <div style={{
            fontSize: isMobile ? '18px' : '20px',
            color: '#ffffff',
            fontWeight: 'bold'
          }}>
            Sherif Rosas
          </div>
          <div style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#b0c4de',
            fontStyle: 'italic'
          }}>
            Professional Window & Door Design Expert
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px'
        }}>
          <a 
            href="tel:+966XXXXXXXXX" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: isMobile ? '15px' : '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
              border: '1px solid rgba(255,255,255,0.2)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>📞</span>
            <span style={{ direction: 'ltr', display: 'inline-block' }}>+966XXXXXXXXX</span>
          </a>
          
          <a 
            href="https://wa.me/966XXXXXXXXX" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: isMobile ? '15px' : '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(37, 211, 102, 0.2)',
              transition: 'all 0.2s',
              border: '1px solid rgba(37, 211, 102, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(37, 211, 102, 0.3)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>💬</span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div style={{
        marginTop: isMobile ? '20px' : '24px',
        paddingTop: isMobile ? '20px' : '24px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <p style={{
          margin: 0,
          fontSize: isMobile ? '12px' : '14px',
          color: '#b0c4de'
        }}>
          © {new Date().getFullYear()} DoorWin Craft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

