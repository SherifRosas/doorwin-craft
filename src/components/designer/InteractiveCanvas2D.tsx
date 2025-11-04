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
  exportAsImage?: () => string | null; // Export canvas as data URL
  panBy?: (dx: number, dy: number) => void;
  setGrid?: (show: boolean) => void;
}

export function InteractiveCanvas2D({ 
  design, 
  onDesignChange,
  onActionsReady,
  showGrid: externalShowGrid,
  onGridChange
}: { 
  design: DesignConfig; 
  onDesignChange: (updates: Partial<DesignConfig>) => void;
  onActionsReady?: (actions: CanvasActions) => void;
  showGrid?: boolean;
  onGridChange?: (show: boolean) => void;
}) {
  // Animation state for all templates
  const slidePositionRef = useRef<number>(0); // For sliding/patio
  const slideDirectionRef = useRef<number>(1); // 1 for right, -1 for left
  const casementAngleRef = useRef<number>(0); // For casement/single opening angle
  const casementDirectionRef = useRef<number>(1); // Opening/closing direction
  const awningAngleRef = useRef<number>(0); // For awning window (opens upward)
  const hopperAngleRef = useRef<number>(0); // For hopper window (opens downward)
  const tiltAngleRef = useRef<number>(0); // For tilt & turn window
  const jalousieRotationRef = useRef<number>(0); // For jalousie slats rotation
  const bifoldAngleRef = useRef<number>(0); // For bifold door folding
  const pivotAngleRef = useRef<number>(0); // For pivot door rotation
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.5); // Default zoom 50%
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<DragHandle | null>(null);
  const [showGrid, setShowGrid] = useState(externalShowGrid !== undefined ? externalShowGrid : true);
  const [showDimensions, setShowDimensions] = useState(true);
  
  // Sync external grid state
  useEffect(() => {
    if (externalShowGrid !== undefined) {
      setShowGrid(externalShowGrid);
    }
  }, [externalShowGrid]);

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
    // Larger handles on mobile for better touch interaction
    const isMobile = window.innerWidth < 768;
    const handleSize = isMobile ? 24 : 12;
    for (const handle of handles) {
      const dx = x - handle.x;
      const dy = y - handle.y;
      if (Math.sqrt(dx * dx + dy * dy) < handleSize) {
        return handle;
      }
    }
    return null;
  }, []);

  // Helper function for realistic glass rendering
  const drawRealisticGlass = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, scale: number, isFront: boolean = false) => {
    // Glass base color (slightly different for front/back panels)
    ctx.fillStyle = isFront ? '#d0e8f5' : '#c8e0f0';
    ctx.fillRect(x, y, w, h);
    
    // Realistic glass reflection gradient
    const glassGradient = ctx.createLinearGradient(x, y, x + w * 0.35, y + h * 0.35);
    const reflectionIntensity = isFront ? 0.7 : 0.6;
    glassGradient.addColorStop(0, `rgba(255, 255, 255, ${reflectionIntensity})`);
    glassGradient.addColorStop(0.5, 'rgba(200, 230, 255, 0.3)');
    glassGradient.addColorStop(1, 'rgba(150, 200, 255, 0.1)');
    ctx.fillStyle = glassGradient;
    ctx.fillRect(x, y, w, h);
    
    // Glass border (sash frame) - thicker for front panel
    ctx.strokeStyle = isFront ? '#5a6578' : '#4a5568';
    ctx.lineWidth = isFront ? 3.5 * scale : 3 * scale;
    ctx.strokeRect(x, y, w, h);
    
    // Inner glass highlight (simulates light reflection)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = isFront ? 1.5 * scale : 1 * scale;
    ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    
    // Subtle internal reflection lines (simulates window reflection)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.3, y);
    ctx.lineTo(x + w * 0.3, y + h);
    ctx.stroke();
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

    // Realistic Frame Rendering with Depth and Material
    const frameDepth = design.frameDepth * scale;
    const frameThickness = Math.max(15 * scale, frameDepth * 0.15);
    
    // Outer frame shadow (cast by window)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8 * scale;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4 * scale;
    
    // Draw outer frame with realistic depth
    ctx.fillStyle = design.color;
    ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    
    // Frame highlight (top edge lighting)
    const highlightGradient = ctx.createLinearGradient(bounds.x, bounds.y, bounds.x, bounds.y + frameThickness);
    const baseColor = design.color;
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGradient;
    ctx.fillRect(bounds.x, bounds.y, bounds.w, frameThickness);
    
    // Frame shadow (bottom edge)
    const shadowGradient = ctx.createLinearGradient(bounds.x, bounds.y + bounds.h - frameThickness, bounds.x, bounds.y + bounds.h);
    shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = shadowGradient;
    ctx.fillRect(bounds.x, bounds.y + bounds.h - frameThickness, bounds.w, frameThickness);
    
    // Material-based texture
    if (design.material === 'wood') {
      // Wood grain effect
      ctx.strokeStyle = 'rgba(139, 90, 43, 0.3)';
      ctx.lineWidth = 1 * scale;
      for (let i = 0; i < bounds.h; i += 8 * scale) {
        ctx.beginPath();
        ctx.moveTo(bounds.x + Math.sin(i * 0.1) * 2, bounds.y + i);
        ctx.lineTo(bounds.x + bounds.w + Math.sin(i * 0.1) * 2, bounds.y + i);
        ctx.stroke();
      }
    } else if (design.material === 'aluminum') {
      // Brushed aluminum effect
      const aluminumGradient = ctx.createLinearGradient(bounds.x, bounds.y, bounds.x + bounds.w, bounds.y);
      aluminumGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      aluminumGradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.1)');
      aluminumGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
      ctx.fillStyle = aluminumGradient;
      ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    }
    
    ctx.shadowColor = 'transparent';
    
    // Outer frame border with depth
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
    
    // Inner frame border (creates depth)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1 * scale;
    ctx.strokeRect(bounds.x + 1, bounds.y + 1, bounds.w - 2, bounds.h - 2);

    // Inner frame styling based on profileType (ovolo/chamfer/round/square)
    const profileType = (design as any).profileType || 'square';
    const innerInset = 8 * scale;
    const ix = bounds.x + innerInset;
    const iy = bounds.y + innerInset;
    const iw = bounds.w - innerInset * 2;
    const ih = bounds.h - innerInset * 2;

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, Math.min(w, h) / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.lineTo(x + w - rr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr);
      ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    const drawChamferRect = (x: number, y: number, w: number, h: number, c: number) => {
      const cc = Math.min(c, Math.min(w, h) / 3);
      ctx.beginPath();
      ctx.moveTo(x + cc, y);
      ctx.lineTo(x + w - cc, y);
      ctx.lineTo(x + w, y + cc);
      ctx.lineTo(x + w, y + h - cc);
      ctx.lineTo(x + w - cc, y + h);
      ctx.lineTo(x + cc, y + h);
      ctx.lineTo(x, y + h - cc);
      ctx.lineTo(x, y + cc);
      ctx.closePath();
    };

    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2 * scale;
    if (profileType === 'round') {
      drawRoundedRect(ix, iy, iw, ih, 16 * scale);
      ctx.stroke();
    } else if (profileType === 'ovolo') {
      drawRoundedRect(ix, iy, iw, ih, 8 * scale);
      ctx.stroke();
    } else if (profileType === 'chamfer') {
      drawChamferRect(ix, iy, iw, ih, 10 * scale);
      ctx.stroke();
    } else {
      // square (default)
      ctx.strokeRect(ix, iy, iw, ih);
    }

    // Render template-based opening with animations
    if (design.template === 'double') {
      const sashInset = 20 * scale;
      const panelWidth = (bounds.w - sashInset * 2 - 10) / 2;
      const mullionX = bounds.x + bounds.w / 2;
      const openAngle = casementAngleRef.current * Math.PI / 180; // Convert to radians
      const openDistance = Math.sin(openAngle) * panelWidth * 0.3; // Max 30% of panel width
      
      if (design.glass) {
        // Left panel - opens to the left with realistic glass
        const leftPanelX = bounds.x + sashInset - openDistance;
        const leftPanelY = bounds.y + sashInset;
        const leftPanelW = panelWidth;
        const leftPanelH = bounds.h - sashInset * 2;
        
        // Glass panel with depth inset
        ctx.fillStyle = '#d0e8f5';
        ctx.fillRect(leftPanelX, leftPanelY, leftPanelW, leftPanelH);
        
        // Glass reflection gradient
        const glassGradient = ctx.createLinearGradient(leftPanelX, leftPanelY, leftPanelX + leftPanelW * 0.3, leftPanelY + leftPanelH * 0.3);
        glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        glassGradient.addColorStop(0.5, 'rgba(200, 230, 255, 0.3)');
        glassGradient.addColorStop(1, 'rgba(150, 200, 255, 0.1)');
        ctx.fillStyle = glassGradient;
        ctx.fillRect(leftPanelX, leftPanelY, leftPanelW, leftPanelH);
        
        // Glass border (sash frame)
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 3 * scale;
        ctx.strokeRect(leftPanelX, leftPanelY, leftPanelW, leftPanelH);
        
        // Inner glass border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(leftPanelX + 2, leftPanelY + 2, leftPanelW - 4, leftPanelH - 4);
        
        // Right panel - opens to the right with realistic glass
        const rightPanelX = mullionX + 5 + openDistance;
        const rightPanelY = bounds.y + sashInset;
        const rightPanelW = panelWidth;
        const rightPanelH = bounds.h - sashInset * 2;
        
        ctx.fillStyle = '#d0e8f5';
        ctx.fillRect(rightPanelX, rightPanelY, rightPanelW, rightPanelH);
        
        // Glass reflection
        const glassGradient2 = ctx.createLinearGradient(rightPanelX, rightPanelY, rightPanelX + rightPanelW * 0.3, rightPanelY + rightPanelH * 0.3);
        glassGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        glassGradient2.addColorStop(0.5, 'rgba(200, 230, 255, 0.3)');
        glassGradient2.addColorStop(1, 'rgba(150, 200, 255, 0.1)');
        ctx.fillStyle = glassGradient2;
        ctx.fillRect(rightPanelX, rightPanelY, rightPanelW, rightPanelH);
        
        // Glass border
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 3 * scale;
        ctx.strokeRect(rightPanelX, rightPanelY, rightPanelW, rightPanelH);
        
        // Inner glass border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(rightPanelX + 2, rightPanelY + 2, rightPanelW - 4, rightPanelH - 4);
      }
      
      // Mullion (vertical divider) with realistic depth
      const mullionWidth = 6 * scale;
      const mullionXPos = mullionX - mullionWidth / 2;
      const mullionY = bounds.y + sashInset;
      const mullionH = bounds.h - sashInset * 2;
      
      // Mullion shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 3 * scale;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 0;
      
      // Mullion body
      ctx.fillStyle = design.color;
      ctx.fillRect(mullionXPos, mullionY, mullionWidth, mullionH);
      
      // Mullion highlight
      const mullionHighlight = ctx.createLinearGradient(mullionXPos, mullionY, mullionXPos + mullionWidth, mullionY);
      mullionHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      mullionHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mullionHighlight;
      ctx.fillRect(mullionXPos, mullionY, mullionWidth, mullionH * 0.3);
      
      ctx.shadowColor = 'transparent';
      
      // Mullion border
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(mullionXPos, mullionY, mullionWidth, mullionH);
    } else if (design.template === 'sliding') {
      const sashInset = 20 * scale;
      const panelGap = 10 * scale;
      
      // Draw two sliding panels
      const panelWidth = (bounds.w - sashInset * 2 - panelGap) / 2;
      // Use animated slide position instead of static offset
      const maxSlideDistance = panelWidth * 0.4; // Maximum slide distance (40% of panel width)
      const animatedSlideOffset = slidePositionRef.current; // Animated position
      
      if (design.glass) {
        // Fixed panel (left/back) with realistic glass
        const fixedPanelX = bounds.x + sashInset;
        const fixedPanelY = bounds.y + sashInset;
        const fixedPanelW = panelWidth;
        const fixedPanelH = bounds.h - sashInset * 2;
        drawRealisticGlass(ctx, fixedPanelX, fixedPanelY, fixedPanelW, fixedPanelH, scale, false);
        
        // Sliding panel (right/front) - position changes with animation
        const slidingPanelX = bounds.x + sashInset + panelWidth + panelGap - animatedSlideOffset;
        const slidingPanelY = bounds.y + sashInset;
        const slidingPanelW = panelWidth;
        const slidingPanelH = bounds.h - sashInset * 2;
        drawRealisticGlass(ctx, slidingPanelX, slidingPanelY, slidingPanelW, slidingPanelH, scale, true);
        
        // Vertical divider between panels (moves with sliding panel)
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 3 * scale;
        const dividerX = bounds.x + sashInset + panelWidth + panelGap / 2 - animatedSlideOffset;
        ctx.beginPath();
        ctx.moveTo(dividerX, bounds.y + sashInset);
        ctx.lineTo(dividerX, bounds.y + bounds.h - sashInset);
        ctx.stroke();
        
        // Sliding track at bottom
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset, bounds.y + bounds.h - 20 * scale);
        ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + bounds.h - 20 * scale);
        ctx.stroke();
        
        // Track guides (small rectangles) - show movement indicator
        ctx.fillStyle = '#aaa';
        const trackWidth = 15 * scale;
        const trackHeight = 5 * scale;
        // Left guide
        ctx.fillRect(
          bounds.x + sashInset + 30 * scale,
          bounds.y + bounds.h - 22 * scale,
          trackWidth,
          trackHeight
        );
        // Right guide - position may shift slightly
        ctx.fillRect(
          bounds.x + bounds.w - sashInset - 30 * scale - trackWidth,
          bounds.y + bounds.h - 22 * scale,
          trackWidth,
          trackHeight
        );
        
        // Animated track indicator showing current position
        const trackIndicatorX = bounds.x + sashInset + panelWidth + panelGap - animatedSlideOffset;
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(
          trackIndicatorX - 3 * scale,
          bounds.y + bounds.h - 22 * scale,
          6 * scale,
          trackHeight + 2 * scale
        );
        
        // Sliding direction arrows (update position based on animation)
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2 * scale;
        ctx.fillStyle = '#4a90e2';
        const arrowY = bounds.y + bounds.h / 2;
        const arrowSize = 8 * scale;
        
        // Left arrow (shows panel can slide left)
        const leftArrowX = slidingPanelX - arrowSize * 2;
        ctx.beginPath();
        ctx.moveTo(leftArrowX, arrowY);
        ctx.lineTo(leftArrowX + arrowSize, arrowY - arrowSize);
        ctx.lineTo(leftArrowX + arrowSize, arrowY + arrowSize);
        ctx.closePath();
        ctx.fill();
        
        // Right arrow (shows panel can slide right)
        const rightArrowX = slidingPanelX + panelWidth + arrowSize * 2;
        ctx.beginPath();
        ctx.moveTo(rightArrowX, arrowY);
        ctx.lineTo(rightArrowX - arrowSize, arrowY - arrowSize);
        ctx.lineTo(rightArrowX - arrowSize, arrowY + arrowSize);
        ctx.closePath();
        ctx.fill();
      }
    } else if (design.template === 'single' || design.template === 'casement') {
      // Single casement or casement window - swings open like a door
      const sashInset = 20 * scale;
      const panelWidth = bounds.w - sashInset * 2;
      const openAngle = casementAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * panelWidth * 0.25; // Max 25% opening
      
      if (design.glass) {
        // Main panel with opening animation - realistic glass
        const panelX = bounds.x + sashInset - openDistance;
        const panelY = bounds.y + sashInset;
        const panelW = panelWidth;
        const panelH = bounds.h - sashInset * 2;
        drawRealisticGlass(ctx, panelX, panelY, panelW, panelH, scale, false);
        
        // Hardware handle (if opening)
        if (openDistance > 0) {
          const handleX = panelX + panelW - 25 * scale;
          const handleY = panelY + panelH / 2;
          ctx.fillStyle = '#6b7280';
          ctx.beginPath();
          ctx.arc(handleX, handleY, 4 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#4a5568';
          ctx.lineWidth = 1 * scale;
          ctx.stroke();
        }
        
        // Hinge indicator on the left
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset, bounds.y + sashInset);
        ctx.lineTo(bounds.x + sashInset, bounds.y + bounds.h - sashInset);
        ctx.stroke();
      }
    } else if (design.template === 'tilt_turn') {
      // Tilt & Turn - can tilt inwards or turn
      const sashInset = 20 * scale;
      const tiltAngle = tiltAngleRef.current * Math.PI / 180;
      const tiltOffset = Math.sin(tiltAngle) * (bounds.h - sashInset * 2) * 0.15; // 15% tilt
      
      if (design.glass) {
        // Panel with tilt animation
        ctx.fillStyle = '#e8f4f8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        
        // Draw tilted panel
        ctx.save();
        ctx.translate(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
        ctx.rotate(tiltAngle * 0.3); // Slight rotation for tilt effect
        ctx.fillRect(-(bounds.w - sashInset * 2) / 2, -(bounds.h - sashInset * 2) / 2 + tiltOffset, 
                     bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeRect(-(bounds.w - sashInset * 2) / 2, -(bounds.h - sashInset * 2) / 2 + tiltOffset,
                       bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.restore();
      }
    } else if (design.template === 'awning') {
      // Awning window - opens upward (top-hinged)
      const sashInset = 20 * scale;
      const openAngle = awningAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * (bounds.h - sashInset * 2) * 0.3; // Opens upward
      
      if (design.glass) {
        // Bottom position (when closed)
        const baseY = bounds.y + bounds.h - sashInset;
        const panelY = baseY - (bounds.h - sashInset * 2) + openDistance;
        
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, panelY, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, panelY, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        
        // Top hinge indicator
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset, bounds.y + sashInset);
        ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + sashInset);
        ctx.stroke();
      }
    } else if (design.template === 'hopper') {
      // Hopper window - opens downward (bottom-hinged)
      const sashInset = 20 * scale;
      const openAngle = hopperAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * (bounds.h - sashInset * 2) * 0.3; // Opens downward
      
      if (design.glass) {
        // Top position (when closed)
        const baseY = bounds.y + sashInset;
        const panelY = baseY + openDistance;
        
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, panelY, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, panelY, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        
        // Bottom hinge indicator
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset, bounds.y + bounds.h - sashInset);
        ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + bounds.h - sashInset);
        ctx.stroke();
      }
    } else if (design.template === 'jalousie') {
      // Jalousie - horizontal slats that rotate
      const sashInset = 20 * scale;
      const slatCount = 8;
      const slatHeight = (bounds.h - sashInset * 2) / slatCount;
      const rotation = jalousieRotationRef.current * Math.PI / 180;
      
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1 * scale;
        
        for (let i = 0; i < slatCount; i++) {
          const slatY = bounds.y + sashInset + i * slatHeight;
          
          // Draw rotated slat
          ctx.save();
          ctx.translate(bounds.x + bounds.w / 2, slatY + slatHeight / 2);
          ctx.rotate(rotation * (i % 2 === 0 ? 1 : -1)); // Alternate rotation direction
          ctx.fillRect(-(bounds.w - sashInset * 2) / 2, -slatHeight * 0.4, 
                       bounds.w - sashInset * 2, slatHeight * 0.8);
          ctx.strokeRect(-(bounds.w - sashInset * 2) / 2, -slatHeight * 0.4,
                         bounds.w - sashInset * 2, slatHeight * 0.8);
          ctx.restore();
        }
      }
    } else if (design.template === 'bay' || design.template === 'bow') {
      // Bay/Bow windows - subtle projection animation
      const sashInset = 20 * scale;
      const projection = Math.sin(casementAngleRef.current * Math.PI / 180) * 10 * scale; // Subtle movement
      
      if (design.glass) {
        // Center panel
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        
        // Side panels (for bay window effect)
        if (design.template === 'bay') {
          const sidePanelWidth = (bounds.w - sashInset * 2) * 0.25;
          // Left side
          ctx.fillRect(bounds.x + sashInset - projection, bounds.y + sashInset, sidePanelWidth, bounds.h - sashInset * 2);
          ctx.strokeRect(bounds.x + sashInset - projection, bounds.y + sashInset, sidePanelWidth, bounds.h - sashInset * 2);
          // Right side
          ctx.fillRect(bounds.x + bounds.w - sashInset - sidePanelWidth + projection, bounds.y + sashInset, 
                       sidePanelWidth, bounds.h - sashInset * 2);
          ctx.strokeRect(bounds.x + bounds.w - sashInset - sidePanelWidth + projection, bounds.y + sashInset,
                         sidePanelWidth, bounds.h - sashInset * 2);
        }
      }
    } else if (design.template === 'bifold') {
      // Bifold door - panels fold in accordion style
      const sashInset = 20 * scale;
      const panelCount = 4; // 4 panels for bifold
      const panelWidth = (bounds.w - sashInset * 2) / panelCount;
      const foldAngle = bifoldAngleRef.current * Math.PI / 180;
      const foldDistance = Math.sin(foldAngle) * panelWidth * 0.5;
      
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        
        for (let i = 0; i < panelCount; i++) {
          const panelX = bounds.x + sashInset + i * panelWidth - (i > 0 ? foldDistance * i * 0.5 : 0);
          const panelY = bounds.y + sashInset;
          ctx.fillRect(panelX, panelY, panelWidth, bounds.h - sashInset * 2);
          ctx.strokeRect(panelX, panelY, panelWidth, bounds.h - sashInset * 2);
          
          // Draw fold line
          if (i < panelCount - 1) {
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(panelX + panelWidth, panelY);
            ctx.lineTo(panelX + panelWidth, panelY + bounds.h - sashInset * 2);
            ctx.stroke();
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2 * scale;
          }
        }
      }
    } else if (design.template === 'pivot') {
      // Pivot door - rotates around center pivot point
      const sashInset = 20 * scale;
      const panelWidth = bounds.w - sashInset * 2;
      const pivotAngle = pivotAngleRef.current * Math.PI / 180;
      
      if (design.glass) {
        ctx.save();
        // Pivot at center of door
        ctx.translate(bounds.x + bounds.w / 2, bounds.y + bounds.h / 2);
        ctx.rotate(pivotAngle);
        
        ctx.fillStyle = '#e8f4f8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.fillRect(-panelWidth / 2, -(bounds.h - sashInset * 2) / 2, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(-panelWidth / 2, -(bounds.h - sashInset * 2) / 2, panelWidth, bounds.h - sashInset * 2);
        
        // Pivot point indicator
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    } else if (design.template === 'french') {
      // French doors - double doors with glass panes (similar to double but styled differently)
      const sashInset = 20 * scale;
      const panelWidth = (bounds.w - sashInset * 2 - 10) / 2;
      const mullionX = bounds.x + bounds.w / 2;
      const openAngle = casementAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * panelWidth * 0.35; // Max 35% opening for doors
      
      if (design.glass) {
        // Left door - opens to the left
        const leftPanelX = bounds.x + sashInset - openDistance;
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(leftPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(leftPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        
        // Glass pane grid pattern for French doors
        const paneRows = 2;
        const paneCols = 1;
        const paneWidth = panelWidth / (paneCols + 1);
        const paneHeight = (bounds.h - sashInset * 2) / (paneRows + 1);
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1 * scale;
        for (let r = 1; r <= paneRows; r++) {
          ctx.beginPath();
          ctx.moveTo(leftPanelX, bounds.y + sashInset + r * paneHeight);
          ctx.lineTo(leftPanelX + panelWidth, bounds.y + sashInset + r * paneHeight);
          ctx.stroke();
        }
        
        // Right door - opens to the right
        const rightPanelX = mullionX + 5 + openDistance;
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(rightPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(rightPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        
        // Glass pane grid for right door
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1 * scale;
        for (let r = 1; r <= paneRows; r++) {
          ctx.beginPath();
          ctx.moveTo(rightPanelX, bounds.y + sashInset + r * paneHeight);
          ctx.lineTo(rightPanelX + panelWidth, bounds.y + sashInset + r * paneHeight);
          ctx.stroke();
        }
      }
      
      // Mullion (vertical divider)
      ctx.fillStyle = design.color;
      ctx.fillRect(mullionX - 2, bounds.y + sashInset, 4, bounds.h - sashInset * 2);
      ctx.strokeRect(mullionX - 2, bounds.y + sashInset, 4, bounds.h - sashInset * 2);
    } else if (design.template === 'entry') {
      // Entry door - door with side panels (transom and sidelights)
      const sashInset = 20 * scale;
      const doorWidth = (bounds.w - sashInset * 2) * 0.5; // Door takes 50% width
      const sidePanelWidth = (bounds.w - sashInset * 2 - doorWidth) / 2;
      const openAngle = casementAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * doorWidth * 0.3; // Max 30% opening
      
      if (design.glass) {
        // Left side panel (sidelight)
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, sidePanelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, sidePanelWidth, bounds.h - sashInset * 2);
        
        // Main door - swings open
        const doorX = bounds.x + sashInset + sidePanelWidth - openDistance;
        ctx.fillRect(doorX, bounds.y + sashInset, doorWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(doorX, bounds.y + sashInset, doorWidth, bounds.h - sashInset * 2);
        
        // Right side panel (sidelight)
        ctx.fillRect(bounds.x + sashInset + sidePanelWidth + doorWidth, bounds.y + sashInset, 
                     sidePanelWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(bounds.x + sashInset + sidePanelWidth + doorWidth, bounds.y + sashInset,
                       sidePanelWidth, bounds.h - sashInset * 2);
        
        // Hinge indicator on the left of door
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(bounds.x + sashInset + sidePanelWidth, bounds.y + sashInset);
        ctx.lineTo(bounds.x + sashInset + sidePanelWidth, bounds.y + bounds.h - sashInset);
        ctx.stroke();
      }
    } else if (design.template === 'triple') {
      // Triple casement - three panels
      const sashInset = 20 * scale;
      const panelWidth = (bounds.w - sashInset * 2 - 20) / 3;
      const mullion1X = bounds.x + sashInset + panelWidth + 10;
      const mullion2X = bounds.x + sashInset + panelWidth * 2 + 10;
      const openAngle = casementAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * panelWidth * 0.25;
      
      if (design.glass) {
        // Left panel
        const leftPanelX = bounds.x + sashInset - openDistance;
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(leftPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(leftPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        
        // Center panel
        ctx.fillRect(mullion1X, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(mullion1X, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        
        // Right panel
        const rightPanelX = mullion2X + openDistance;
        ctx.fillRect(rightPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(rightPanelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
      }
      
      // Mullions
      ctx.fillStyle = design.color;
      ctx.fillRect(mullion1X - 5, bounds.y + sashInset, 10, bounds.h - sashInset * 2);
      ctx.fillRect(mullion2X - 5, bounds.y + sashInset, 10, bounds.h - sashInset * 2);
    } else if (design.template === 'transom' || design.template === 'clerestory') {
      // Transom/Clerestory - wide horizontal window with subtle pulse animation
      const sashInset = 20 * scale;
      const pulseIntensity = Math.sin(casementAngleRef.current * Math.PI / 180) * 0.1 + 1; // Subtle pulse
      if (design.glass) {
        ctx.fillStyle = `rgba(232, 244, 248, ${0.9 + pulseIntensity * 0.1})`;
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
      }
    } else if (design.template === 'skylight') {
      // Skylight - square/round roof window with glow effect
      const sashInset = 20 * scale;
      const glowIntensity = Math.sin(casementAngleRef.current * Math.PI / 180) * 0.15 + 0.85;
      if (design.glass) {
        // Glow effect
        ctx.shadowColor = `rgba(255, 200, 100, ${glowIntensity})`;
        ctx.shadowBlur = 10 * scale;
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
      }
    } else if (design.template === 'corner') {
      // Corner window - L-shaped with subtle movement
      const sashInset = 20 * scale;
      const moveOffset = Math.sin(casementAngleRef.current * Math.PI / 180) * 5 * scale;
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        // Left side - slight movement
        ctx.fillRect(bounds.x + sashInset - moveOffset, bounds.y + sashInset, (bounds.w - sashInset * 2) / 2, bounds.h - sashInset * 2);
        // Right side - opposite movement
        ctx.fillRect(bounds.x + bounds.w / 2 + moveOffset, bounds.y + sashInset, (bounds.w - sashInset * 2) / 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset - moveOffset, bounds.y + sashInset, (bounds.w - sashInset * 2) / 2, bounds.h - sashInset * 2);
        ctx.strokeRect(bounds.x + bounds.w / 2 + moveOffset, bounds.y + sashInset, (bounds.w - sashInset * 2) / 2, bounds.h - sashInset * 2);
      }
    } else if (design.template === 'garden') {
      // Garden window - projects outward (similar to bay but smaller)
      const sashInset = 20 * scale;
      const projection = Math.sin(casementAngleRef.current * Math.PI / 180) * 15 * scale;
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        // Center panel
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        // Side panels for projection effect
        const sideWidth = (bounds.w - sashInset * 2) * 0.2;
        ctx.fillRect(bounds.x + sashInset - projection, bounds.y + sashInset, sideWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(bounds.x + sashInset - projection, bounds.y + sashInset, sideWidth, bounds.h - sashInset * 2);
        ctx.fillRect(bounds.x + bounds.w - sashInset - sideWidth + projection, bounds.y + sashInset, sideWidth, bounds.h - sashInset * 2);
        ctx.strokeRect(bounds.x + bounds.w - sashInset - sideWidth + projection, bounds.y + sashInset, sideWidth, bounds.h - sashInset * 2);
      }
    } else if (design.template === 'storm') {
      // Storm window - similar to single but with indication of double pane
      const sashInset = 20 * scale;
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 3 * scale; // Thicker for storm window
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        // Double pane indicator
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(bounds.x + sashInset + 5 * scale, bounds.y + sashInset + 5 * scale, 
                      bounds.w - sashInset * 2 - 10 * scale, bounds.h - sashInset * 2 - 10 * scale);
      }
    } else if (design.template === 'greenhouse') {
      // Greenhouse - full glass, multiple panes with grid highlight animation
      const sashInset = 20 * scale;
      const gridPulse = Math.sin(jalousieRotationRef.current * Math.PI / 180) * 0.3 + 0.7; // Grid pulse effect
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        // Large glass panels with grid pattern
        ctx.fillRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(bounds.x + sashInset, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        // Grid pattern for greenhouse with animation
        const gridCols = 3;
        const gridRows = 3;
        const cellWidth = (bounds.w - sashInset * 2) / gridCols;
        const cellHeight = (bounds.h - sashInset * 2) / gridRows;
        ctx.strokeStyle = `rgba(153, 153, 153, ${gridPulse})`;
        ctx.lineWidth = 1 * scale;
        for (let i = 1; i < gridCols; i++) {
          ctx.beginPath();
          ctx.moveTo(bounds.x + sashInset + i * cellWidth, bounds.y + sashInset);
          ctx.lineTo(bounds.x + sashInset + i * cellWidth, bounds.y + bounds.h - sashInset);
          ctx.stroke();
        }
        for (let i = 1; i < gridRows; i++) {
          ctx.beginPath();
          ctx.moveTo(bounds.x + sashInset, bounds.y + sashInset + i * cellHeight);
          ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + sashInset + i * cellHeight);
          ctx.stroke();
        }
      }
    } else if (design.template === 'barn' || design.template === 'pocket') {
      // Barn/Pocket door - similar to sliding but different track style
      const sashInset = 20 * scale;
      const openDistance = slidePositionRef.current;
      const panelWidth = bounds.w - sashInset * 2;
      const maxSlide = panelWidth * 0.6;
      const slideOffset = Math.min(openDistance, maxSlide);
      
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        const panelX = bounds.x + sashInset - slideOffset;
        ctx.fillRect(panelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(panelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
        
        // Track at top for barn door
        if (design.template === 'barn') {
          ctx.strokeStyle = '#999';
          ctx.lineWidth = 4 * scale;
          ctx.beginPath();
          ctx.moveTo(bounds.x + sashInset, bounds.y + sashInset);
          ctx.lineTo(bounds.x + bounds.w - sashInset, bounds.y + sashInset);
          ctx.stroke();
        }
      }
    } else if (design.template === 'accordion') {
      // Accordion door - multiple folding panels
      const sashInset = 20 * scale;
      const panelCount = 6;
      const panelWidth = (bounds.w - sashInset * 2) / panelCount;
      const foldAngle = bifoldAngleRef.current * Math.PI / 180;
      const foldDistance = Math.sin(foldAngle) * panelWidth * 0.4;
      
      if (design.glass) {
        ctx.fillStyle = '#e8f4f8';
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * scale;
        
        for (let i = 0; i < panelCount; i++) {
          const panelX = bounds.x + sashInset + i * panelWidth - (i > 0 ? foldDistance * i * 0.3 : 0);
          ctx.fillRect(panelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
          ctx.strokeRect(panelX, bounds.y + sashInset, panelWidth, bounds.h - sashInset * 2);
          
          if (i < panelCount - 1) {
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(panelX + panelWidth, bounds.y + sashInset);
            ctx.lineTo(panelX + panelWidth, bounds.y + bounds.h - sashInset);
            ctx.stroke();
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 2 * scale;
          }
        }
      }
    } else if (design.template === 'security' || design.template === 'louvre') {
      // Security/Louvre door - similar to single but with different styling
      const sashInset = 20 * scale;
      const openAngle = casementAngleRef.current * Math.PI / 180;
      const openDistance = Math.sin(openAngle) * (bounds.w - sashInset * 2) * 0.3;
      
      if (design.glass) {
        const panelX = bounds.x + sashInset - openDistance;
        ctx.fillStyle = design.template === 'louvre' ? '#f0f0f0' : '#e8f4f8';
        ctx.fillRect(panelX, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = design.template === 'security' ? 3 * scale : 2 * scale;
        ctx.strokeRect(panelX, bounds.y + sashInset, bounds.w - sashInset * 2, bounds.h - sashInset * 2);
        
        // Louvre slats
        if (design.template === 'louvre') {
          const slatCount = 8;
          const slatHeight = (bounds.h - sashInset * 2) / slatCount;
          ctx.strokeStyle = '#999';
          ctx.lineWidth = 1 * scale;
          for (let i = 1; i < slatCount; i++) {
            ctx.beginPath();
            ctx.moveTo(panelX, bounds.y + sashInset + i * slatHeight);
            ctx.lineTo(panelX + bounds.w - sashInset * 2, bounds.y + sashInset + i * slatHeight);
            ctx.stroke();
          }
        }
      }
    } else if (design.template === 'sliding_panel') {
      // Sliding panel door - multiple panels sliding
      const sashInset = 20 * scale;
      const panelCount = 2;
      const panelWidth = (bounds.w - sashInset * 2 - 10) / panelCount;
      const slideOffset = slidePositionRef.current * 0.5;
      
      if (design.glass) {
        // Left panel - realistic glass
        const leftPanelX = bounds.x + sashInset;
        const leftPanelY = bounds.y + sashInset;
        const leftPanelW = panelWidth;
        const leftPanelH = bounds.h - sashInset * 2;
        drawRealisticGlass(ctx, leftPanelX, leftPanelY, leftPanelW, leftPanelH, scale, false);
        
        // Right panel (slides) - realistic glass
        const rightPanelX = bounds.x + sashInset + panelWidth + 10 - slideOffset;
        const rightPanelY = bounds.y + sashInset;
        const rightPanelW = panelWidth;
        const rightPanelH = bounds.h - sashInset * 2;
        drawRealisticGlass(ctx, rightPanelX, rightPanelY, rightPanelW, rightPanelH, scale, true);
      }
    } else if ((design.template === 'fixed' || design.template === 'picture' || design.template === 'arch') && design.glass) {
      // Fixed, Picture, Arch - no animation, realistic glass
      const sashInset = 20 * scale;
      const glassX = bounds.x + sashInset;
      const glassY = bounds.y + sashInset;
      const glassW = bounds.w - sashInset * 2;
      const glassH = bounds.h - sashInset * 2;
      drawRealisticGlass(ctx, glassX, glassY, glassW, glassH, scale, false);
      
      // Arch window special styling
      if (design.template === 'arch') {
        // Draw rounded top indicator
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.arc(bounds.x + bounds.w / 2, bounds.y + sashInset, (bounds.w - sashInset * 2) * 0.3, Math.PI, 0);
        ctx.stroke();
      }
    }

    // Simplified Dimensions - show as clean lines with values
    if (showDimensions) {
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1 * scale;
      ctx.fillStyle = '#333';
      ctx.font = `${Math.max(11 * scale, 9)}px Arial`;
      
      // Width dimension line above window
      const dimLineY = bounds.y - 20 * scale;
      ctx.beginPath();
      ctx.moveTo(bounds.x, dimLineY);
      ctx.lineTo(bounds.x + bounds.w, dimLineY);
      ctx.stroke();
      
      // Width arrows
      ctx.beginPath();
      ctx.moveTo(bounds.x, dimLineY);
      ctx.lineTo(bounds.x + 5 * scale, dimLineY - 3 * scale);
      ctx.moveTo(bounds.x, dimLineY);
      ctx.lineTo(bounds.x + 5 * scale, dimLineY + 3 * scale);
      ctx.moveTo(bounds.x + bounds.w, dimLineY);
      ctx.lineTo(bounds.x + bounds.w - 5 * scale, dimLineY - 3 * scale);
      ctx.moveTo(bounds.x + bounds.w, dimLineY);
      ctx.lineTo(bounds.x + bounds.w - 5 * scale, dimLineY + 3 * scale);
      ctx.stroke();
      
      // Width text centered above
      const widthText = `${design.width}`;
      const widthTextWidth = ctx.measureText(widthText).width;
      ctx.fillText(widthText, bounds.x + bounds.w / 2 - widthTextWidth / 2, dimLineY - 6 * scale);
      
      // Height dimension line on left
      const dimLineX = bounds.x - 20 * scale;
      ctx.beginPath();
      ctx.moveTo(dimLineX, bounds.y);
      ctx.lineTo(dimLineX, bounds.y + bounds.h);
      ctx.stroke();
      
      // Height arrows
      ctx.beginPath();
      ctx.moveTo(dimLineX, bounds.y);
      ctx.lineTo(dimLineX - 3 * scale, bounds.y + 5 * scale);
      ctx.moveTo(dimLineX, bounds.y);
      ctx.lineTo(dimLineX + 3 * scale, bounds.y + 5 * scale);
      ctx.moveTo(dimLineX, bounds.y + bounds.h);
      ctx.lineTo(dimLineX - 3 * scale, bounds.y + bounds.h - 5 * scale);
      ctx.moveTo(dimLineX, bounds.y + bounds.h);
      ctx.lineTo(dimLineX + 3 * scale, bounds.y + bounds.h - 5 * scale);
      ctx.stroke();
      
      // Height text (rotated)
      ctx.save();
      ctx.translate(dimLineX - 8 * scale, bounds.y + bounds.h / 2);
      ctx.rotate(-Math.PI / 2);
      const heightText = `${design.height}`;
      ctx.fillText(heightText, -ctx.measureText(heightText).width / 2, 0);
      ctx.restore();
      
      // Show panel dimensions for multi-panel windows
      if (design.template === 'double' || design.template === 'french') {
        const panelWidth = bounds.w / 2;
        const midX = bounds.x + bounds.w / 2;
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 0.5 * scale;
        ctx.setLineDash([3 * scale, 3 * scale]);
        ctx.beginPath();
        ctx.moveTo(midX, bounds.y);
        ctx.lineTo(midX, bounds.y + bounds.h);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Panel width text
        const panelText = `-${Math.floor(design.width / 2)}-`;
        const panelTextWidth = ctx.measureText(panelText).width;
        ctx.fillStyle = '#666';
        ctx.font = `${Math.max(10 * scale, 8)}px Arial`;
        ctx.fillText(panelText, bounds.x + panelWidth / 2 - panelTextWidth / 2, dimLineY - 6 * scale);
      }
    }

    // Drag handles - larger on mobile for touch
    const isMobile = window.innerWidth < 768;
    const handleRadius = isMobile ? 20 : 8;
    const handleLineWidth = isMobile ? 3 : 2;
    handles.forEach(handle => {
      ctx.fillStyle = handle.active ? '#ff6b35' : '#2196f3';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = handleLineWidth;
      ctx.beginPath();
      ctx.arc(handle.x, handle.y, handleRadius, 0, Math.PI * 2);
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

  // Universal animation loop for all templates
  useEffect(() => {
    // Reset all animations when template changes
    const resetAnimations = () => {
      slidePositionRef.current = 0;
      slideDirectionRef.current = 1;
      casementAngleRef.current = 0;
      casementDirectionRef.current = 1;
      awningAngleRef.current = 0;
      hopperAngleRef.current = 0;
      tiltAngleRef.current = 0;
      jalousieRotationRef.current = 0;
      bifoldAngleRef.current = 0;
      pivotAngleRef.current = 0;
    };

    // Detect if mobile for performance optimization
    const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
    let lastFrameTime = 0;
    const targetFPS = isMobileDevice ? 30 : 60; // Reduce FPS on mobile for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Throttle animation on mobile for better performance
      if (isMobileDevice && lastFrameTime && currentTime - lastFrameTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;
      
      const bounds = getDesignBounds();
      const scale = getScale();
      
      // Template-specific animations
      if (design.template === 'sliding' || design.template === 'patio') {
        // Sliding animation
        const sashInset = 20 * scale;
        const panelGap = 10 * scale;
        const panelWidth = (bounds.w - sashInset * 2 - panelGap) / 2;
        const maxSlideDistance = panelWidth * 0.4;
        const speed = isMobileDevice ? 0.6 : 0.8; // Slower on mobile
        
        slidePositionRef.current += speed * slideDirectionRef.current;
        if (slidePositionRef.current >= maxSlideDistance) {
          slideDirectionRef.current = -1;
          slidePositionRef.current = maxSlideDistance;
        } else if (slidePositionRef.current <= 0) {
          slideDirectionRef.current = 1;
          slidePositionRef.current = 0;
        }
      } else if (design.template === 'bifold') {
        // Bifold door - folding animation
        const speed = 0.5;
        bifoldAngleRef.current += speed * casementDirectionRef.current;
        if (bifoldAngleRef.current >= 90) {
          casementDirectionRef.current = -1;
          bifoldAngleRef.current = 90;
        } else if (bifoldAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          bifoldAngleRef.current = 0;
        }
      } else if (design.template === 'pivot') {
        // Pivot door - rotation animation
        const speed = 0.4;
        pivotAngleRef.current += speed * casementDirectionRef.current;
        if (pivotAngleRef.current >= 90) {
          casementDirectionRef.current = -1;
          pivotAngleRef.current = 90;
        } else if (pivotAngleRef.current <= -90) {
          casementDirectionRef.current = 1;
          pivotAngleRef.current = -90;
        }
      } else if (design.template === 'single' || design.template === 'casement' || 
                 design.template === 'double' || design.template === 'triple' ||
                 design.template === 'bay' || design.template === 'bow' || design.template === 'garden' ||
                 design.template === 'french' || design.template === 'entry' ||
                 design.template === 'security' || design.template === 'louvre') {
        // Casement/door opening animation (swings open)
        const speed = isMobileDevice ? 0.4 : 0.6; // Slower on mobile
        casementAngleRef.current += speed * casementDirectionRef.current;
        if (casementAngleRef.current >= 45) {
          casementDirectionRef.current = -1;
          casementAngleRef.current = 45;
        } else if (casementAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          casementAngleRef.current = 0;
        }
      } else if (design.template === 'transom' || design.template === 'clerestory') {
        // Transom/Clerestory - subtle pulse animation
        const speed = isMobileDevice ? 0.3 : 0.4;
        casementAngleRef.current += speed * casementDirectionRef.current;
        if (casementAngleRef.current >= 180) {
          casementDirectionRef.current = -1;
          casementAngleRef.current = 180;
        } else if (casementAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          casementAngleRef.current = 0;
        }
      } else if (design.template === 'skylight') {
        // Skylight - glow pulse animation
        const speed = isMobileDevice ? 0.3 : 0.4;
        casementAngleRef.current += speed * casementDirectionRef.current;
        if (casementAngleRef.current >= 180) {
          casementDirectionRef.current = -1;
          casementAngleRef.current = 180;
        } else if (casementAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          casementAngleRef.current = 0;
        }
      } else if (design.template === 'corner') {
        // Corner window - subtle movement animation
        const speed = isMobileDevice ? 0.3 : 0.4;
        casementAngleRef.current += speed * casementDirectionRef.current;
        if (casementAngleRef.current >= 90) {
          casementDirectionRef.current = -1;
          casementAngleRef.current = 90;
        } else if (casementAngleRef.current <= -90) {
          casementDirectionRef.current = 1;
          casementAngleRef.current = -90;
        }
      } else if (design.template === 'greenhouse') {
        // Greenhouse - grid pulse animation (reuse jalousie rotation ref)
        const speed = isMobileDevice ? 0.5 : 0.8;
        jalousieRotationRef.current += speed;
        if (jalousieRotationRef.current >= 180) {
          jalousieRotationRef.current = -180; // Reset for continuous pulse
        }
      } else if (design.template === 'barn' || design.template === 'pocket' || design.template === 'sliding_panel') {
        // Barn/Pocket/Sliding Panel - sliding animation
        const speed = isMobileDevice ? 0.6 : 0.8;
        slidePositionRef.current += speed * slideDirectionRef.current;
        const maxSlide = (bounds.w - 40 * scale) * 0.6;
        if (slidePositionRef.current >= maxSlide) {
          slideDirectionRef.current = -1;
          slidePositionRef.current = maxSlide;
        } else if (slidePositionRef.current <= 0) {
          slideDirectionRef.current = 1;
          slidePositionRef.current = 0;
        }
      } else if (design.template === 'accordion') {
        // Accordion - folding animation (reuse bifold logic)
        const speed = isMobileDevice ? 0.3 : 0.5;
        bifoldAngleRef.current += speed * casementDirectionRef.current;
        if (bifoldAngleRef.current >= 90) {
          casementDirectionRef.current = -1;
          bifoldAngleRef.current = 90;
        } else if (bifoldAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          bifoldAngleRef.current = 0;
        }
      } else if (design.template === 'awning') {
        // Awning window - opens upward
        const speed = isMobileDevice ? 0.3 : 0.5;
        awningAngleRef.current += speed * casementDirectionRef.current;
        if (awningAngleRef.current >= 60) {
          casementDirectionRef.current = -1;
          awningAngleRef.current = 60;
        } else if (awningAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          awningAngleRef.current = 0;
        }
      } else if (design.template === 'hopper') {
        // Hopper window - opens downward
        const speed = isMobileDevice ? 0.3 : 0.5;
        hopperAngleRef.current += speed * casementDirectionRef.current;
        if (hopperAngleRef.current >= 60) {
          casementDirectionRef.current = -1;
          hopperAngleRef.current = 60;
        } else if (hopperAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          hopperAngleRef.current = 0;
        }
      } else if (design.template === 'tilt_turn') {
        // Tilt & Turn - tilts inwards
        const speed = isMobileDevice ? 0.3 : 0.4;
        tiltAngleRef.current += speed * casementDirectionRef.current;
        if (tiltAngleRef.current >= 20) {
          casementDirectionRef.current = -1;
          tiltAngleRef.current = 20;
        } else if (tiltAngleRef.current <= 0) {
          casementDirectionRef.current = 1;
          tiltAngleRef.current = 0;
        }
      } else if (design.template === 'jalousie') {
        // Jalousie - slats rotate
        const speed = isMobileDevice ? 0.5 : 0.8;
        jalousieRotationRef.current += speed;
        if (jalousieRotationRef.current >= 45) {
          jalousieRotationRef.current = -45; // Reset to -45 for continuous rotation
        }
      }

      // Redraw canvas with new animation state
      draw();

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Reset animations when template changes
    resetAnimations();
    
    // Start animation (even for fixed templates, they'll just not animate)
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [design.template, design.width, design.height, zoom, pan, draw, getDesignBounds, getScale, drawRealisticGlass]);

  // Export canvas as image (data URL)
  const exportAsImage = useCallback((): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    try {
      // Export the canvas as a PNG data URL
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error exporting canvas:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (onActionsReady) {
      const panBy = (dx: number, dy: number) => {
        setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      };
      
      const setGridState = (show: boolean) => {
        setShowGrid(show);
        onGridChange?.(show);
      };
      
      onActionsReady({
        center: centerView,
        fit: fitToView,
        exportAsImage: exportAsImage,
        panBy: panBy,
        setGrid: setGridState,
      });
    }
  }, [onActionsReady, centerView, fitToView, exportAsImage, onGridChange]);

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

    const getEventCoordinates = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
      if ('touches' in e && e.touches.length > 0) {
        return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
      }
      return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoordinates(e);
      const rect = canvas.getBoundingClientRect();
      
      // Check if touch is actually on the canvas
      const isOnCanvas = coords.clientX >= rect.left && 
                         coords.clientX <= rect.right &&
                         coords.clientY >= rect.top && 
                         coords.clientY <= rect.bottom;
      
      // Also check if target is sidebar
      if ('touches' in e) {
        const target = e.target as HTMLElement;
        if (target.closest('.scrollable-sidebar') || !isOnCanvas) {
          return; // Let sidebar handle scrolling, or ignore if not on canvas
        }
      } else if (!isOnCanvas) {
        return; // Not on canvas, don't interfere
      }
      
      e.preventDefault();
      const x = coords.clientX - rect.left;
      const y = coords.clientY - rect.top;
      
      const handles = getDragHandles();
      const handle = findHandleAtPoint(x, y, handles);
      
      if (handle) {
        setActiveHandle(handle);
        setIsDragging(true);
        setDragStart({ x: coords.clientX, y: coords.clientY });
      } else {
        setIsDragging(true);
        setDragStart({ x: coords.clientX - pan.x, y: coords.clientY - pan.y });
      }
    };

    const handleMouseDown = (e: MouseEvent) => handleStart(e);
    const handleTouchStart = (e: TouchEvent) => handleStart(e);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoordinates(e);
      const rect = canvas.getBoundingClientRect();
      
      // Check if touch is actually on the canvas
      const isOnCanvas = coords.clientX >= rect.left && 
                         coords.clientX <= rect.right &&
                         coords.clientY >= rect.top && 
                         coords.clientY <= rect.bottom;
      
      // Also check if target is sidebar
      if ('touches' in e) {
        const target = e.target as HTMLElement;
        if (target.closest('.scrollable-sidebar') || !isOnCanvas) {
          return; // Let sidebar handle scrolling, or ignore if not on canvas
        }
      } else if (!isOnCanvas) {
        return; // Not on canvas, don't interfere
      }
      
      e.preventDefault();
      
      if (!isDragging || !activeHandle) {
        if (isDragging && !activeHandle) {
          setPan({ x: coords.clientX - dragStart.x, y: coords.clientY - dragStart.y });
        }
        return;
      }

      // rect already defined above
      const scale = getScale();
      const bounds = getDesignBounds();
      
      if (activeHandle.id === 'width') {
        const newX = coords.clientX - rect.left;
        const newWidth = ((newX - bounds.x) / scale);
        const snapped = snapToGrid(newWidth);
        if (snapped >= 300 && snapped <= 3000) {
          onDesignChange({ width: snapped });
        }
      } else if (activeHandle.id === 'height') {
        const newY = coords.clientY - rect.top;
        const newHeight = ((newY - bounds.y) / scale);
        const snapped = snapToGrid(newHeight);
        if (snapped >= 300 && snapped <= 3000) {
          onDesignChange({ height: snapped });
        }
      } else if (activeHandle.id === 'corner') {
        const newX = coords.clientX - rect.left;
        const newY = coords.clientY - rect.top;
        const newWidth = ((newX - bounds.x) / scale);
        const newHeight = ((newY - bounds.y) / scale);
        const snappedW = snapToGrid(newWidth);
        const snappedH = snapToGrid(newHeight);
        if (snappedW >= 300 && snappedW <= 3000 && snappedH >= 300 && snappedH <= 3000) {
          onDesignChange({ width: snappedW, height: snappedH });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e);
    const handleTouchMove = (e: TouchEvent) => handleMove(e);

    const handleEnd = () => {
      setIsDragging(false);
      setActiveHandle(null);
    };

    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, activeHandle, dragStart, pan, getScale, getDesignBounds, getDragHandles, findHandleAtPoint, snapToGrid, onDesignChange, draw]);

  useEffect(() => {
    draw();
  }, [draw, design, zoom, pan]);

  // Detect if iPhone/iOS for specific optimizations
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      WebkitOverflowScrolling: 'touch',
      overflow: 'hidden',
      WebkitTouchCallout: 'none', // Prevent iOS callout menu on long press
      WebkitUserSelect: 'none',
      userSelect: 'none'
    }}>
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block', 
          cursor: activeHandle ? 'ew-resize' : isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-x pan-y', // Allow panning but prevent default gestures on iPhone 15
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none', // Prevent iOS callout menu
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      {/* Minimal zoom indicator - Android style */}
      <div style={{ 
        position: 'absolute', 
        top: '8px', 
        right: '8px', 
        background: 'rgba(0,0,0,0.6)', 
        color: 'white',
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '11px',
        fontFamily: 'monospace',
        opacity: 0.7,
        pointerEvents: 'none'
      }}>
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}

