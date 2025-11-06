"use client";
import { useState, useEffect } from 'react';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Check if splash screen has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown === 'true') {
      // Already shown in this session, skip it
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    // Show splash for 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // After fade out animation completes, remove from DOM
      setTimeout(() => {
        setShouldRender(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 500); // Match fade out duration
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1e3a5f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'splashPulse 2s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Logo */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          background: '#ffffff',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'logoFloat 3s ease-in-out infinite'
        }}>
          <img
            src="/logo.jpeg"
            alt="DoorWin Craft Logo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        
        {/* App Name */}
        <div style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#ffffff',
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          animation: 'splashFadeIn 1s ease-in'
        }}>
          DoorWin Craft
        </div>
        
        {/* Loading indicator */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            animation: 'splashDot1 1.4s ease-in-out infinite'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            animation: 'splashDot2 1.4s ease-in-out infinite'
          }} />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#4caf50',
            animation: 'splashDot3 1.4s ease-in-out infinite'
          }} />
        </div>
      </div>

    </div>
  );
}

