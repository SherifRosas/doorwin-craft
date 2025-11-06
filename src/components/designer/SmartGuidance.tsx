"use client";
import { useState, useEffect, useMemo } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface GuidanceTip {
  id: string;
  type: 'info' | 'success' | 'warning' | 'tip';
  icon: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: number; // Higher = more important
}

interface SmartGuidanceProps {
  design: DesignConfig;
  onDesignUpdate?: (updates: Partial<DesignConfig>) => void;
}

export function SmartGuidance({ design, onDesignUpdate }: SmartGuidanceProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [autoRotate, setAutoRotate] = useState(true);

  // Generate contextual guidance tips
  const tips = useMemo<GuidanceTip[]>(() => {
    const generatedTips: GuidanceTip[] = [];

    // Template-specific tips
    if (design.template === 'sliding' || design.template === 'patio') {
      generatedTips.push({
        id: 'sliding-dimensions',
        type: 'tip',
        icon: '📐',
        title: 'Optimal Sliding Dimensions',
        message: 'For sliding windows/doors, recommended width is 1200-2400mm and height 1800-2400mm for smooth operation.',
        priority: 3
      });
    }

    if (design.template === 'double' || design.template === 'french') {
      generatedTips.push({
        id: 'double-balance',
        title: 'Balanced Panel Design',
        icon: '⚖️',
        type: 'tip',
        message: 'For double windows/doors, keep panel widths equal (50/50) for optimal balance and aesthetics.',
        priority: 3
      });
    }

    if (design.template === 'bifold' || design.template === 'accordion') {
      generatedTips.push({
        id: 'folding-space',
        title: 'Folding Space Consideration',
        icon: '📏',
        type: 'tip',
        message: 'Bifold/Accordion doors need clearance space when opened. Ensure 50% of width is available for full opening.',
        priority: 4
      });
    }

    // Material recommendations
    if (design.material === 'aluminum') {
      generatedTips.push({
        id: 'aluminum-benefits',
        type: 'info',
        icon: '🔧',
        title: 'Aluminum Benefits',
        message: 'Aluminum offers excellent durability, weather resistance, and low maintenance. Perfect for coastal or harsh climates.',
        priority: 2
      });
    }

    if (design.material === 'upvc') {
      generatedTips.push({
        id: 'upvc-energy',
        type: 'info',
        icon: '💚',
        title: 'UPVC Energy Efficiency',
        message: 'UPVC provides excellent thermal insulation, reducing energy costs. Great for temperature control and noise reduction.',
        priority: 2
      });
    }

    if (design.material === 'wood') {
      generatedTips.push({
        id: 'wood-maintenance',
        type: 'info',
        icon: '🪵',
        title: 'Wood Maintenance',
        message: 'Wood offers natural beauty but requires regular maintenance (painting/staining every 3-5 years) to maintain appearance.',
        priority: 2
      });
    }

    // Dimension validation tips
    if (design.width < 500) {
      generatedTips.push({
        id: 'width-too-small',
        type: 'warning',
        icon: '⚠️',
        title: 'Width Too Small',
        message: 'Current width is very small (< 500mm). Minimum recommended: 600mm for doors, 400mm for windows.',
        priority: 5,
        action: onDesignUpdate ? {
          label: 'Set to 600mm',
          onClick: () => onDesignUpdate({ width: 600 })
        } : undefined
      });
    }

    if (design.width > 3000) {
      generatedTips.push({
        id: 'width-too-large',
        type: 'warning',
        icon: '⚠️',
        title: 'Width Very Large',
        message: 'Width exceeds 3000mm. Consider multiple units or structural reinforcement. Max single unit: 2400mm recommended.',
        priority: 4
      });
    }

    if (design.height < 800) {
      generatedTips.push({
        id: 'height-too-small',
        type: 'warning',
        icon: '⚠️',
        title: 'Height Too Small',
        message: 'Current height is very small (< 800mm). Minimum recommended: 1200mm for windows, 1800mm for doors.',
        priority: 5,
        action: onDesignUpdate ? {
          label: 'Set to 1200mm',
          onClick: () => onDesignUpdate({ height: 1200 })
        } : undefined
      });
    }

    if (design.height > 3000) {
      generatedTips.push({
        id: 'height-too-large',
        type: 'warning',
        icon: '⚠️',
        title: 'Height Very Large',
        message: 'Height exceeds 3000mm. May require special structural support. Consider splitting into multiple units.',
        priority: 4
      });
    }

    // Glass recommendations
    if (!design.glass && (design.type === 'window' || design.template === 'french' || design.template === 'entry')) {
      generatedTips.push({
        id: 'add-glass',
        type: 'tip',
        icon: '🪟',
        title: 'Add Glass Panels',
        message: 'Consider enabling glass for better insulation, natural light, and modern appearance.',
        priority: 3,
        action: onDesignUpdate ? {
          label: 'Enable Glass',
          onClick: () => onDesignUpdate({ glass: true })
        } : undefined
      });
    }

    // Frame depth recommendations
    if (design.frameDepth < 50) {
      generatedTips.push({
        id: 'frame-thin',
        type: 'warning',
        icon: '⚠️',
        title: 'Thin Frame Depth',
        message: 'Frame depth < 50mm may lack structural strength. Recommended: 60-80mm for windows, 80-100mm for doors.',
        priority: 4
      });
    }

    if (design.frameDepth > 120) {
      generatedTips.push({
        id: 'frame-thick',
        type: 'info',
        icon: '💡',
        title: 'Thick Frame Depth',
        message: 'Frame depth > 120mm provides excellent insulation and strength, but increases material costs.',
        priority: 2
      });
    }

    // Hardware recommendations
    if (!design.hardware) {
      generatedTips.push({
        id: 'add-hardware',
        type: 'tip',
        icon: '🔩',
        title: 'Complete Your Design',
        message: 'Add hardware (handles, hinges, locks) to finalize your design and get accurate pricing.',
        priority: 3
      });
    }

    // Template-specific recommendations
    if (design.template === 'skylight' && design.height < 600) {
      generatedTips.push({
        id: 'skylight-size',
        type: 'tip',
        icon: '☀️',
        title: 'Skylight Dimensions',
        message: 'Skylights typically work best in square dimensions (600x600mm to 1200x1200mm) for optimal light distribution.',
        priority: 3
      });
    }

    if ((design.template === 'bay' || design.template === 'bow') && design.width < 2000) {
      generatedTips.push({
        id: 'bay-width',
        type: 'tip',
        icon: '⏸️',
        title: 'Bay/Bow Window Width',
        message: 'Bay and Bow windows typically require wider openings (minimum 2000mm) to achieve the characteristic projection effect.',
        priority: 3
      });
    }

    // Aspect ratio recommendations
    const aspectRatio = design.width / design.height;
    if (aspectRatio > 2.5) {
      generatedTips.push({
        id: 'wide-format',
        type: 'info',
        icon: '📐',
        title: 'Wide Format Design',
        message: 'Your design is very wide. Consider horizontal sliding windows or multiple units for better functionality.',
        priority: 2
      });
    }

    if (aspectRatio < 0.4) {
      generatedTips.push({
        id: 'tall-format',
        type: 'info',
        icon: '📐',
        title: 'Tall Format Design',
        message: 'Your design is very tall. Consider transom or clerestory windows, or split into multiple units.',
        priority: 2
      });
    }

    // Success tips for good configurations
    if (design.width >= 1200 && design.width <= 2400 && 
        design.height >= 1500 && design.height <= 2400 &&
        design.frameDepth >= 60 && design.frameDepth <= 100) {
      generatedTips.push({
        id: 'optimal-dimensions',
        type: 'success',
        icon: '✅',
        title: 'Optimal Dimensions',
        message: 'Great! Your dimensions fall within recommended ranges for standard installations.',
        priority: 1
      });
    }

    // Sort by priority (highest first) and filter dismissed
    return generatedTips
      .filter(tip => !dismissedTips.has(tip.id))
      .sort((a, b) => b.priority - a.priority);
  }, [design, dismissedTips, onDesignUpdate]);

  // Auto-rotate tips
  useEffect(() => {
    if (!autoRotate || tips.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [autoRotate, tips.length]);

  if (tips.length === 0) return null;

  const currentTip = tips[currentTipIndex];
  if (!currentTip) return null;

  const getTypeStyles = () => {
    switch (currentTip.type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          border: '#4caf50'
        };
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          border: '#ff9800'
        };
      case 'info':
        return {
          bg: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
          border: '#2196f3'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: '#667eea'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div style={{
      background: styles.bg,
      color: 'white',
      padding: '14px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '13px',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: `2px solid ${styles.border}`
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1
        }}>
          <span style={{ fontSize: '18px' }}>{currentTip.icon}</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
              {currentTip.title}
            </div>
            {tips.length > 1 && (
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                Tip {currentTipIndex + 1} of {tips.length}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {tips.length > 1 && (
            <button
              onClick={() => setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              title="Previous tip"
            >
              ←
            </button>
          )}
          <button
            onClick={() => {
              setDismissedTips(prev => new Set([...prev, currentTip.id]));
              if (currentTipIndex >= tips.length - 1) {
                setCurrentTipIndex(0);
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            title="Dismiss tip"
          >
            ×
          </button>
        </div>
      </div>

      {/* Message */}
      <div style={{
        marginBottom: currentTip.action ? '10px' : '0',
        lineHeight: '1.5',
        fontSize: '13px'
      }}>
        {currentTip.message}
      </div>

      {/* Action button */}
      {currentTip.action && (
        <button
          onClick={currentTip.action.onClick}
          style={{
            marginTop: '8px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {currentTip.action.label}
        </button>
      )}

      {/* Progress dots */}
      {tips.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          {tips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentTipIndex(idx)}
              style={{
                width: currentTipIndex === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: currentTipIndex === idx ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s'
              }}
              title={`Tip ${idx + 1}: ${tips[idx].title}`}
            />
          ))}
        </div>
      )}

      {/* Auto-rotate toggle */}
      {tips.length > 1 && (
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '10px',
            cursor: 'pointer',
            padding: '4px',
            opacity: 0.7
          }}
          title={autoRotate ? 'Pause auto-rotate' : 'Resume auto-rotate'}
        >
          {autoRotate ? '⏸️' : '▶️'}
        </button>
      )}
    </div>
  );
}





