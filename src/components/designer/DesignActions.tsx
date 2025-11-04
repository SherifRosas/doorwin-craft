"use client";
import { useState } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';
import { FunnelEvents } from '@/src/lib/analytics';
import { LoadingButton } from '@/src/components/LoadingSpinner';
import { MaterialBreakdown } from '@/src/components/designer/MaterialBreakdown';

interface DesignActionsProps {
  design: DesignConfig;
  onSaveSuccess?: (message?: string) => void;
  onSaveError?: (error: string) => void;
  onPriceCalculated?: (price: number) => void;
}

export function DesignActions({ design, onSaveSuccess, onSaveError, onPriceCalculated }: DesignActionsProps) {
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  const calculatePrice = async () => {
    const area = (design.width * design.height) / 1_000_000; // m²
    const basePrice = area * 500; // 500 SAR per m² base
    const materialMultiplier = { aluminum: 1.0, wood: 1.5, upvc: 0.8 };
    
    // Extended template multipliers for all templates
    const templateMultiplier: Record<string, number> = {
      // Windows
      single: 1.0,
      double: 1.3,
      sliding: 1.2,
      fixed: 0.9,
      casement: 1.0,
      tilt_turn: 1.15,
      awning: 1.05,
      hopper: 1.05,
      bay: 1.8,
      bow: 2.2,
      arch: 1.25,
      picture: 1.1,
      jalousie: 0.95,
      // Doors
      bifold: 1.4,
      pivot: 1.2,
      french: 1.6,
      entry: 1.3,
      patio: 1.5,
    };
    
    // Hardware costs
    const hardwareCost = 
      (design.hardware?.handles === 'premium' ? 50 : design.hardware?.handles === 'minimal' ? 20 : 30) +
      (design.hardware?.hinges === 'euro' ? 40 : design.hardware?.hinges === 'visible' ? 25 : 15) +
      (design.hardware?.locks === 'electronic' ? 200 : design.hardware?.locks === 'mortise' ? 80 : design.hardware?.locks === 'deadbolt' ? 50 : 0);
    
    // Window sills cost (per meter)
    const sillLength = design.sills?.length || design.width;
    const sillLengthM = sillLength / 1000; // Convert to meters
    const sillCosts: Record<string, number> = {
      none: 0,
      flat: 80 * sillLengthM, // 80 SAR per meter
      profiled: 120 * sillLengthM,
      premium: 200 * sillLengthM,
    };
    const sillMaterialMultiplier: Record<string, number> = {
      aluminum: 1.0,
      upvc: 0.8,
      stone: 2.0,
    };
    const sillsCost = (sillCosts[design.sills?.type || 'none'] || 0) * 
      (sillMaterialMultiplier[design.sills?.material || 'aluminum'] || 1);
    
    // Mosquito net cost
    const netArea = area; // Same area as window
    const netCosts: Record<string, number> = {
      none: 0,
      fixed: 60 * netArea, // 60 SAR per m²
      sliding: 80 * netArea,
      retractable: 150 * netArea,
    };
    const netMaterialMultiplier: Record<string, number> = {
      standard: 1.0,
      premium: 1.5,
    };
    const mosquitoNetCost = (netCosts[design.mosquitoNet?.type || 'none'] || 0) *
      (netMaterialMultiplier[design.mosquitoNet?.material || 'standard'] || 1);
    
    // Glass film cost
    const filmCosts: Record<string, number> = {
      none: 0,
      privacy: 40 * area, // 40 SAR per m²
      tinting: 50 * area,
      energy_efficient: 100 * area,
    };
    const filmCoverageMultiplier: Record<string, number> = {
      full: 1.0,
      partial: 0.5,
    };
    const glassFilmCost = (filmCosts[design.glassFilm?.type || 'none'] || 0) *
      (filmCoverageMultiplier[design.glassFilm?.coverage || 'full'] || 1);
    
    // Work costs (installation, removal)
    const installationCost = design.work?.installation ? 200 : 0; // Base installation cost
    const removalCost = design.work?.removal ? 100 : 0; // Base removal cost
    const workCost = installationCost + removalCost;
    
    // Profile multipliers
    const profileMultiplier: Record<string, number> = {
      square: 1.0,
      chamfer: 1.05,
      ovolo: 1.08,
      round: 1.1,
    };
    const pType = (design as any).profileType || 'square';

    // Calculate total
    const windowCost = basePrice * 
      (materialMultiplier[design.material] || 1) * 
      (templateMultiplier[design.template] || 1) *
      (profileMultiplier[pType] || 1) +
      (design.glass ? 100 : 0) +
      hardwareCost;
    
    const total = windowCost + sillsCost + mosquitoNetCost + glassFilmCost + workCost;
    const finalPrice = Math.round(total);

    setPrice(finalPrice);
    
    // Notify parent component of calculated price
    if (onPriceCalculated) {
      onPriceCalculated(finalPrice);
    }
    
    // Track price calculation
    const components = [];
    if (sillsCost > 0) components.push('sills');
    if (mosquitoNetCost > 0) components.push('mosquito_net');
    if (glassFilmCost > 0) components.push('glass_film');
    if (workCost > 0) components.push('work');
    if (design.glass) components.push('glass');
    if (hardwareCost > 0) components.push('hardware');
    
    FunnelEvents.design_price_calculated(finalPrice, components);
  };

  const saveDesign = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-org-id': 'default-org',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: `${design.type} ${design.width}x${design.height}mm`,
          config: design,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        FunnelEvents.design_saved(data.id);
        onSaveSuccess?.();
      } else {
        const errorText = 'Failed to save design';
        onSaveError?.(errorText);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving design');
    } finally {
      setSaving(false);
    }
  };

  const exportImage = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      onSaveError?.('Canvas not found');
      return;
    }
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `doorwin-design-${Date.now()}.png`;
    link.href = url;
    link.click();
    FunnelEvents.design_exported('png');
    onSaveSuccess?.('Image exported successfully!');
  };

  const exportJSON = () => {
    try {
      const dataStr = JSON.stringify(design, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `doorwin-design-${Date.now()}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      FunnelEvents.design_exported('json');
      onSaveSuccess?.('Design exported as JSON!');
    } catch (error) {
      onSaveError?.('Failed to export JSON');
    }
  };

  const [calculating, setCalculating] = useState(false);

  const handleCalculatePrice = async () => {
    setCalculating(true);
    try {
      await calculatePrice();
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #ddd' }}>
      <LoadingButton
        loading={calculating}
        onClick={handleCalculatePrice}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '8px',
          fontSize: '14px',
        }}
      >
        Calculate Price
      </LoadingButton>

      {price !== null && (
        <>
          <div style={{ 
            padding: '12px', 
            background: '#f0f0f0', 
            borderRadius: '4px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
              {price} SAR
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              (Excluding 15% VAT)
            </div>
          </div>
          <MaterialBreakdown design={design} />
        </>
      )}

      <LoadingButton
        data-save-button="true"
        loading={saving}
        onClick={saveDesign}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '8px',
          fontSize: '14px',
        }}
      >
        Save Design
      </LoadingButton>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={exportImage}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Export PNG
        </button>
        <button
          onClick={exportJSON}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}

