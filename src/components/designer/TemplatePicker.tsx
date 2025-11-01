"use client";
import type { DesignConfig, Template, WindowTemplate, DoorTemplate } from '@/src/app/draw/page';

const windowTemplates: { id: WindowTemplate; label: string; desc: string; icon?: string }[] = [
  { id: 'single', label: 'Single Casement', desc: 'One opening panel', icon: '⬜' },
  { id: 'double', label: 'Double Casement', desc: 'Two panels with mullion', icon: '⬜⬜' },
  { id: 'sliding', label: 'Sliding', desc: 'Horizontal sliding panels', icon: '↔️' },
  { id: 'fixed', label: 'Fixed/Picture', desc: 'No opening (fixed glass)', icon: '▫️' },
  { id: 'casement', label: 'Casement', desc: 'Side-hinged opening', icon: '⬜' },
  { id: 'tilt_turn', label: 'Tilt & Turn', desc: 'Multi-position opening', icon: '🔄' },
  { id: 'awning', label: 'Awning', desc: 'Top-hinged, opens outward', icon: '⬆️' },
  { id: 'hopper', label: 'Hopper', desc: 'Bottom-hinged opening', icon: '⬇️' },
  { id: 'bay', label: 'Bay Window', desc: '3-panel angled projection', icon: '⏸️' },
  { id: 'bow', label: 'Bow Window', desc: '5-panel curved projection', icon: '🌙' },
  { id: 'arch', label: 'Arch Window', desc: 'Rounded top window', icon: '🏛️' },
  { id: 'picture', label: 'Picture Window', desc: 'Large fixed glass', icon: '🖼️' },
  { id: 'jalousie', label: 'Jalousie', desc: 'Louvered/slat design', icon: '📐' },
];

const doorTemplates: { id: DoorTemplate; label: string; desc: string; icon?: string }[] = [
  { id: 'single', label: 'Single Door', desc: 'Standard single door', icon: '🚪' },
  { id: 'double', label: 'Double Door', desc: 'Two door panels', icon: '🚪🚪' },
  { id: 'sliding', label: 'Sliding Door', desc: 'Horizontal sliding', icon: '↔️' },
  { id: 'bifold', label: 'Bifold Door', desc: 'Folding panels', icon: '📐' },
  { id: 'pivot', label: 'Pivot Door', desc: 'Center pivot opening', icon: '🔄' },
  { id: 'french', label: 'French Doors', desc: 'Double doors with glass', icon: '🏛️' },
  { id: 'entry', label: 'Entry Door', desc: 'Door with side panels', icon: '🚶' },
  { id: 'patio', label: 'Patio Door', desc: 'Large sliding patio door', icon: '🌳' },
];

export function TemplatePicker({ 
  design, 
  onUpdate 
}: { 
  design: DesignConfig; 
  onUpdate: (updates: Partial<DesignConfig>) => void;
}) {
  const templates = design.type === 'window' ? windowTemplates : doorTemplates;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
        {design.type === 'window' ? 'Window Template' : 'Door Template'}
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '8px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {templates.map(t => (
          <label 
            key={t.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '6px',
              background: design.template === t.id ? '#e3f2fd' : '#f9f9f9',
              border: design.template === t.id ? '2px solid #2196f3' : '1px solid #ddd',
              transition: 'all 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (design.template !== t.id) {
                e.currentTarget.style.background = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (design.template !== t.id) {
                e.currentTarget.style.background = '#f9f9f9';
              }
            }}
          >
            <input
              type="radio"
              name="template"
              checked={design.template === t.id}
              onChange={() => onUpdate({ template: t.id as Template })}
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                margin: 0
              }}
            />
            <div style={{ 
              fontSize: '24px', 
              marginBottom: '6px',
              textAlign: 'center'
            }}>
              {t.icon || '⬜'}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px', textAlign: 'center' }}>
              {t.label}
            </div>
            <div style={{ fontSize: '10px', color: '#666', textAlign: 'center', lineHeight: '1.3' }}>
              {t.desc}
            </div>
          </label>
        ))}
      </div>
      <div style={{ 
        marginTop: '12px', 
        padding: '8px', 
        background: '#fff3cd', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#856404'
      }}>
        💡 Tip: Template selection affects default dimensions and pricing
      </div>
    </div>
  );
}
