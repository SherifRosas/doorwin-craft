"use client";
import { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DesignFrame } from './DesignFrame';
import type { DesignConfig } from '@/src/app/draw/page';

export const Preview3D = memo(function Preview3D({ design }: { design: DesignConfig }) {
  // Calculate appropriate camera distance based on design size
  // Design is in mm, converted to units by scale 0.01, so typical window is 12-36 units
  // Camera should be 2-3x the larger dimension away
  const maxDimension = Math.max(design.width, design.height) * 0.01;
  const cameraDistance = Math.max(30, maxDimension * 2.5); // At least 30 units away
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none' }}>
      <Canvas 
        style={{ width: '100%', height: '100%', background: '#f5f5f5' }}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, cameraDistance], fov: 50 }}
      >
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
          minDistance={maxDimension * 1.2}
          maxDistance={cameraDistance * 3}
          target={[0, 0, 0]}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={0.8}
        />
        <axesHelper args={[Math.max(20, maxDimension * 0.5)]} />
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '11px',
        pointerEvents: 'none'
      }}>
        🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '10px',
        pointerEvents: 'none'
      }}>
        Size: {design.width}×{design.height}mm<br/>
        Template: {design.template}<br/>
        Material: {design.material}
      </div>
    </div>
  );
});

