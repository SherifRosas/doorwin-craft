"use client";
import { useMemo, memo } from 'react';
import * as THREE from 'three';
import type { DesignConfig } from '@/src/app/draw/page';

const scale = 0.01; // Convert mm to Three.js units

export const DesignFrame = memo(function DesignFrame({ design }: { design: DesignConfig }) {
  const material = useMemo(() => {
    const color = new THREE.Color(design.color);
    // Material properties based on material type
    const props = {
      aluminum: { roughness: 0.3, metalness: 0.8 },
      wood: { roughness: 0.7, metalness: 0.1 },
      upvc: { roughness: 0.4, metalness: 0.2 }
    }[design.material] || { roughness: 0.5, metalness: 0.5 };
    
    return new THREE.MeshStandardMaterial({ 
      color,
      ...props,
      envMapIntensity: 1.0
    });
  }, [design.color, design.material]);

  const glassMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ 
      color: 0x88ccff, 
      transparent: true, 
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.9
    }),
    []
  );

  const w = design.width * scale;
  const h = design.height * scale;
  const d = design.frameDepth * scale;

  const renderGlass = () => {
    if (!design.glass) return null;

    const glassW = (w - d * 2) * 0.9;
    const glassH = (h - d * 2) * 0.9;
    const glassThickness = 5 * scale;

    // Templates with multiple panels
    if (design.template === 'double' || design.template === 'french') {
      return (
        <>
          <mesh position={[-w * 0.25, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.45, glassH, glassThickness]} />
          </mesh>
          <mesh position={[w * 0.25, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.45, glassH, glassThickness]} />
          </mesh>
        </>
      );
    }

    // Bay window (3 panels)
    if (design.template === 'bay') {
      return (
        <>
          <mesh position={[-w * 0.33, 0, w * 0.15]} material={glassMaterial} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[glassW * 0.3, glassH, glassThickness]} />
          </mesh>
          <mesh position={[0, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.35, glassH, glassThickness]} />
          </mesh>
          <mesh position={[w * 0.33, 0, w * 0.15]} material={glassMaterial} rotation={[0, -0.35, 0]}>
            <boxGeometry args={[glassW * 0.3, glassH, glassThickness]} />
          </mesh>
        </>
      );
    }

    // Bow window (5 panels - simplified as 3 curved)
    if (design.template === 'bow') {
      return (
        <>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((pos, i) => (
            <mesh 
              key={i}
              position={[pos * w, 0, Math.abs(pos) * w * 0.2]} 
              material={glassMaterial}
              rotation={[0, pos * 0.3, 0]}
            >
              <boxGeometry args={[glassW * 0.18, glassH, glassThickness]} />
            </mesh>
          ))}
        </>
      );
    }

    // Arch window - create rounded top effect
    if (design.template === 'arch') {
      return (
        <>
          <mesh position={[0, h * 0.2, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW, glassH * 0.7, glassThickness]} />
          </mesh>
          {/* Simplified arch top */}
          <mesh position={[0, h * 0.45, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.8, glassH * 0.2, glassThickness]} />
          </mesh>
        </>
      );
    }

    // Jalousie - horizontal slats
    if (design.template === 'jalousie') {
      const slatCount = 8;
      const slatHeight = glassH / slatCount;
      return (
        <>
          {Array.from({ length: slatCount }).map((_, i) => (
            <mesh
              key={i}
              position={[0, (i - slatCount / 2) * slatHeight, -d * 0.3]}
              material={glassMaterial}
            >
              <boxGeometry args={[glassW, slatHeight * 0.8, glassThickness]} />
            </mesh>
          ))}
        </>
      );
    }

    // Entry door - door with side panels
    if (design.template === 'entry') {
      return (
        <>
          <mesh position={[-w * 0.35, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.25, glassH, glassThickness]} />
          </mesh>
          <mesh position={[0, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.45, glassH, glassThickness]} />
          </mesh>
          <mesh position={[w * 0.35, 0, -d * 0.3]} material={glassMaterial}>
            <boxGeometry args={[glassW * 0.25, glassH, glassThickness]} />
          </mesh>
        </>
      );
    }

    // Default single glass panel
    return (
      <mesh position={[0, 0, -d * 0.3]} material={glassMaterial}>
        <boxGeometry args={[glassW, glassH, glassThickness]} />
      </mesh>
    );
  };

  // Make sure we have valid dimensions
  if (w <= 0 || h <= 0 || d <= 0) {
    return (
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }

  // Ensure minimum frame depth for visibility
  const visibleDepth = Math.max(d, 2 * scale); // At least 2mm visible

  // Create edge material for better visibility
  const edgeMaterial = useMemo(() => {
    const color = new THREE.Color(design.color);
    return new THREE.MeshStandardMaterial({
      color: color.multiplyScalar(0.7), // Darker for edges
      roughness: 0.5,
      metalness: 0.3
    });
  }, [design.color]);

  return (
    <group position={[0, 0, 0]}>
      {/* Frame - outer box - centered at origin */}
      <mesh position={[0, 0, 0]} material={material}>
        <boxGeometry args={[w, h, visibleDepth]} />
      </mesh>
      
      {/* Frame edges for better definition */}
      <mesh position={[-w/2, 0, 0]} material={edgeMaterial}>
        <boxGeometry args={[visibleDepth * 0.2, h, visibleDepth]} />
      </mesh>
      <mesh position={[w/2, 0, 0]} material={edgeMaterial}>
        <boxGeometry args={[visibleDepth * 0.2, h, visibleDepth]} />
      </mesh>
      <mesh position={[0, h/2, 0]} material={edgeMaterial}>
        <boxGeometry args={[w, visibleDepth * 0.2, visibleDepth]} />
      </mesh>
      <mesh position={[0, -h/2, 0]} material={edgeMaterial}>
        <boxGeometry args={[w, visibleDepth * 0.2, visibleDepth]} />
      </mesh>

      {/* Glass panels */}
      {renderGlass()}

      {/* Mullion for double/french doors */}
      {(design.template === 'double' || design.template === 'french') && (
        <mesh position={[0, 0, 0]} material={material}>
          <boxGeometry args={[d * 0.5, h * 0.95, d * 0.8]} />
        </mesh>
      )}

      {/* Sliding track for sliding windows/doors */}
      {(design.template === 'sliding' || design.template === 'patio') && (
        <mesh
          position={[0, -h * 0.45, -d * 0.2]}
          material={new THREE.MeshStandardMaterial({ color: 0x888888 })}
        >
          <boxGeometry args={[w * 0.9, 2 * scale, 3 * scale]} />
        </mesh>
      )}

      {/* Pivot door - center pivot point */}
      {design.template === 'pivot' && (
        <mesh
          position={[0, 0, d * 0.6]}
          material={new THREE.MeshStandardMaterial({ color: 0x444444 })}
        >
          <cylinderGeometry args={[d * 0.1, d * 0.1, d * 1.2, 8]} />
        </mesh>
      )}

      {/* Bifold track */}
      {design.template === 'bifold' && (
        <mesh
          position={[0, -h * 0.45, -d * 0.2]}
          material={new THREE.MeshStandardMaterial({ color: 0x666666 })}
        >
          <boxGeometry args={[w * 0.95, 2 * scale, 4 * scale]} />
        </mesh>
      )}
    </group>
  );
});

