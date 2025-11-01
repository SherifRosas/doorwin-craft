"use client";
import { useState } from 'react';

const tips = [
  "💡 Drag the blue handles on canvas to resize",
  "💡 Use Quick Sizes above for common dimensions",
  "🖱️ 3D Preview: Left-click + drag to rotate",
  "🔍 3D Preview: Scroll to zoom in/out",
  "📐 3D Preview: Right-click + drag to pan",
  "💡 Templates auto-adjust to smart defaults",
  "💡 Ctrl+Z to undo, Ctrl+Y to redo",
  "👁️ Watch 3D preview update as you change design",
];

export function QuickGuide() {
  const [showTips, setShowTips] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);

  if (!showTips) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      fontSize: '13px',
      position: 'relative'
    }}>
      <button
        onClick={() => setShowTips(false)}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
        title="Close tips"
      >
        ×
      </button>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
        Quick Tips:
      </div>
      <div style={{ marginBottom: '8px' }}>
        {tips[currentTip]}
      </div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        {tips.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTip(idx)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: currentTip === idx ? 'white' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}



