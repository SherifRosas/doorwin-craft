"use client";
import type { DesignConfig, Template } from '@/src/app/draw/page';

interface CompactTemplatePanelProps {
  design: DesignConfig;
  onTemplateChange: (template: Template) => void;
}

export function CompactTemplatePanel({ design, onTemplateChange }: CompactTemplatePanelProps) {
  const isWindow = design.type === 'window';
  
  // Compact button configurations - ALL templates for easy testing
  const windowButtons = [
    { id: 'single', icon: '⬜', label: 'Single', template: 'single' as Template },
    { id: 'double', icon: '⬜⬜', label: 'Double', template: 'double' as Template },
    { id: 'triple', icon: '⬜⬜⬜', label: 'Triple', template: 'triple' as Template },
    { id: 'sliding', icon: '↔', label: 'Sliding', template: 'sliding' as Template },
    { id: 'fixed', icon: '▫️', label: 'Fixed', template: 'fixed' as Template },
    { id: 'casement', icon: '⬜', label: 'Casement', template: 'casement' as Template },
    { id: 'tilt_turn', icon: '🔄', label: 'Tilt&Turn', template: 'tilt_turn' as Template },
    { id: 'awning', icon: '⬆️', label: 'Awning', template: 'awning' as Template },
    { id: 'hopper', icon: '⬇️', label: 'Hopper', template: 'hopper' as Template },
    { id: 'bay', icon: '⏸️', label: 'Bay', template: 'bay' as Template },
    { id: 'bow', icon: '🌙', label: 'Bow', template: 'bow' as Template },
    { id: 'arch', icon: '🏛️', label: 'Arch', template: 'arch' as Template },
    { id: 'picture', icon: '🖼️', label: 'Picture', template: 'picture' as Template },
    { id: 'jalousie', icon: '📐', label: 'Jalousie', template: 'jalousie' as Template },
    { id: 'transom', icon: '⬛', label: 'Transom', template: 'transom' as Template },
    { id: 'skylight', icon: '☀️', label: 'Skylight', template: 'skylight' as Template },
    { id: 'corner', icon: '🔲', label: 'Corner', template: 'corner' as Template },
    { id: 'garden', icon: '🌿', label: 'Garden', template: 'garden' as Template },
    { id: 'storm', icon: '⛈️', label: 'Storm', template: 'storm' as Template },
    { id: 'clerestory', icon: '⬆️⬆️', label: 'Clerestory', template: 'clerestory' as Template },
    { id: 'greenhouse', icon: '🏠', label: 'Greenhouse', template: 'greenhouse' as Template },
  ];

  const doorButtons = [
    { id: 'single', icon: '🚪', label: 'Single', template: 'single' as Template },
    { id: 'double', icon: '🚪🚪', label: 'Double', template: 'double' as Template },
    { id: 'sliding', icon: '↔', label: 'Sliding', template: 'sliding' as Template },
    { id: 'bifold', icon: '📐', label: 'Bifold', template: 'bifold' as Template },
    { id: 'pivot', icon: '🔄', label: 'Pivot', template: 'pivot' as Template },
    { id: 'french', icon: '🏛️', label: 'French', template: 'french' as Template },
    { id: 'entry', icon: '🚶', label: 'Entry', template: 'entry' as Template },
    { id: 'patio', icon: '🌳', label: 'Patio', template: 'patio' as Template },
    { id: 'barn', icon: '🚜', label: 'Barn', template: 'barn' as Template },
    { id: 'pocket', icon: '📥', label: 'Pocket', template: 'pocket' as Template },
    { id: 'accordion', icon: '🪗', label: 'Accordion', template: 'accordion' as Template },
    { id: 'security', icon: '🔒', label: 'Security', template: 'security' as Template },
    { id: 'sliding_panel', icon: '🪟', label: 'SlidingPanel', template: 'sliding_panel' as Template },
    { id: 'louvre', icon: '📋', label: 'Louvre', template: 'louvre' as Template },
  ];

  const buttons = isWindow ? windowButtons : doorButtons;

  return (
    <div style={{
      background: 'transparent',
      padding: '0',
      borderRadius: '0',
      marginBottom: '0',
      border: 'none'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: '600',
        color: '#666',
        marginBottom: '8px',
        padding: '0 4px'
      }}>
        {isWindow ? 'Window Type' : 'Door Type'}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '6px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => onTemplateChange(btn.template)}
            style={{
              padding: '10px 8px',
              background: design.template === btn.template ? '#2196f3' : '#ffffff',
              color: design.template === btn.template ? 'white' : '#333',
              border: design.template === btn.template ? '2px solid #1976d2' : '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: design.template === btn.template ? '600' : '400',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '48px',
              boxShadow: design.template === btn.template ? '0 2px 8px rgba(33,150,243,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (design.template !== btn.template) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (design.template !== btn.template) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            title={btn.label}
          >
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>{btn.icon}</span>
            <span style={{ fontSize: '9px', opacity: 0.9 }}>{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

