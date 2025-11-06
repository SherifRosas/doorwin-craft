"use client";
import type { DesignConfig, Template, WindowTemplate, DoorTemplate } from '@/src/app/draw/page';

const windowTemplates: { id: WindowTemplate; label: string; desc: string; icon?: string }[] = [
  { id: 'single', label: 'Single Casement', desc: 'One opening panel, side-hinged, swings outward for easy cleaning and ventilation', icon: '⬜' },
  { id: 'double', label: 'Double Casement', desc: 'Two panels with center mullion, both panels swing open for maximum ventilation', icon: '⬜⬜' },
  { id: 'triple', label: 'Triple Casement', desc: 'Three panels with dual mullions, ideal for wide openings with maximum light', icon: '⬜⬜⬜' },
  { id: 'sliding', label: 'Sliding Window', desc: 'Horizontal sliding panels, space-saving design perfect for modern architecture', icon: '↔️' },
  { id: 'fixed', label: 'Fixed/Picture', desc: 'Non-opening glass panel, maximum light with no ventilation, ideal for high areas', icon: '▫️' },
  { id: 'casement', label: 'Casement', desc: 'Side-hinged opening mechanism, swings outward like a door, excellent for catching breezes', icon: '⬜' },
  { id: 'tilt_turn', label: 'Tilt & Turn', desc: 'Multi-position opening: tilt inwards for ventilation or fully open by turning', icon: '🔄' },
  { id: 'awning', label: 'Awning', desc: 'Top-hinged, opens outward upward, provides ventilation even during rain, perfect for bathrooms', icon: '⬆️' },
  { id: 'hopper', label: 'Hopper', desc: 'Bottom-hinged, opens inward at bottom, excellent for basement or lower-level installations', icon: '⬇️' },
  { id: 'bay', label: 'Bay Window', desc: 'Three-panel angled projection, creates interior alcove space, adds architectural interest', icon: '⏸️' },
  { id: 'bow', label: 'Bow Window', desc: 'Five-panel curved projection, elegant curved appearance, creates spacious interior', icon: '🌙' },
  { id: 'arch', label: 'Arch Window', desc: 'Rounded top window, classic architectural design, adds elegance to traditional homes', icon: '🏛️' },
  { id: 'picture', label: 'Picture Window', desc: 'Large fixed glass panel, unobstructed views, maximum natural light, no ventilation', icon: '🖼️' },
  { id: 'jalousie', label: 'Jalousie', desc: 'Horizontal louvered slats that rotate, adjustable ventilation control, tropical style', icon: '📐' },
  { id: 'transom', label: 'Transom Window', desc: 'Wide horizontal window above doors or windows, adds light and ventilation at ceiling height', icon: '⬛' },
  { id: 'skylight', label: 'Skylight', desc: 'Roof window for overhead natural light, transforms interior spaces, energy-efficient daylighting', icon: '☀️' },
  { id: 'corner', label: 'Corner Window', desc: 'L-shaped installation spanning corner, unique architectural feature, panoramic corner views', icon: '🔲' },
  { id: 'garden', label: 'Garden Window', desc: 'Projecting bay-style window, creates shelf space for plants, perfect for kitchens', icon: '🌿' },
  { id: 'storm', label: 'Storm Window', desc: 'Double-pane weather protection, reduces heat loss, provides insulation and weather resistance', icon: '⛈️' },
  { id: 'clerestory', label: 'Clerestory', desc: 'High horizontal window near ceiling, provides privacy while allowing natural light', icon: '⬆️⬆️' },
  { id: 'greenhouse', label: 'Greenhouse Window', desc: 'Full-glass design with grid pattern, maximum light transmission, ideal for plant growth', icon: '🏠' },
];

const doorTemplates: { id: DoorTemplate; label: string; desc: string; icon?: string }[] = [
  { id: 'single', label: 'Single Door', desc: 'Standard single-panel door, traditional design, most common entry door style', icon: '🚪' },
  { id: 'double', label: 'Double Door', desc: 'Two door panels, wider opening, grand entrance, perfect for main entryways', icon: '🚪🚪' },
  { id: 'sliding', label: 'Sliding Door', desc: 'Horizontal sliding mechanism, space-saving design, ideal for patios and closets', icon: '↔️' },
  { id: 'bifold', label: 'Bifold Door', desc: 'Folding panels that accordion-style, perfect for closets and room dividers', icon: '📐' },
  { id: 'pivot', label: 'Pivot Door', desc: 'Center pivot opening, modern design, rotates around center axis for dramatic entrance', icon: '🔄' },
  { id: 'french', label: 'French Doors', desc: 'Double doors with glass panes, elegant design, connects indoor and outdoor spaces', icon: '🏛️' },
  { id: 'entry', label: 'Entry Door', desc: 'Main door with side panels (sidelights), creates grand entrance, maximum natural light', icon: '🚶' },
  { id: 'patio', label: 'Patio Door', desc: 'Large sliding glass door, seamless indoor-outdoor connection, panoramic views', icon: '🌳' },
  { id: 'barn', label: 'Barn Door', desc: 'Sliding track-mounted door, rustic industrial style, space-efficient, perfect for modern interiors', icon: '🚜' },
  { id: 'pocket', label: 'Pocket Door', desc: 'Slides completely into wall cavity, maximizes space, perfect for tight areas', icon: '📥' },
  { id: 'accordion', label: 'Accordion Door', desc: 'Multiple folding panels, flexible room division, space-saving design', icon: '🪗' },
  { id: 'security', label: 'Security Door', desc: 'Reinforced construction, enhanced protection, heavy-duty frame and locking system', icon: '🔒' },
  { id: 'sliding_panel', label: 'Sliding Panel Door', desc: 'Multiple glass panels that slide, modern aesthetic, allows light flow', icon: '🪟' },
  { id: 'louvre', label: 'Louvre Door', desc: 'Horizontal louvered slats, adjustable ventilation, classic design for closets and pantries', icon: '📋' },
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
