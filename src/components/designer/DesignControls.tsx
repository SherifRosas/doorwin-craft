"use client";
import type { DesignConfig } from '@/src/app/draw/page';

export function DesignControls({ 
  design, 
  onUpdate 
}: { 
  design: DesignConfig; 
  onUpdate: (updates: Partial<DesignConfig>) => void;
}) {
  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Dimensions (mm)</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '14px' }}>
          <span>Width:</span>
          <span style={{ fontSize: '11px', color: '#666' }} title="Drag handles on canvas to resize">💡 Drag handles</span>
        </label>
        <input
          type="number"
          value={design.width}
          onChange={(e) => onUpdate({ width: Number(e.target.value) })}
          min="300"
          max="3000"
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          title="Width in millimeters (300-3000mm)"
          aria-label="Window width in millimeters"
          aria-describedby="width-help"
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '14px' }}>
          <span>Height:</span>
          <span style={{ fontSize: '11px', color: '#666' }} title="Drag handles on canvas to resize">💡 Drag handles</span>
        </label>
        <input
          type="number"
          value={design.height}
          onChange={(e) => onUpdate({ height: Number(e.target.value) })}
          min="300"
          max="3000"
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          title="Height in millimeters (300-3000mm)"
          aria-label="Window height in millimeters"
          aria-describedby="height-help"
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Material:
        </label>
        <select
          value={design.material}
          onChange={(e) => onUpdate({ material: e.target.value as DesignConfig['material'] })}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="aluminum">Aluminum</option>
          <option value="wood">Wood</option>
          <option value="upvc">uPVC</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={design.glass}
            onChange={(e) => onUpdate({ glass: e.target.checked })}
            style={{ marginRight: '8px' }}
          />
          Include Glass
        </label>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Color:
        </label>
        <input
          type="color"
          value={design.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          style={{ width: '100%', height: '40px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}

