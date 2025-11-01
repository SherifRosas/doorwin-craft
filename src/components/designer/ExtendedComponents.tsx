"use client";
import type { DesignConfig } from '@/src/app/draw/page';

export function ExtendedComponents({ 
  design, 
  onUpdate 
}: { 
  design: DesignConfig; 
  onUpdate: (updates: Partial<DesignConfig>) => void;
}) {
  const updateSills = (key: 'type' | 'material', value: string) => {
    onUpdate({
      sills: {
        ...design.sills,
        [key]: value,
        ...(key === 'type' && value !== 'none' && !design.sills?.length 
          ? { length: design.width } 
          : {})
      }
    });
  };

  const updateMosquitoNet = (key: 'type' | 'material', value: string) => {
    onUpdate({
      mosquitoNet: {
        ...design.mosquitoNet,
        [key]: value
      }
    });
  };

  const updateGlassFilm = (key: 'type' | 'coverage', value: string) => {
    onUpdate({
      glassFilm: {
        ...design.glassFilm,
        [key]: value
      }
    });
  };

  const updateWork = (key: 'installation' | 'removal' | 'customization', value: boolean | string) => {
    onUpdate({
      work: {
        ...design.work,
        [key]: value
      }
    });
  };

  return (
    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #ddd' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Extended Components</h3>

      {/* Window Sills */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Window Sill:
        </label>
        <select
          value={design.sills?.type || 'none'}
          onChange={(e) => updateSills('type', e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}
        >
          <option value="none">None</option>
          <option value="flat">Flat</option>
          <option value="profiled">Profiled</option>
          <option value="premium">Premium</option>
        </select>
        {design.sills?.type && design.sills.type !== 'none' && (
          <>
            <select
              value={design.sills?.material || 'aluminum'}
              onChange={(e) => updateSills('material', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="aluminum">Aluminum</option>
              <option value="upvc">uPVC</option>
              <option value="stone">Stone</option>
            </select>
            <div style={{ marginTop: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
                Length (mm):
              </label>
              <input
                type="number"
                value={design.sills?.length || design.width}
                onChange={(e) => onUpdate({
                  sills: { ...design.sills, length: Number(e.target.value) }
                })}
                min="300"
                max="5000"
                style={{ width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
              />
            </div>
          </>
        )}
      </div>

      {/* Mosquito Net */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Mosquito Net:
        </label>
        <select
          value={design.mosquitoNet?.type || 'none'}
          onChange={(e) => updateMosquitoNet('type', e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}
        >
          <option value="none">None</option>
          <option value="fixed">Fixed</option>
          <option value="sliding">Sliding</option>
          <option value="retractable">Retractable</option>
        </select>
        {design.mosquitoNet?.type && design.mosquitoNet.type !== 'none' && (
          <select
            value={design.mosquitoNet?.material || 'standard'}
            onChange={(e) => updateMosquitoNet('material', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
        )}
      </div>

      {/* Glass Film */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
          Glass Film:
        </label>
        <select
          value={design.glassFilm?.type || 'none'}
          onChange={(e) => updateGlassFilm('type', e.target.value)}
          style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}
        >
          <option value="none">None</option>
          <option value="privacy">Privacy</option>
          <option value="tinting">Tinting</option>
          <option value="energy_efficient">Energy Efficient</option>
        </select>
        {design.glassFilm?.type && design.glassFilm.type !== 'none' && (
          <select
            value={design.glassFilm?.coverage || 'full'}
            onChange={(e) => updateGlassFilm('coverage', e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="full">Full Coverage</option>
            <option value="partial">Partial Coverage</option>
          </select>
        )}
      </div>

      {/* Work/Installation */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
          Work & Installation:
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
          <input
            type="checkbox"
            checked={design.work?.installation || false}
            onChange={(e) => updateWork('installation', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '13px' }}>Installation Service (+200 SAR)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={design.work?.removal || false}
            onChange={(e) => updateWork('removal', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '13px' }}>Removal Service (+100 SAR)</span>
        </label>
      </div>
    </div>
  );
}


