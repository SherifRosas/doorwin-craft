"use client";
import type { DesignConfig } from '@/src/app/draw/page';

interface Preset {
  name: string;
  width: number;
  height: number;
  description: string;
}

const COMMON_SIZES: Preset[] = [
  { name: 'Small', width: 600, height: 800, description: 'Standard small window' },
  { name: 'Medium', width: 1200, height: 1500, description: 'Most common size' },
  { name: 'Large', width: 1800, height: 2000, description: 'Large window' },
  { name: 'Wide', width: 2400, height: 1200, description: 'Wide horizontal' },
  { name: 'Tall', width: 900, height: 2400, description: 'Tall vertical' },
  { name: 'Standard Door', width: 900, height: 2100, description: 'Standard door size' },
  { name: 'Double Door',
    width: 1800,
    height: 2100,
    description: 'Double door width',
  },
];

export function SizePresets({ design, onApply }: { design: DesignConfig; onApply: (preset: Preset) => void }) {
  return (
    <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        ⚡ Quick Sizes
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {COMMON_SIZES.map((preset) => {
          const isActive = design.width === preset.width && design.height === preset.height;
          return (
       <button
         key={preset.name}
         type="button"
         aria-label={`Apply ${preset.name} size: ${preset.width}×${preset.height}mm`}
         title={preset.description}
         onClick={(e) => {
           e.preventDefault();
           e.stopPropagation();
           onApply(preset);
         }}
              style={{
                padding: '10px 8px',
                border: isActive ? '2px solid #2196f3' : '2px solid #e0e0e0',
                borderRadius: '6px',
                background: isActive ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                boxShadow: isActive ? '0 2px 4px rgba(33,150,243,0.2)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#2196f3';
                  e.currentTarget.style.background = '#f5f9ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = 'white';
                }
              }}
              title={preset.description}
            >
              <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>{preset.name}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>
                {preset.width}×{preset.height}mm
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}



