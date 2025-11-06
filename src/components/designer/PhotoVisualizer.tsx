"use client";
import { useState, useRef, useCallback, useEffect } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface PhotoVisualizerProps {
  design: DesignConfig;
}

export function PhotoVisualizer({ design }: PhotoVisualizerProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.8);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      const img = new Image();
      img.src = result;
      img.onload = () => {
        imageRef.current = img;
      };
    };
    reader.readAsDataURL(file);
  };

  const renderOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Draw background image
    const img = imageRef.current;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw window/door overlay
    ctx.save();
    
    // Calculate overlay dimensions
    const designWidth = design.width / 10; // Scale down from mm to pixels
    const designHeight = design.height / 10;
    const scaledWidth = designWidth * scale;
    const scaledHeight = designHeight * scale;

    // Position
    const x = (canvas.width * position.x) / 100 - scaledWidth / 2;
    const y = (canvas.height * position.y) / 100 - scaledHeight / 2;

    // Rotate around center
    const centerX = x + scaledWidth / 2;
    const centerY = y + scaledHeight / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw frame
    ctx.fillStyle = design.color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(x, y, scaledWidth, scaledHeight);

    // Draw glass
    if (design.glass) {
      ctx.fillStyle = 'rgba(200, 220, 255, 0.6)';
      const inset = 10;
      ctx.fillRect(x + inset, y + inset, scaledWidth - inset * 2, scaledHeight - inset * 2);
    }

    // Draw template-specific details
    if (design.template === 'double' || design.template === 'french') {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, y);
      ctx.lineTo(centerX, y + scaledHeight);
      ctx.stroke();
    }

    ctx.restore();
  }, [uploadedImage, design, position, scale, rotation, opacity]);

  // Re-render when design or controls change
  useEffect(() => {
    renderOverlay();
  }, [design, position, scale, rotation, opacity, uploadedImage, renderOverlay]);

  if (!uploadedImage) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa',
        cursor: 'pointer',
        position: 'relative'
      }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
          Upload House Photo
        </div>
        <div style={{ fontSize: '12px', color: '#999' }}>
          Click or drag image here to visualize your design
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#000',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      
      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minWidth: '300px'
      }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
          Adjust Overlay:
        </div>
        
        {/* Position */}
        <div>
          <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>
            Position: X {position.x}% Y {position.y}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={position.x}
            onChange={(e) => setPosition({ ...position, x: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={position.y}
            onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* Scale */}
        <div>
          <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>
            Scale: {(scale * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Rotation */}
        <div>
          <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>
            Rotation: {rotation}°
          </label>
          <input
            type="range"
            min="-45"
            max="45"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* Opacity */}
        <div>
          <label style={{ fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px' }}>
            Opacity: {(opacity * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          onClick={() => setUploadedImage(null)}
          style={{
            padding: '8px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            marginTop: '8px'
          }}
        >
          Remove Photo
        </button>
      </div>
    </div>
  );
}

