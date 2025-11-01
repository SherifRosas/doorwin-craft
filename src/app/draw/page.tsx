"use client";
import { useState, useEffect, useRef } from 'react';
import { FunnelEvents } from '@/src/lib/analytics';
import { useToast, ToastContainer } from '@/src/components/Toast';
import { InteractiveCanvas2D } from '@/src/components/designer/InteractiveCanvas2D';
import { Preview3D } from '@/src/components/designer/Preview3D';
import { DesignControls } from '@/src/components/designer/DesignControls';
import { TemplatePicker } from '@/src/components/designer/TemplatePicker';
import { DesignActions } from '@/src/components/designer/DesignActions';
import { HardwareSelector } from '@/src/components/designer/HardwareSelector';
import { ExtendedComponents } from '@/src/components/designer/ExtendedComponents';
import { HistoryManager } from '@/src/components/designer/HistoryManager';
import { ValidationDisplay } from '@/src/components/designer/ValidationDisplay';
import { SizePresets } from '@/src/components/designer/SizePresets';
import { QuickActions } from '@/src/components/designer/QuickActions';
import { QuickGuide } from '@/src/components/designer/QuickGuide';

export type DesignType = 'window' | 'door';

// Window templates
export type WindowTemplate = 
  | 'single'           // Single casement
  | 'double'           // Double casement (two panels)
  | 'sliding'          // Horizontal sliding
  | 'fixed'            // Fixed/picture window
  | 'casement'         // Casement (side-hinged)
  | 'tilt_turn'        // Tilt & turn
  | 'awning'           // Awning (top-hinged, opens outward)
  | 'hopper'           // Hopper (bottom-hinged)
  | 'bay'              // Bay window (3-panel)
  | 'bow'              // Bow window (curved)
  | 'arch'             // Arch/rounded top
  | 'picture'          // Large fixed glass
  | 'jalousie'         // Louvered/slat windows;

// Door templates
export type DoorTemplate =
  | 'single'           // Single door
  | 'double'           // Double doors (French)
  | 'sliding'          // Sliding door
  | 'bifold'           // Bifold door
  | 'pivot'            // Pivot door
  | 'french'           // French doors
  | 'entry'            // Entry door with side panels
  | 'patio'            // Patio door;

export type Template = WindowTemplate | DoorTemplate;

export interface DesignConfig {
  type: DesignType;
  template: Template;
  width: number; // mm
  height: number; // mm
  frameDepth: number; // mm
  material: 'aluminum' | 'wood' | 'upvc';
  glass?: boolean;
  color: string;
  hardware?: {
    handles?: string;
    hinges?: string;
    locks?: string;
  };
  // Extended components (matching PVC Windows Studio features)
  sills?: {
    type?: 'none' | 'flat' | 'profiled' | 'premium';
    material?: 'aluminum' | 'upvc' | 'stone';
    length?: number; // mm (defaults to width)
  };
  mosquitoNet?: {
    type?: 'none' | 'fixed' | 'sliding' | 'retractable';
    material?: 'standard' | 'premium';
  };
  glassFilm?: {
    type?: 'none' | 'privacy' | 'tinting' | 'energy_efficient';
    coverage?: 'full' | 'partial';
  };
  work?: {
    installation?: boolean;
    removal?: boolean;
    customization?: string;
  };
}

