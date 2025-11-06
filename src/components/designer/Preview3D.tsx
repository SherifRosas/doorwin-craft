"use client";
import { memo, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DesignFrame } from './DesignFrame';
import type { DesignConfig } from '@/src/app/draw/page';

function CanvasContent({ design, cameraDistance, maxDimension }: { 
  design: DesignConfig; 
  cameraDistance: number; 
  maxDimension: number;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, cameraDistance]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-10, 5, -5]} intensity={0.7} />
      <pointLight position={[0, 10, 10]} intensity={1.2} />
      <DesignFrame design={design} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={Math.max(5, maxDimension * 1.2)}
        maxDistance={Math.max(50, cameraDistance * 3)}
        target={[0, 0, 0]}
        rotateSpeed={0.8}
        zoomSpeed={0.8}
        panSpeed={0.8}
        autoRotate={false}
      />
      <axesHelper args={[Math.max(20, maxDimension * 0.5)]} />
    </>
  );
}

// Error boundary wrapper for 3D preview
function Preview3DErrorBoundary({ children, design }: { children: React.ReactNode; design: DesignConfig }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setHasError(false);
  }, [design]);

  if (hasError) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#d32f2f',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
          <div>3D Preview Error</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Failed to load 3D preview. Please refresh the page.
          </div>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (e: any) {
    console.error('3D Preview error:', e);
    setHasError(true);
    return null;
  }
}

