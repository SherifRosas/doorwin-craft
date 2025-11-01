"use client";
import type { DesignConfig } from '@/src/app/draw/page';

export function HardwareSelector({ 
  design, 
  onUpdate 
}: { 
  design: DesignConfig; 
  onUpdate: (updates: Partial<DesignConfig>) => void;
}) {
  const handleHardwareUpdate = (key: 'handles' | 'hinges' | 'locks', value: string) => {
    onUpdate({
      hardware: {
        ...design.hardware,
        [key]: value
      }
    });
  };

  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #ddd' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Hardware</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Handles:
        </label>
        <select
          value={design.hardware?.handles || 'standard'}
          onChange={(e) => handleHardwareUpdate('handles', e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="minimal">Minimal</option>
          <option value="none">None</option>
        </select>
      </div>

      {design.type === 'door' && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
              Hinges:
            </label>
            <select
              value={design.hardware?.hinges || 'hidden'}
              onChange={(e) => handleHardwareUpdate('hinges', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="hidden">Hidden</option>
              <option value="visible">Visible</option>
              <option value="euro">Euro Hinges</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
              Locks:
            </label>
            <select
              value={design.hardware?.locks || 'none'}
              onChange={(e) => handleHardwareUpdate('locks', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="none">None</option>
              <option value="deadbolt">Deadbolt</option>
              <option value="mortise">Mortise Lock</option>
              <option value="electronic">Electronic</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}




