"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface DragHandle {
  id: 'width' | 'height' | 'corner';
  x: number;
  y: number;
  active: boolean;
}

interface CanvasActions {
  center?: () => void;
  fit?: () => void;
}

export function InteractiveCanvas2D({ 
  design, 
  onDesignChange,
  onActionsReady
}: { 
  design: DesignConfig; 
  onDesignChange: (updates: Partial<DesignConfig>) => void;
  onActionsReady?: (actions: CanvasActions) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<DragHandle | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  const getScale = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 1;
    const baseScale = Math.min(canvas.width / (design.width + 200), canvas.height / (design.height + 200));
    return baseScale * zoom;
  }, [design.width, design.height, zoom]);

  const getDesignBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, w: 0, h: 0 };
    const scale = getScale();
    const x = (canvas.width - design.width * scale) / 2 + pan.x;
    const y = (canvas.height - design.height * scale) / 2 + pan.y;
    return { x, y, w: design.width * scale, h: design.height * scale };
  }, [design.width, design.height, pan, getScale]);

  const getDragHandles = useCallback((): DragHandle[] => {
    const bounds = getDesignBounds();
    return [
      { id: 'width', x: bounds.x + bounds.w, y: bounds.y + bounds.h / 2, active: activeHandle?.id === 'width' },
      { id: 'height', x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h, active: activeHandle?.id === 'height' },
      { id: 'corner', x: bounds.x + bounds.w, y: bounds.y + bounds.h, active: activeHandle?.id === 'corner' },
    ];
  }, [getDesignBounds, activeHandle]);

  const snapToGrid = useCallback((value: number, gridSize: number = 50) => {
    return Math.round(value / gridSize) * gridSize;
  }, []);

  const findHandleAtPoint = useCallback((x: number, y: number, handles: DragHandle[]): DragHandle | null => {
    const handleSize = 12;
    for (const handle of handles) {
      const dx = x - handle.x;
      const dy = y - handle.y;
      if (Math.sqrt(dx * dx + dy * dy) < handleSize) {
        return handle;
      }
    }
    return null;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = getScale();
    const bounds = getDesignBounds();
    const handles = getDragHandles();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    if (showGrid) {
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
    }

    // Snap guides
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const snapDistance = 10;
    handles.forEach(handle => {
      if (handle.active) {
        ctx.beginPath();
        ctx.moveTo(handle.x - snapDistance, 0);
        ctx.lineTo(handle.x - snapDistance, canvas.height);
        ctx.moveTo(0, handle.y - snapDistance);
        ctx.lineTo(canvas.width, handle.y - snapDistance);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // Frame with shadow
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = design.color;
    ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    ctx.shadowColor = 'transparent';
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);

    // Render template-based opening
    if (design.template === 'double') {
      const sashInset = 20 * scale;
      const panelWidth = (bounds.w - sashInset * 2 - 10) / 2;
      const mullionX = bounds.x + bounds.w / 2;
      
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.fillRect(mullionX + 5, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(mullionX + 5, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
      }
      
      ctx.fillStyle = design.color;
      ctx.fillRect(mullionX - 2, bounds.y + sashInset, 4, bounds.h - sashInset * 2);
      ctx.strokeRect(mullionX - 2, bounds.y + sashInset, 4, bounds.h - sashInset * 2);
    } else if (design.template === 'sliding') {
      const sashInset = 20 * scale;
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 3 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset, bounds.y + bounds.h - 20 * scale);
        ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + bounds.h - 20 * scale);
        ctx.stroke();
      }
    } else if (design.template === 'single' && design.glass) {
      const sashInset = 20 * scale;
      ctx.fillStyle = '#e8f4f8';
      ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2 * scale;
      ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
    }

    // Dimensions
    if (showDimensions) {
      ctx.fillStyle = '#000';
      ctx.font = `${Math.max(12 * scale, 10)}px Arial`;
      ctx.fillText(`${design.width}mm`, bounds.x, bounds.y - 5);
      ctx.save();
      ctx.translate(bounds.x - 25, bounds.y + bounds.h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${design.height}mm`, 0, 0);
      ctx.restore();
    }

    // Drag handles
    handles.forEach(handle => {
      ctx.fillStyle = handle.active ? '#ff6b35' : '#2196f3';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Center point indicator
    ctx.fillStyle = '#666';
    ctx.beginPath();
    ctx.arc(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2, 3, 0, Math.PI * 2);
    ctx.fill();

  }, [design, zoom, pan, getScale, getDesignBounds, getDragHandles, activeHandle, showGrid, showDimensions]);

  const centerView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const fitToView = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const baseScale = Math.min(canvas.width / (design.width + 200), canvas.height / (design.height + 200));
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // Optional: auto-zoom to fit
    // setZoom(baseScale);
  }, [design.width, design.height]);

  useEffect(() => {
    if (onActionsReady) {
      onActionsReady({
        center: centerView,
        fit: fitToView,
      });
    }
  }, [onActionsReady, centerView, fitToView]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const handles = getDragHandles();
      const handle = findHandleAtPoint(x, y, handles);
      
      if (handle) {
        setActiveHandle(handle);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      } else {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeHandle) {
        if (isDragging && !activeHandle) {
          setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const scale = getScale();
      const bounds = getDesignBounds();
      
      if (activeHandle.id === 'width') {
        const newX = e.clientX - rect.left;
        const newWidth = ((newX - bounds.x) / scale);
        const snapped = snapToGrid(newWidth);
        if (snapped >= 300 && snapped <= 3000) {
          onDesignChange({ width: snapped });
        }
      } else if (activeHandle.id === 'height') {
        const newY = e.clientY - rect.top;
        const newHeight = ((newY - bounds.y) / scale);
        const snapped = snapToGrid(newHeight);
        if (snapped >= 300 && snapped <= 3000) {
          onDesignChange({ height: snapped });
        }
      } else if (activeHandle.id === 'corner') {
        const newX = e.clientX - rect.left;
        const newY = e.clientY - rect.top;
        const newWidth = ((newX - bounds.x) / scale);
        const newHeight = ((newY - bounds.y) / scale);
        const snappedW = snapToGrid(newWidth);
        const snappedH = snapToGrid(newHeight);
        if (snappedW >= 300 && snappedW <= 3000 && snappedH >= 300 && snappedH <= 3000) {
          onDesignChange({ width: snappedW, height: snappedH });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
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
  }, [isDragging, activeHandle, dragStart, pan, getScale, getDesignBounds, getDragHandles, findHandleAtPoint, snapToGrid, onDesignChange, draw]);

  useEffect(() => {
    draw();
  }, [draw, design, zoom, pan]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: activeHandle ? 'ew-resize' : isDragging ? 'grabbing' : 'grab' }}
      />
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '4px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div>Zoom: {Math.round(zoom * 100)}%</div>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ fontSize: '11px', padding: '2px 6px', marginTop: '4px' }}>Reset View</button>
        <label style={{ fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} style={{ marginRight: '4px' }} />
          Grid
        </label>
        <label style={{ fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={showDimensions} onChange={(e) => setShowDimensions(e.target.checked)} style={{ marginRight: '4px' }} />
          Dimensions
        </label>
      </div>
    </div>
  );
}