export default function DesignerPage() {
  const [design, setDesign] = useState<DesignConfig>({
    type: 'window',
    template: 'single',
    width: 1200,
    height: 1500,
    frameDepth: 50,
    material: 'aluminum',
    glass: true,
    color: '#ffffff',
    hardware: {
      handles: 'standard',
      hinges: 'hidden',
      locks: 'none'
    },
    sills: {
      type: 'none',
      material: 'aluminum',
    },
    mosquitoNet: {
      type: 'none',
      material: 'standard',
    },
    glassFilm: {
      type: 'none',
      coverage: 'full',
    },
    work: {
      installation: false,
      removal: false,
    }
  });

  // Smart defaults based on template
  const getSmartDefaults = (template: Template, type: DesignType): Partial<DesignConfig> => {
    if (type === 'door') {
      const doorDefaults: Record<string, Partial<DesignConfig>> = {
        single: { width: 900, height: 2100 },
        double: { width: 1800, height: 2100 },
        sliding: { width: 2400, height: 2100 },
        bifold: { width: 1200, height: 2100 },
        pivot: { width: 900, height: 2400 },
        french: { width: 1600, height: 2100 },
        entry: { width: 1200, height: 2100 },
        patio: { width: 2400, height: 2100 },
      };
      return doorDefaults[template] || { width: 900, height: 2100 };
    }
    
    // Window defaults
    const windowDefaults: Record<string, Partial<DesignConfig>> = {
      single: { width: 1200, height: 1500 },
      double: { width: 1800, height: 1500 },
      sliding: { width: 2400, height: 1500 },
      fixed: { width: 1200, height: 1500 },
      casement: { width: 1200, height: 1500 },
      tilt_turn: { width: 1200, height: 1500 },
      awning: { width: 1200, height: 1200 },
      hopper: { width: 1200, height: 1200 },
      bay: { width: 3000, height: 1500 }, // 3 panels
      bow: { width: 3600, height: 1500 }, // 5 panels curved
      arch: { width: 1200, height: 1800 }, // Taller for arch
      picture: { width: 2400, height: 1800 }, // Large fixed
      jalousie: { width: 1200, height: 1500 },
    };
    
    return windowDefaults[template] || { width: 1200, height: 1500 };
  };

  const historyManager = useRef(new HistoryManager<DesignConfig>());
  const canvasActionsRef = useRef<{ center?: () => void; fit?: () => void } | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  // Initialize history
  useEffect(() => {
    historyManager.current.push(design);
    // Track designer opened
    FunnelEvents.designer_opened();
    FunnelEvents.design_started(design.template, design.type);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const prevState = historyManager.current.undo();
        if (prevState) setDesign(prevState);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const nextState = historyManager.current.redo();
        if (nextState) setDesign(nextState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateDesign = (updates: Partial<DesignConfig>) => {
    // Apply smart defaults if template or type changes
    if (updates.template && updates.template !== design.template) {
      const smartDefaults = getSmartDefaults(updates.template, updates.type || design.type);
      updates = { ...smartDefaults, ...updates };
      FunnelEvents.design_template_changed(updates.template, updates.type || design.type);
      FunnelEvents.template_selected(updates.template, updates.type || design.type);
    }
    if (updates.type && updates.type !== design.type) {
      const smartDefaults = getSmartDefaults(updates.template || design.template, updates.type);
      updates = { ...smartDefaults, ...updates };
    }
    
    // Track dimension changes
    if (updates.width !== undefined || updates.height !== undefined) {
      FunnelEvents.design_dimensions_changed(
        updates.width || design.width,
        updates.height || design.height
      );
    }
    
    // Track material changes
    if (updates.material && updates.material !== design.material) {
      FunnelEvents.design_material_changed(updates.material);
    }
    
    const newDesign = { ...design, ...updates };
    setDesign(newDesign);
    historyManager.current.push(newDesign);
  };

  const handleQuickAction = (action: string, updates?: Partial<DesignConfig>) => {
    if (action === 'center' && canvasActionsRef.current?.center) {
      canvasActionsRef.current.center();
    } else if (action === 'fit' && canvasActionsRef.current?.fit) {
      canvasActionsRef.current.fit();
    } else if (updates) {
      updateDesign(updates);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 92px)', flexDirection: 'column' }}>
      <div style={{ 
        padding: '12px 24px', 
        borderBottom: '1px solid #ddd', 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6b 100%)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: '#ffffff' }}>DoorWin Designer</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => {
              const prevState = historyManager.current.undo();
              if (prevState) setDesign(prevState);
            }}
            disabled={!historyManager.current.canUndo()}
            style={{
              padding: '6px 12px',
              backgroundColor: historyManager.current.canUndo() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: historyManager.current.canUndo() ? 'pointer' : 'not-allowed',
              fontSize: '12px'
            }}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={() => {
              const nextState = historyManager.current.redo();
              if (nextState) setDesign(nextState);
            }}
            disabled={!historyManager.current.canRedo()}
            style={{
              padding: '6px 12px',
              backgroundColor: historyManager.current.canRedo() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: historyManager.current.canRedo() ? 'pointer' : 'not-allowed',
              fontSize: '12px'
            }}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: '300px', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '16px' }}>
          <QuickGuide />
          <SizePresets 
            design={design} 
            onApply={(preset) => {
              FunnelEvents.quick_size_applied(preset.width, preset.height);
              setDesign((prev) => {
                const updated = { ...prev, width: preset.width, height: preset.height };
                historyManager.current.push(updated);
                FunnelEvents.design_dimensions_changed(preset.width, preset.height);
                return updated;
              });
            }} 
          />
          <QuickActions design={design} onAction={handleQuickAction} />
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Type:
            </label>
            <select
              value={design.type}
              onChange={(e) => updateDesign({ type: e.target.value as DesignType })}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="window">Window</option>
              <option value="door">Door</option>
            </select>
          </div>
          <TemplatePicker design={design} onUpdate={updateDesign} />
          <DesignControls design={design} onUpdate={updateDesign} />
          <ValidationDisplay design={design} />
          <HardwareSelector design={design} onUpdate={updateDesign} />
          <ExtendedComponents design={design} onUpdate={updateDesign} />
          <DesignActions 
            design={design}
            onSaveSuccess={(message) => showToast(message || 'Design saved successfully!', 'success')}
            onSaveError={(error) => showToast(error, 'error')}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid #ddd' }}>
            <InteractiveCanvas2D 
              design={design} 
              onDesignChange={updateDesign}
              onActionsReady={(actions) => {
                canvasActionsRef.current = actions;
              }}
            />
          </div>
          <div style={{ 
            height: '300px', 
            background: 'linear-gradient(to bottom, #f0f0f0 0%, #e8e8e8 100%)',
            borderTop: '1px solid #ddd',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Preview3D design={design} />
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

