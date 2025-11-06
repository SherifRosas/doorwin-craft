"use client";
import { useState, useMemo } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface PricingPanelProps {
  design: DesignConfig;
  onMarkupChange?: (markup: number) => void;
}

interface PriceBreakdown {
  frameProfile: number;
  glass: number;
  hardware: number;
  sills: number;
  mosquitoNet: number;
  glassFilm: number;
  installation: number;
  subtotal: number;
  markup: number;
  total: number;
}

export function PricingPanel({ design, onMarkupChange }: PricingPanelProps) {
  const [markup, setMarkup] = useState(20); // Default 20% markup
  const [markupType, setMarkupType] = useState<'percent' | 'fixed'>('percent');
  const profileType = (design as any).profileType || 'square';
  const profileMultiplier: Record<string, number> = {
    square: 1.0,
    chamfer: 1.05,
    ovolo: 1.08,
    round: 1.1,
  };

  // Calculate price breakdown
  const breakdown = useMemo<PriceBreakdown>(() => {
    const baseFrameRate = 150; // SAR per meter
    const baseGlassRate = 80; // SAR per m²
    const baseHardwareRate = 50; // SAR per piece
    
    // Frame calculation
    const framePerimeter = ((design.width + design.height) * 2) / 1000; // meters
    const frameDepthM = design.frameDepth / 1000; // meters to m
    const frameProfile = framePerimeter * frameDepthM * baseFrameRate;
    
    // Glass calculation
    const glassArea = design.glass ? (design.width * design.height) / 1_000_000 : 0; // m²
    const glass = glassArea * baseGlassRate;
    
    // Hardware calculation
    let hardwareCount = 0;
    if (design.hardware) {
      if (design.hardware.handles) hardwareCount += 1;
      if (design.hardware.hinges) hardwareCount += parseInt(design.hardware.hinges) || 0;
      if (design.hardware.locks) hardwareCount += parseInt(design.hardware.locks) || 0;
    }
    const hardware = hardwareCount * baseHardwareRate;
    
    // Sills
    const sills = design.sills && design.sills.type !== 'none' 
      ? (design.width / 1000) * (design.sills.type === 'premium' ? 200 : 100)
      : 0;
    
    // Mosquito net
    const mosquitoNet = design.mosquitoNet && design.mosquitoNet.type !== 'none'
      ? glassArea * (design.mosquitoNet.material === 'premium' ? 60 : 40)
      : 0;
    
    // Glass film
    const glassFilm = design.glassFilm && design.glassFilm.type !== 'none'
      ? glassArea * (design.glassFilm.type === 'energy_efficient' ? 80 : 50)
      : 0;
    
    // Installation
    const installation = design.work?.installation ? 300 : 0;
    
    const subtotal = frameProfile + glass + hardware + sills + mosquitoNet + glassFilm + installation;
    
    const calculatedMarkup = markupType === 'percent' 
      ? (subtotal * markup) / 100
      : markup;
    
    const total = subtotal + calculatedMarkup;
    
    return {
      frameProfile,
      glass,
      hardware,
      sills,
      mosquitoNet,
      glassFilm,
      installation,
      subtotal,
      markup: calculatedMarkup,
      total
    };
  }, [design, markup, markupType]);

  const handleMarkupChange = (value: number) => {
    setMarkup(value);
    if (onMarkupChange) {
      onMarkupChange(markupType === 'percent' ? value : (value / breakdown.subtotal) * 100);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e3a5f',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        💰 Pricing Breakdown
      </div>

      {/* Profile multiplier info */}
      <div style={{
        background: '#f9fafb',
        border: '1px dashed #e5e7eb',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#555',
        marginBottom: '12px'
      }}>
        Profile: <strong style={{ textTransform: 'capitalize' }}>{profileType}</strong> · Multiplier: <strong>x{(profileMultiplier[profileType] || 1).toFixed(2)}</strong>
      </div>

      {/* Markup Control */}
      <div style={{
        background: '#f8f9fa',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '16px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px'
        }}>
          Markup:
        </div>
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <button
            onClick={() => setMarkupType('percent')}
            style={{
              padding: '6px 12px',
              background: markupType === 'percent' ? '#2196f3' : '#e0e0e0',
              color: markupType === 'percent' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            %
          </button>
          <button
            onClick={() => setMarkupType('fixed')}
            style={{
              padding: '6px 12px',
              background: markupType === 'fixed' ? '#2196f3' : '#e0e0e0',
              color: markupType === 'fixed' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            Fixed
          </button>
          <input
            type="number"
            value={markup}
            onChange={(e) => handleMarkupChange(Number(e.target.value))}
            min="0"
            max={markupType === 'percent' ? 100 : 10000}
            style={{
              flex: 1,
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '13px'
            }}
          />
          <span style={{ fontSize: '12px', color: '#666', minWidth: '40px' }}>
            {markupType === 'percent' ? '%' : 'SAR'}
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div style={{
        fontSize: '12px',
        color: '#666'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          paddingBottom: '6px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <span>Frame Profile:</span>
          <span style={{ fontWeight: '600' }}>{breakdown.frameProfile.toFixed(2)} SAR</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          paddingBottom: '6px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <span>Glass:</span>
          <span style={{ fontWeight: '600' }}>{breakdown.glass.toFixed(2)} SAR</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          paddingBottom: '6px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <span>Hardware:</span>
          <span style={{ fontWeight: '600' }}>{breakdown.hardware.toFixed(2)} SAR</span>
        </div>
        {breakdown.sills > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span>Sills:</span>
            <span style={{ fontWeight: '600' }}>{breakdown.sills.toFixed(2)} SAR</span>
          </div>
        )}
        {breakdown.mosquitoNet > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid #f0e0f0'
          }}>
            <span>Mosquito Net:</span>
            <span style={{ fontWeight: '600' }}>{breakdown.mosquitoNet.toFixed(2)} SAR</span>
          </div>
        )}
        {breakdown.glassFilm > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span>Glass Film:</span>
            <span style={{ fontWeight: '600' }}>{breakdown.glassFilm.toFixed(2)} SAR</span>
          </div>
        )}
        {breakdown.installation > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            paddingBottom: '6px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span>Installation:</span>
            <span style={{ fontWeight: '600' }}>{breakdown.installation.toFixed(2)} SAR</span>
          </div>
        )}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '2px solid #e0e0e0',
          fontSize: '13px',
          fontWeight: '600',
          color: '#333'
        }}>
          <span>Subtotal:</span>
          <span>{breakdown.subtotal.toFixed(2)} SAR</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontSize: '13px',
          color: '#666'
        }}>
          <span>Markup ({markupType === 'percent' ? `${markup}%` : `${markup} SAR`}):</span>
          <span>{breakdown.markup.toFixed(2)} SAR</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '2px solid #2196f3',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#2196f3'
        }}>
          <span>Total:</span>
          <span>{breakdown.total.toFixed(2)} SAR</span>
        </div>
      </div>
    </div>
  );
}

