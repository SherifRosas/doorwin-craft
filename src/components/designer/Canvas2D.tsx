"use client";
import { useEffect, useRef, useState } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

export function Canvas2D({ design }: { design: DesignConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const baseScale = Math.min(canvas.width / (design.width + 100), canvas.height / (design.height + 100));
      const scale = baseScale * zoom;
      const offsetX = (canvas.width - design.width * scale) / 2 + pan.x;
      const offsetY = (canvas.height - design.height * scale) / 2 + pan.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      const gridSize = 50 * scale;
      const startX = Math.floor(-pan.x / gridSize) * gridSize;
      const startY = Math.floor(-pan.y / gridSize) * gridSize;
      for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Frame
      ctx.fillStyle = design.color;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2 * scale;
      ctx.fillRect(offsetX, offsetY, design.width * scale, design.height * scale);
      ctx.strokeRect(offsetX, offsetY, design.width * scale, design.height * scale);

      // Render based on template type
      if (design.template === 'double') {
        // Double window: two panels with mullion
        const sashInset = 20 * scale;
        const panelWidth = (design.width - 40 - 10) / 2 * scale;
        const mullionX = offsetX + (design.width * scale) / 2;
        
        if (design.glass) {
          // Left panel
          ctx.fillStyle = '#e8f4f8';
          ctx.strokeStyle = '#666';
          ctx.fillRect(offsetX + sashInset, offsetY + sashInset, panelWidth, (design.height - 40) * scale);
          ctx.strokeRect(offsetX + sashInset, offsetY + sashInset, panelWidth, (design.height - 40) * scale);
          
          // Right panel
          ctx.fillRect(mullionX + 5, offsetY + sashInset, panelWidth, (design.height - 40) * scale);
          ctx.strokeRect(mullionX + 5, offsetY + sashInset, panelWidth, (design.height - 40) * scale);
        }
        
        // Mullion (vertical divider)
        ctx.fillStyle = design.color;
        ctx.strokeStyle = '#333';
        ctx.fillRect(mullionX - 2, offsetY + sashInset, 4, (design.height - 40) * scale);
        ctx.strokeRect(mullionX - 2, offsetY + sashInset, 4, (design.height - 40) * scale);
        
      } else if (design.template === 'sliding') {
        // Sliding window: shows sliding panel indication
        const sashInset = 20 * scale;
        if (design.glass) {
          ctx.fillStyle = '#e8f4f8';
          ctx.strokeStyle = '#666';
          ctx.fillRect(
            offsetX + sashInset,
            offsetY + sashInset,
            (design.width - 40) * scale,
            (design.height - 40) * scale
          );
          ctx.strokeRect(
            offsetX + sashInset,
            offsetY + sashInset,
            (design.width - 40) * scale,
            (design.height - 40) * scale
          );
          
          // Show sliding track
          ctx.strokeStyle = '#999';
          ctx.lineWidth = 2 * scale;
          ctx.beginPath();
          ctx.moveTo(offsetX + sashInset, offsetY + (design.height - 20) * scale);
          ctx.lineTo(offsetX + (design.width - sashInset) * scale, offsetY + (design.height - 20) * scale);
          ctx.stroke();
        }
      } else if (design.template === 'single') {
        // Single window: one opening
        const sashInset = 20 * scale;
        if (design.glass) {
          ctx.fillStyle = '#e8f4f8';
          ctx.strokeStyle = '#666';
          ctx.fillRect(
            offsetX + sashInset,
            offsetY + sashInset,
            (design.width - 40) * scale,
            (design.height - 40) * scale
          );
          ctx.strokeRect(
            offsetX + sashInset,
            offsetY + sashInset,
            (design.width - 40) * scale,
            (design.height - 40) * scale
          );
        }
      } else if (design.template === 'fixed') {
        // Fixed window: no opening (just frame)
        // Already rendered above as just the frame
      }

      // Dimensions
      ctx.fillStyle = '#000';
      ctx.font = `${Math.max(12 * scale, 10)}px Arial`;
      ctx.fillText(`${design.width}mm`, offsetX, offsetY - 5);
      ctx.save();
      ctx.translate(offsetX - 25, offsetY + design.height * scale / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${design.height}mm`, 0, 0);
      ctx.restore();
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [design, zoom, pan, isDragging, dragStart]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: isDragging ? 'grabbing' : 'grab' }}
      />
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
        Zoom: {Math.round(zoom * 100)}% | <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ fontSize: '11px', padding: '2px 6px' }}>Reset</button>
      </div>
    </div>
  );
}

