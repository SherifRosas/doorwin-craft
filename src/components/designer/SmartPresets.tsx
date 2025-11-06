"use client";
import type { DesignConfig } from '@/src/app/draw/page';

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  config: Partial<DesignConfig>;
}

const PRESETS: Preset[] = [
  {
    id: 'standard-window',
    name: 'Standard Window',
    description: 'Most common residential window',
    icon: '🪟',
    config: {
      type: 'window',
      template: 'single',
      width: 1200,
      height: 1500,
      material: 'aluminum',
      glass: true,
      color: '#ffffff',
      hardware: {
        handles: 'standard',
        hinges: 'hidden',
        locks: 'none'
      }
    }
  },
  {
    id: 'premium-door',
    name: 'Premium Door',
    description: 'High-end door with premium hardware',
    icon: '🚪',
    config: {
      type: 'door',
      template: 'single',
      width: 900,
      height: 2100,
      material: 'wood',
      glass: true,
      color: '#8B4513',
      hardware: {
        handles: 'premium',
        hinges: 'euro',
        locks: 'mortise'
      }
    }
  },
  {
    id: 'budget-window',
    name: 'Budget Window',
    description: 'Economical uPVC option',
    icon: '💰',
    config: {
      type: 'window',
      template: 'single',
      width: 1000,
      height: 1200,
      material: 'upvc',
      glass: true,
      color: '#ffffff',
      hardware: {
        handles: 'standard',
        hinges: 'hidden',
        locks: 'none'
      }
    }
  },
  {
    id: 'sliding-door',
    name: 'Sliding Patio',
    description: 'Large sliding patio door',
    icon: '🌳',
    config: {
      type: 'door',
      template: 'patio',
      width: 2400,
      height: 2100,
      material: 'aluminum',
      glass: true,
      color: '#E8E8E8',
      hardware: {
        handles: 'standard',
        hinges: 'hidden',
        locks: 'none'
      }
    }
  },
  {
    id: 'double-window',
    name: 'Double Window',
    description: 'Two-panel casement window',
    icon: '⬜⬜',
    config: {
      type: 'window',
      template: 'double',
      width: 1800,
      height: 1500,
      material: 'aluminum',
      glass: true,
      color: '#ffffff',
      hardware: {
        handles: 'standard',
        hinges: 'hidden',
        locks: 'none'
      }
    }
  }
];

interface SmartPresetsProps {
  onApply: (preset: Partial<DesignConfig>) => void;
}

export function SmartPresets({ onApply }: SmartPresetsProps) {
  return (
    <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ⚡ Smart Presets
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px'
      }}>
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApply(preset.config)}
            style={{
              padding: '12px 10px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2196f3';
              e.currentTarget.style.background = '#f5f9ff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(33,150,243,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{preset.icon}</div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>
              {preset.name}
            </div>
            <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.3' }}>
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}





