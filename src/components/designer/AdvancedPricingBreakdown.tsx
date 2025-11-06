"use client";
import { useMemo } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface AdvancedPricingBreakdownProps {
  design: DesignConfig;
}

interface ComponentPrice {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number; // SAR
  total: number;
  category: 'frame' | 'glass' | 'hardware' | 'sills' | 'nets' | 'works' | 'extras';
}

export function AdvancedPricingBreakdown({ design }: AdvancedPricingBreakdownProps) {
  const components = useMemo<ComponentPrice[]>(() => {
    const items: ComponentPrice[] = [];
    const width = design.width / 1000; // meters
    const height = design.height / 1000; // meters
    const area = (design.width * design.height) / 1_000_000; // m²
    const perimeter = (width + height) * 2; // meters

    // Frame components
    const frameRate = 150; // SAR per meter
    items.push({
      name: 'Frame Profile',
      unit: 'm',
      quantity: perimeter,
      unitPrice: frameRate,
      total: perimeter * frameRate,
      category: 'frame'
    });

    // Impost (for multi-panel windows)
    if (design.template === 'double' || design.template === 'french' || design.template === 'triple') {
      const impostRate = 140; // SAR per meter
      items.push({
        name: 'Impost (Center Mullion)',
        unit: 'm',
        quantity: height,
        unitPrice: impostRate,
        total: height * impostRate,
        category: 'frame'
      });
    }

    // Leaf/Sash profiles (for opening panels)
    if (design.template !== 'fixed' && design.template !== 'picture') {
      const leafRate = 130; // SAR per meter
      const openingPanels = design.template === 'double' || design.template === 'french' ? 2 : 1;
      items.push({
        name: `Leaf Profile${openingPanels > 1 ? 's' : ''}`,
        unit: 'm',
        quantity: perimeter * openingPanels,
        unitPrice: leafRate,
        total: perimeter * openingPanels * leafRate,
        category: 'frame'
      });
    }

    // Rubber sealant
    const sealantRate = 8; // SAR per meter
    items.push({
      name: 'Rubber Sealant',
      unit: 'm',
      quantity: perimeter * 2, // Double for frame and leaf
      unitPrice: sealantRate,
      total: perimeter * 2 * sealantRate,
      category: 'frame'
    });

    // Glass
    if (design.glass) {
      const glassRate = 80; // SAR per m²
      items.push({
        name: 'Glass Panel',
        unit: 'm²',
        quantity: area,
        unitPrice: glassRate,
        total: area * glassRate,
        category: 'glass'
      });
    }

    // Hardware
    if (design.hardware) {
      if (design.hardware.handles && design.hardware.handles !== 'none') {
        const handleCount = (design.template === 'double' || design.template === 'french') ? 2 : 1;
        items.push({
          name: `Handle${handleCount > 1 ? 's' : ''}`,
          unit: 'pcs',
          quantity: handleCount,
          unitPrice: design.hardware.handles === 'premium' ? 50 : 30,
          total: handleCount * (design.hardware.handles === 'premium' ? 50 : 30),
          category: 'hardware'
        });
      }

      if (design.hardware.hinges && design.hardware.hinges !== 'none') {
        const hingeCount = design.type === 'door' ? (design.template === 'double' ? 4 : 2) : 0;
        if (hingeCount > 0) {
          items.push({
            name: 'Hinges',
            unit: 'pcs',
            quantity: hingeCount,
            unitPrice: design.hardware.hinges === 'euro' ? 40 : 25,
            total: hingeCount * (design.hardware.hinges === 'euro' ? 40 : 25),
            category: 'hardware'
          });
        }
      }

      if (design.hardware.locks && design.hardware.locks !== 'none') {
        items.push({
          name: 'Lock',
          unit: 'pcs',
          quantity: 1,
          unitPrice: design.hardware.locks === 'electronic' ? 200 : (design.hardware.locks === 'mortise' ? 80 : 50),
          total: design.hardware.locks === 'electronic' ? 200 : (design.hardware.locks === 'mortise' ? 80 : 50),
          category: 'hardware'
        });
      }
    }

    // Sills
    if (design.sills && design.sills.type !== 'none') {
      const sillLength = (design.sills.length || design.width) / 1000; // meters
      const sillRate = design.sills.type === 'premium' ? 200 : (design.sills.type === 'profiled' ? 120 : 80);
      items.push({
        name: `${design.sills.type === 'premium' ? 'Premium' : design.sills.type === 'profiled' ? 'Profiled' : 'Flat'} ${design.sills.type === 'flat' ? 'Sill' : 'Sill'}`,
        unit: 'm',
        quantity: sillLength,
        unitPrice: sillRate,
        total: sillLength * sillRate,
        category: 'sills'
      });
    }

    // Mosquito Net
    if (design.mosquitoNet && design.mosquitoNet.type !== 'none') {
      const netRate = design.mosquitoNet.type === 'retractable' ? 150 : (design.mosquitoNet.type === 'sliding' ? 80 : 60);
      const materialMultiplier = design.mosquitoNet.material === 'premium' ? 1.5 : 1.0;
      items.push({
        name: `${design.mosquitoNet.type === 'retractable' ? 'Retractable' : design.mosquitoNet.type === 'sliding' ? 'Sliding' : 'Fixed'} Mosquito Net`,
        unit: 'm²',
        quantity: area,
        unitPrice: netRate * materialMultiplier,
        total: area * netRate * materialMultiplier,
        category: 'nets'
      });
    }

    // Glass Film
    if (design.glassFilm && design.glassFilm.type !== 'none') {
      const filmRate = design.glassFilm.type === 'energy_efficient' ? 100 : (design.glassFilm.type === 'tinting' ? 50 : 40);
      const coverage = design.glassFilm.coverage === 'full' ? 1 : 0.5;
      items.push({
        name: `${design.glassFilm.type === 'energy_efficient' ? 'Energy Efficient' : design.glassFilm.type === 'tinting' ? 'Tinting' : 'Privacy'} Glass Film`,
        unit: 'm²',
        quantity: area * coverage,
        unitPrice: filmRate,
        total: area * coverage * filmRate,
        category: 'extras'
      });
    }

    // Installation Works
    if (design.work?.installation) {
      items.push({
        name: 'Installation',
        unit: 'job',
        quantity: 1,
        unitPrice: 300,
        total: 300,
        category: 'works'
      });
    }

    if (design.work?.removal) {
      items.push({
        name: 'Old Window Removal',
        unit: 'job',
        quantity: 1,
        unitPrice: 100,
        total: 100,
        category: 'works'
      });
    }

    return items;
  }, [design]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    components.forEach(item => {
      totals[item.category] = (totals[item.category] || 0) + item.total;
    });
    return totals;
  }, [components]);

  const grandTotal = useMemo(() => {
    return components.reduce((sum, item) => sum + item.total, 0);
  }, [components]);

  const categories = [
    { id: 'frame', name: 'Frame Components', color: '#2196f3' },
    { id: 'glass', name: 'Glass', color: '#4caf50' },
    { id: 'hardware', name: 'Hardware', color: '#ff9800' },
    { id: 'sills', name: 'Sills', color: '#9c27b0' },
    { id: 'nets', name: 'Mosquito Nets', color: '#00bcd4' },
    { id: 'extras', name: 'Extras', color: '#607d8b' },
    { id: 'works', name: 'Installation Works', color: '#795548' },
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      fontSize: '13px'
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
        📊 Detailed Component Breakdown
      </div>

      {categories.map(category => {
        const categoryItems = components.filter(item => item.category === category.id);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id} style={{
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: category.color,
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: category.color
              }} />
              {category.name}
            </div>
            <div style={{
              background: '#f8f9fa',
              borderRadius: '6px',
              padding: '8px',
              fontSize: '12px'
            }}>
              {categoryItems.map((item, idx) => (
                <div key={idx} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '8px',
                  padding: '4px 0',
                  borderBottom: idx < categoryItems.length - 1 ? '1px solid #e0e0e0' : 'none',
                  alignItems: 'center'
                }}>
                  <div>{item.name}</div>
                  <div style={{ textAlign: 'right', color: '#666' }}>{item.quantity.toFixed(2)} {item.unit}</div>
                  <div style={{ textAlign: 'right', color: '#666' }}>{item.unitPrice.toFixed(2)} SAR</div>
                  <div style={{ textAlign: 'right', fontWeight: '600' }}>{item.total.toFixed(2)} SAR</div>
                </div>
              ))}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #e0e0e0',
                fontWeight: '600'
              }}>
                <span>Subtotal:</span>
                <span style={{ color: category.color }}>{categoryTotals[category.id]?.toFixed(2) || '0.00'} SAR</span>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '2px solid #2196f3',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f' }}>
          Grand Total:
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>
          {grandTotal.toFixed(2)} SAR
        </div>
      </div>
    </div>
  );
}





