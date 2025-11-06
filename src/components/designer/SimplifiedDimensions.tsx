"use client";
import type { DesignConfig } from '@/src/app/draw/page';

interface SimplifiedDimensionsProps {
  design: DesignConfig;
}

export function SimplifiedDimensions({ design }: SimplifiedDimensionsProps) {
  // Calculate panel dimensions for multi-panel windows
  const getPanelDimensions = () => {
    if (design.template === 'double' || design.template === 'french') {
      const panelWidth = Math.floor(design.width / 2);
      return { panelWidth, totalWidth: design.width };
    }
    if (design.template === 'triple') {
      const panelWidth = Math.floor(design.width / 3);
      return { panelWidth, totalWidth: design.width };
    }
    return null;
  };

  const panelInfo = getPanelDimensions();

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #e0e0e0',
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#333',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 10,
      minWidth: '120px'
    }}>
      {/* Overall dimensions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: panelInfo ? '4px' : '0',
        fontWeight: '600'
      }}>
        <span>{design.width}</span>
        <span style={{ color: '#999' }}>×</span>
        <span>{design.height}</span>
        <span style={{ color: '#999', marginLeft: '4px' }}>mm</span>
      </div>
      
      {/* Panel dimensions (for multi-panel) */}
      {panelInfo && (
        <div style={{
          fontSize: '10px',
          color: '#666',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '4px',
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Panel: {panelInfo.panelWidth}mm</span>
        </div>
      )}
    </div>
  );
}