export const Preview3D = memo(function Preview3D({ design }: { design: DesignConfig }) {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [isOldIOS, setIsOldIOS] = useState(false);

  useEffect(() => {
    // Detect old iOS devices (iPhone 6 and older)
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent || '';
      if (/iPhone|iPad|iPod/.test(userAgent)) {
        const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (match && match[1]) {
          const iosVersion = parseFloat(`${match[1]}.${match[2] || '0'}`);
          if (iosVersion < 13) {
            setIsOldIOS(true);
            // iPhone 6 runs iOS 12 - disable 3D preview for better performance
            setWebglSupported(false);
            setError('3D preview is not available on this device. Please use a newer device for 3D features.');
          }
        }
      }
    }

    // Check if mobile
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth < 768);
      } catch (e) {
        console.error('Error checking mobile:', e);
      }
    };
    checkMobile();
    
    try {
      window.addEventListener('resize', checkMobile);
    } catch (e) {
      console.error('Error adding resize listener:', e);
    }

    // Check WebGL support with better iOS detection
    try {
      const canvas = document.createElement('canvas');
      // Try webgl2 first, fallback to webgl
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      
      // Try webgl2
      try {
        gl = canvas.getContext('webgl2', {
          alpha: false,
          antialias: false,
          depth: true,
          stencil: false,
          failIfMajorPerformanceCaveat: false,
          powerPreference: 'default'
        });
      } catch (e) {
        // Fallback to webgl
      }
      
      // Fallback to webgl if webgl2 failed
      if (!gl) {
        try {
          gl = canvas.getContext('webgl', {
            alpha: false,
            antialias: false,
            depth: true,
            stencil: false,
            failIfMajorPerformanceCaveat: false,
            powerPreference: 'default'
          });
        } catch (e) {
          // Still failed
        }
      }
      
      if (!gl) {
        setWebglSupported(false);
        setError('WebGL not available on this device');
      } else {
        // Test if context is actually usable
        const testShader = gl.createShader(gl.VERTEX_SHADER);
        if (!testShader) {
          setWebglSupported(false);
          setError('WebGL context is not functional');
        }
      }
    } catch (e) {
      setWebglSupported(false);
      setError('WebGL initialization failed');
    }

    return () => {
      try {
        window.removeEventListener('resize', checkMobile);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  // For old iOS devices, show a simplified view
  if (isOldIOS) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        color: '#666',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ fontSize: '48px', opacity: 0.5 }}>📐</div>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>2D Design View</div>
        <div style={{ fontSize: '12px', maxWidth: '280px' }}>
          Your device doesn't support 3D preview. The 2D canvas above shows your design.
        </div>
        <div style={{
          fontSize: '11px',
          color: '#999',
          marginTop: '8px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '4px'
        }}>
          Size: {design.width}×{design.height}mm<br/>
          Template: {design.template}
        </div>
      </div>
    );
  }

  // Calculate appropriate camera distance based on design size
  // Design is in mm, converted to units by scale 0.01, so typical window is 12-36 units
  // Camera should be 2-3x the larger dimension away
  const maxDimension = Math.max(design.width, design.height) * 0.01;
  const cameraDistance = Math.max(30, maxDimension * 2.5); // At least 30 units away

  if (!webglSupported) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#666',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
          <div>WebGL not supported</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Your browser does not support 3D preview
          </div>
        </div>
      </div>
    );
  }

  if (error || webglError) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#d32f2f',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
          <div>Error loading 3D preview</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>{error || webglError || 'Error creating WebGL context'}</div>
          <div style={{ fontSize: '11px', marginTop: '12px', color: '#666' }}>
            {isMobile ? '3D preview requires WebGL support. Please check your browser settings.' : ''}
          </div>
        </div>
      </div>
    );
  }
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        color: '#666',
        fontSize: '14px'
      }}>
        Loading 3D preview...
      </div>
    );
  }

  return (
    <Preview3DErrorBoundary design={design}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        touchAction: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <Suspense fallback={
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading 3D preview...
        </div>
      }>
        <Canvas 
          style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
          gl={(canvas) => {
            // Try to create WebGL context with iOS-friendly settings
            const contextAttributes: WebGLContextAttributes = {
              alpha: false,
              antialias: isMobile ? false : true,
              powerPreference: isMobile ? 'default' : 'high-performance',
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false,
              stencil: false,
              depth: true,
              premultipliedAlpha: false,
              desynchronized: false
            };
            
            // Try webgl2 first, fallback to webgl
            let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
            
            try {
              gl = canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null;
            } catch (e) {
              console.warn('WebGL2 not available, trying WebGL');
            }
            
            if (!gl) {
              try {
                gl = canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null;
              } catch (e) {
                console.error('WebGL context creation failed:', e);
                setWebglError('WebGL context creation failed');
              }
            }
            
            if (!gl) {
              console.error('Failed to create WebGL context');
              setWebglError('Failed to create WebGL context. Please check your browser settings.');
              // Return a dummy context or throw - but react-three/fiber will handle it
              throw new Error('Failed to create WebGL context');
            }
            
            return gl as any;
          }}
          camera={{ position: [0, 0, cameraDistance], fov: 50 }}
          dpr={isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2)}
          onCreated={({ gl }) => {
            try {
              gl.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2));
              // iOS Safari WebGL fixes
              if (isMobile && gl.domElement) {
                gl.domElement.setAttribute('touch-action', 'none');
                gl.domElement.style.touchAction = 'none';
              }
              // Clear any previous errors
              setWebglError(null);
            } catch (e: any) {
              console.error('WebGL context setup error:', e);
              setWebglError(e?.message || 'Failed to initialize 3D preview');
            }
          }}
        >
            <CanvasContent design={design} cameraDistance={cameraDistance} maxDimension={maxDimension} />
        </Canvas>
      </Suspense>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: isMobile ? '10px' : '11px',
        pointerEvents: 'none',
        maxWidth: '80%'
      }}>
        {isMobile ? '👆 Touch & drag to rotate • Pinch to zoom' : '🖱️ Drag to rotate • Scroll to zoom • Right-click to pan'}
      </div>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: isMobile ? '9px' : '10px',
        pointerEvents: 'none',
        maxWidth: '40%'
      }}>
        Size: {design.width}×{design.height}mm<br/>
        Template: {design.template}<br/>
        Material: {design.material}
      </div>
      </div>
    </Preview3DErrorBoundary>
  );
});

