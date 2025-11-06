"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Preview3D } from '@/src/components/designer/Preview3D';
import type { DesignConfig } from '@/src/app/draw/page';

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [design, setDesign] = useState<DesignConfig | null>(null);

  useEffect(() => {
    // Try to get design from URL params first
    const designParam = searchParams.get('design');
    if (designParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(designParam));
        setDesign(parsed);
      } catch (e) {
        console.error('Failed to parse design from URL:', e);
      }
    } else {
      // Fallback to localStorage
      const savedDesign = localStorage.getItem('currentDesign');
      if (savedDesign) {
        try {
          setDesign(JSON.parse(savedDesign));
        } catch (e) {
          console.error('Failed to parse design from localStorage:', e);
        }
      }
    }
  }, [searchParams]);

  if (!design) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ color: '#666', marginBottom: '12px' }}>No Design Found</h2>
          <p style={{ color: '#999', marginBottom: '24px' }}>
            Please create a design first to view it in 3D
          </p>
          <button
            onClick={() => router.push('/draw')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Go to Designer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      background: '#f5f5f5'
    }}>
      <button
        onClick={() => router.push('/draw')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          backgroundColor: 'rgba(33, 150, 243, 0.9)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        ← Back to Designer
      </button>
      <div style={{
        width: '100%',
        height: '100vh',
        position: 'relative'
      }}>
        <Preview3D design={design} />
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#666' }}>Loading 3D preview...</p>
        </div>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}

