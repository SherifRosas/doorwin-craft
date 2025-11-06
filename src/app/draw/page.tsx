"use client";
import { useState, useEffect, useRef } from 'react';
import { FunnelEvents } from '@/src/lib/analytics';
import { useToast, ToastContainer } from '@/src/components/Toast';
import { InteractiveCanvas2D } from '@/src/components/designer/InteractiveCanvas2D';
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
import { SmartGuidance } from '@/src/components/designer/SmartGuidance';
import { CompactTemplatePanel } from '@/src/components/designer/CompactTemplatePanel';
import { SimplifiedDimensions } from '@/src/components/designer/SimplifiedDimensions';
import { MaterialBreakdown } from '@/src/components/designer/MaterialBreakdown';
import { SmartPresets } from '@/src/components/designer/SmartPresets';
import { QuickQuoteWizard } from '@/src/components/designer/QuickQuoteWizard';
import { CollapsibleSection } from '@/src/components/designer/CollapsibleSection';
import { Preview3D } from '@/src/components/designer/Preview3D';
import { ProfilePresets } from '@/src/components/designer/ProfilePresets';
import { PricingPanel } from '@/src/components/designer/PricingPanel';
import { AdvancedPricingBreakdown } from '@/src/components/designer/AdvancedPricingBreakdown';
import { PhotoVisualizer } from '@/src/components/designer/PhotoVisualizer';
import { QuoteExport } from '@/src/components/designer/QuoteExport';
import { AndroidControlPanel } from '@/src/components/designer/AndroidControlPanel';
import { useRouter } from 'next/navigation';

export type DesignType = 'window' | 'door';

// Window templates
export type WindowTemplate = 
  | 'single'           // Single casement
  | 'double'           // Double casement (two panels)
  | 'triple'           // Triple casement (three panels)
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
  | 'jalousie'         // Louvered/slat windows
  | 'transom'          // Transom window (above door)
  | 'skylight'         // Skylight (roof window)
  | 'corner'           // Corner window
  | 'garden'           // Garden window (projection)
  | 'storm'            // Storm window
  | 'clerestory'       // Clerestory (high window)
  | 'greenhouse';      // Greenhouse window;

// Door templates
export type DoorTemplate =
  | 'single'           // Single door
  | 'double'           // Double doors (French)
  | 'sliding'          // Sliding door
  | 'bifold'           // Bifold door
  | 'pivot'            // Pivot door
  | 'french'           // French doors
  | 'entry'            // Entry door with side panels
  | 'patio'            // Patio door
  | 'barn'             // Barn door (sliding track)
  | 'pocket'           // Pocket door (slides into wall)
  | 'accordion'        // Accordion door
  | 'security'         // Security door
  | 'sliding_panel'    // Sliding panel door
  | 'louvre';          // Louvre door;

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
  profileType?: 'ovolo' | 'chamfer' | 'round' | 'square';
}

export default function DesignerPage() {
  const historyManager = useRef(new HistoryManager<DesignConfig>());
  const canvasActionsRef = useRef<{ 
    center?: () => void; 
    fit?: () => void; 
    exportAsImage?: () => string | null;
    panBy?: (dx: number, dy: number) => void;
    setGrid?: (show: boolean) => void;
  } | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default on mobile
  const [isMobile, setIsMobile] = useState(false);
  // Always start with false to ensure server and client render the same
  const [mounted, setMounted] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d'); // Toggle between 2D and 3D
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Ensure client-side only rendering for iOS
  // This effect only runs on the client, ensuring hydration matches
  useEffect(() => {
    setMounted(true);
    
    // Check for test design from test page
    const testParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('test') : null;
    if (testParam && mounted) {
      const testDesign = localStorage.getItem('testDesign');
      if (testDesign) {
        try {
          const parsed = JSON.parse(testDesign);
          if (parsed.type && parsed.template) {
            setDesign(prev => ({ ...prev, ...parsed }));
            showToast(`Test template loaded: ${parsed.type} - ${parsed.template}`, 'info');
          }
        } catch (e) {
          console.error('Failed to load test design:', e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);
  
  // Check if mobile - with error handling for iOS
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const checkMobile = () => {
        try {
          setIsMobile(window.innerWidth < 768);
        } catch (e) {
          console.error('Error checking mobile:', e);
          setIsMobile(false); // Fallback to desktop
        }
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => {
        try {
          window.removeEventListener('resize', checkMobile);
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    } catch (e) {
      console.error('Error setting up mobile detection:', e);
    }
  }, []);

  // Enable touch scrolling on sidebar - Android-specific fix
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile) return;

    try {
      if (sidebarOpen && sidebarRef.current) {
      const sidebar = sidebarRef.current;
      
      // Prevent body scroll when sidebar is open
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Force Android to recognize scrollable area
      // Check if content overflows
      const checkScroll = () => {
        if (sidebar.scrollHeight > sidebar.clientHeight) {
          sidebar.style.overflowY = 'scroll';
          // Force reflow to trigger scrollbar
          void sidebar.offsetHeight;
        }
      };
      
      // Check immediately and after a short delay
      checkScroll();
      const timeout = setTimeout(checkScroll, 100);
      
      // Also check on resize
      window.addEventListener('resize', checkScroll);
      
        return () => {
          try {
            clearTimeout(timeout);
            window.removeEventListener('resize', checkScroll);
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
          } catch (e) {
            console.error('Error cleaning up sidebar scroll:', e);
          }
        };
      } else {
        // Restore body scroll when sidebar closes
        try {
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
        } catch (e) {
          console.error('Error restoring body scroll:', e);
        }
      }

      return () => {
        try {
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    } catch (e) {
      console.error('Error in sidebar scroll effect:', e);
    }
  }, [isMobile, sidebarOpen]);
  
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
        barn: { width: 1200, height: 2100 },
        pocket: { width: 900, height: 2100 },
        accordion: { width: 1800, height: 2100 },
        security: { width: 900, height: 2100 },
        sliding_panel: { width: 1800, height: 2100 },
        louvre: { width: 900, height: 2100 },
      };
      return doorDefaults[template] || { width: 900, height: 2100 };
    }
    
    // Window defaults
    const windowDefaults: Record<string, Partial<DesignConfig>> = {
      single: { width: 1200, height: 1500 },
      double: { width: 1800, height: 1500 },
      triple: { width: 2400, height: 1500 },
      transom: { width: 1200, height: 600 },
      skylight: { width: 1000, height: 1000 },
      corner: { width: 1500, height: 1500 },
      garden: { width: 1200, height: 1200 },
      storm: { width: 1200, height: 1500 },
      clerestory: { width: 1800, height: 800 },
      greenhouse: { width: 2000, height: 1800 },
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

  // Initialize history - with error handling
  useEffect(() => {
    try {
      historyManager.current.push(design);
      // Track designer opened
      if (typeof window !== 'undefined') {
        try {
          FunnelEvents.designer_opened();
          FunnelEvents.design_started(design.template, design.type);
        } catch (e) {
          console.warn('Analytics error (non-blocking):', e);
        }
      }
    } catch (e) {
      console.error('Error initializing history:', e);
    }
  }, [design]);

  // Keyboard shortcuts - with error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const handleKeyDown = (e: KeyboardEvent) => {
        try {
          if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            const prevState = historyManager.current.undo();
            if (prevState) setDesign(prevState);
          } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
            e.preventDefault();
            const nextState = historyManager.current.redo();
            if (nextState) setDesign(nextState);
          }
        } catch (e) {
          console.error('Error in keyboard handler:', e);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        try {
          window.removeEventListener('keydown', handleKeyDown);
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    } catch (e) {
      console.error('Error setting up keyboard shortcuts:', e);
    }
  }, []);

  // Save design to localStorage for preview page access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('currentDesign', JSON.stringify(design));
      } catch (e) {
        console.error('Error saving design to localStorage:', e);
      }
    }
  }, [design]);

  const updateDesign = (updates: Partial<DesignConfig>) => {
    // Apply smart defaults if template or type changes
    if (updates.template && updates.template !== design.template) {
      const template = updates.template;
      const type = updates.type || design.type;
      const smartDefaults = getSmartDefaults(template, type);
      updates = { ...smartDefaults, ...updates };
      FunnelEvents.design_template_changed(template, type);
      FunnelEvents.template_selected(template, type);
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

  // Don't render until mounted (prevents SSR/hydration issues on iOS)
  // Server and client will both render this loading state initially, preventing hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        height: 'calc(100vh - 92px)',
        fontSize: '16px',
        color: '#666'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #2196f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          WebkitAnimation: 'spin 1s linear infinite'
        }} />
        <div>Loading designer...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: isMobile ? 'calc(100dvh - 92px)' : 'calc(100vh - 92px)', // Use dvh for modern devices, fallback handled in CSS
      flexDirection: 'column',
      overflow: 'visible',
      WebkitOverflowScrolling: 'touch',
      position: 'relative'
    }}>
      {/* Android-style Header */}
      <div style={{ 
        padding: isMobile ? '10px 12px' : '12px 16px', 
        borderBottom: '1px solid #1a2f4a', 
        background: 'linear-gradient(180deg, #2d4a6b 0%, #1e3a5f 100%)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        flexWrap: 'nowrap',
        gap: '8px'
      }}>
        {/* Left: Template Icon Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            padding: '8px',
            background: '#4a90e2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
          title="Templates"
        >
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }}></div>
            <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }}></div>
          </div>
        </button>

        {/* Center: Undo/Redo Buttons */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => {
              const prevState = historyManager.current.undo();
              if (prevState) setDesign(prevState);
            }}
            disabled={!historyManager.current.canUndo()}
            style={{
              padding: '6px 10px',
              backgroundColor: historyManager.current.canUndo() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: historyManager.current.canUndo() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              opacity: historyManager.current.canUndo() ? 1 : 0.5
            }}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={() => {
              const nextState = historyManager.current.redo();
              if (nextState) setDesign(nextState);
            }}
            disabled={!historyManager.current.canRedo()}
            style={{
              padding: '6px 10px',
              backgroundColor: historyManager.current.canRedo() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: historyManager.current.canRedo() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              opacity: historyManager.current.canRedo() ? 1 : 0.5
            }}
            title="Redo"
          >
            ↷
          </button>
        </div>

        {/* Right: Save Button */}
        <button
          onClick={() => {
            // Trigger save action
            const saveBtn = document.querySelector('[data-save-button]') as HTMLButtonElement;
            if (saveBtn) saveBtn.click();
            else showToast('Saving design...', 'info');
          }}
          style={{
            padding: isMobile ? '8px 14px' : '10px 18px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(76, 175, 80, 0.4)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#45a049';
            e.currentTarget.style.boxShadow = '0 3px 8px rgba(76, 175, 80, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#4caf50';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(76, 175, 80, 0.4)';
          }}
          title="Save Design"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
      </div>

      {/* Android-style Control Panel */}
      <AndroidControlPanel
        design={design}
        onAddVerticalMullion={() => {
          // Add vertical mullion by changing template to add more panels
          if (design.type === 'window') {
            if (design.template === 'single') {
              updateDesign({ template: 'double' });
              showToast('Vertical mullion added: 2 panels', 'success');
            } else if (design.template === 'double') {
              updateDesign({ template: 'triple' });
              showToast('Vertical mullion added: 3 panels', 'success');
            } else {
              showToast('Maximum panels reached', 'info');
            }
          } else if (design.type === 'door') {
            if (design.template === 'single') {
              updateDesign({ template: 'double' });
              showToast('Vertical mullion added: 2 panels', 'success');
            } else if (design.template === 'double') {
              updateDesign({ template: 'french' });
              showToast('Vertical mullion added: French doors', 'success');
            } else {
              showToast('Maximum panels reached', 'info');
            }
          }
        }}
        onAddHorizontalMullion={() => {
          // Horizontal mullion would create a grid - for now just show info
          showToast('Horizontal mullion: Use grid templates for multi-row designs', 'info');
        }}
        onMoveUp={() => {
          // Pan canvas up
          if (canvasActionsRef.current?.panBy) {
            canvasActionsRef.current.panBy(0, 50);
          } else {
            showToast('Canvas not ready. Please wait...', 'info');
          }
        }}
        onMoveDown={() => {
          // Pan canvas down
          if (canvasActionsRef.current?.panBy) {
            canvasActionsRef.current.panBy(0, -50);
          } else {
            showToast('Canvas not ready. Please wait...', 'info');
          }
        }}
        onMoveLeft={() => {
          // Pan canvas left
          if (canvasActionsRef.current?.panBy) {
            canvasActionsRef.current.panBy(50, 0);
          } else {
            showToast('Canvas not ready. Please wait...', 'info');
          }
        }}
        onMoveRight={() => {
          // Pan canvas right
          if (canvasActionsRef.current?.panBy) {
            canvasActionsRef.current.panBy(-50, 0);
          } else {
            showToast('Canvas not ready. Please wait...', 'info');
          }
        }}
        onResizeVertical={() => {
          // Increase height by 100mm (use undo to decrease)
          const newHeight = Math.min(design.height + 100, 3000);
          updateDesign({ height: newHeight });
          showToast(`Height increased to ${newHeight}mm`, 'success');
        }}
        onResizeHorizontal={() => {
          // Increase width by 100mm (use undo to decrease)
          const newWidth = Math.min(design.width + 100, 3000);
          updateDesign({ width: newWidth });
          showToast(`Width increased to ${newWidth}mm`, 'success');
        }}
        onDelete={() => {
          // Remove a mullion by reducing panels
          if (design.type === 'window') {
            if (design.template === 'triple') {
              updateDesign({ template: 'double' });
              showToast('Mullion removed: 2 panels', 'success');
            } else if (design.template === 'double') {
              updateDesign({ template: 'single' });
              showToast('Mullion removed: 1 panel', 'success');
            } else {
              showToast('Cannot remove: Already single panel', 'info');
            }
          } else if (design.type === 'door') {
            if (design.template === 'french' || design.template === 'double') {
              updateDesign({ template: 'single' });
              showToast('Mullion removed: Single door', 'success');
            } else {
              showToast('Cannot remove: Already single door', 'info');
            }
          }
        }}
        onToggleGrid={() => {
          const newGridState = !showGrid;
          setShowGrid(newGridState);
          if (canvasActionsRef.current?.setGrid) {
            canvasActionsRef.current.setGrid(newGridState);
            showToast(`Grid ${newGridState ? 'enabled' : 'disabled'}`, 'success');
          } else {
            // Fallback: just update state
            showToast(`Grid ${newGridState ? 'enabled' : 'disabled'}`, 'success');
          }
        }}
        onMoreOptions={() => setSidebarOpen(!sidebarOpen)}
      />
      <div 
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          flexDirection: isMobile ? 'column' : 'row',
          minHeight: 0,
          maxHeight: isMobile ? 'calc(100vh - 92px)' : '100%',
          position: 'relative',
          width: '100%',
            touchAction: isMobile && sidebarOpen ? 'none' : 'auto',
            background: '#ffffff'
        }}
        onTouchStart={(e) => {
          // Don't prevent default if touch is on sidebar
          const target = e.target as HTMLElement;
          if (target.closest('.scrollable-sidebar')) {
            // Allow sidebar to handle its own touches
            return;
          }
          // For canvas area, let it handle normally
        }}
        onTouchMove={(e) => {
          // Don't prevent default if touch is on sidebar
          const target = e.target as HTMLElement;
          if (target.closest('.scrollable-sidebar')) {
            // Allow sidebar scrolling
            return;
          }
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'fixed',
              top: '108px',
              left: '10px',
              zIndex: 1001,
              padding: '10px',
              backgroundColor: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ☰
          </button>
        )}
        
        {/* Sidebar - hidden on mobile unless open */}
        <div 
          ref={sidebarRef}
          className="scrollable-sidebar"
          style={{ 
            width: isMobile ? '100vw' : '300px',
            maxWidth: isMobile ? '100vw' : '300px',
            borderRight: isMobile ? 'none' : '1px solid #ddd',
            overflowY: 'scroll',
            overflowX: 'hidden',
            padding: 0,
            display: isMobile && !sidebarOpen ? 'none' : 'block',
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '92px' : 0,
            left: isMobile ? 0 : 'auto',
            right: isMobile ? 0 : 'auto',
            bottom: isMobile ? 0 : 'auto',
            height: isMobile ? 'calc(100dvh - 92px)' : '100%', // Use dvh for modern devices, fallback handled in CSS
            maxHeight: isMobile ? 'calc(100vh - 92px)' : '100%',
            backgroundColor: '#ffffff',
            zIndex: isMobile ? 1000 : 1,
            boxShadow: isMobile ? '2px 0 8px rgba(0,0,0,0.1)' : 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            boxSizing: 'border-box'
          }}
          onTouchStart={(e) => {
            // Stop propagation so parent doesn't interfere
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            // Stop propagation so parent doesn't interfere
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            // Stop propagation so parent doesn't interfere
            e.stopPropagation();
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '12px 16px' : '16px',
            background: '#ffffff',
            paddingBottom: isMobile ? '40px' : '16px',
            minHeight: isMobile ? 'calc(100% + 1px)' : '100%' // Force overflow on mobile
          }}>
            {/* Quick Quote Wizard Button */}
            <button
              onClick={() => setShowWizard(true)}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(33,150,243,0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1976d2';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(33,150,243,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2196f3';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(33,150,243,0.3)';
              }}
            >
              ⚡ Quick Quote Wizard
            </button>

            {/* Smart Presets */}
            <SmartPresets 
              onApply={(preset) => {
                setDesign((prev) => {
                  const updated = { ...prev, ...preset };
                  historyManager.current.push(updated);
                  FunnelEvents.design_template_changed(preset.template || prev.template, preset.type || prev.type);
                  if (preset.width && preset.height) {
                    FunnelEvents.design_dimensions_changed(preset.width, preset.height);
                  }
                  return updated;
                });
                showToast('Preset applied!', 'success');
              }}
            />

            <SmartGuidance design={design} onDesignUpdate={updateDesign} />
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
          
          {/* Profile Presets */}
          <CollapsibleSection title="Frame Profile Style" defaultOpen={false} icon="◢">
            <ProfilePresets design={design} onUpdate={updateDesign} />
          </CollapsibleSection>

          {/* Pricing Panel */}
          <CollapsibleSection title="Pricing Breakdown" defaultOpen={false} icon="💰">
            <PricingPanel 
              design={design} 
              onMarkupChange={(markup) => {
                // Price calculation handled by DesignActions
              }}
            />
            <AdvancedPricingBreakdown design={design} />
          </CollapsibleSection>

          {/* Photo Visualizer */}
          <CollapsibleSection title="Photo Visualizer" defaultOpen={false} icon="📸">
            <div style={{ minHeight: '400px', maxHeight: '600px' }}>
              <PhotoVisualizer design={design} />
            </div>
          </CollapsibleSection>
          
          {/* Quick Template Icons - All Templates */}
          <CollapsibleSection title="Quick Template Icons (All Templates)" defaultOpen={true} icon="⚡">
            <CompactTemplatePanel 
              design={design} 
              onTemplateChange={(template) => {
                updateDesign({ template });
                showToast(`Template changed to ${template}`, 'success');
              }}
            />
          </CollapsibleSection>

          {/* Template Gallery - Visual List */}
          <CollapsibleSection title="All Templates (Detailed)" defaultOpen={false} icon="📋">
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                Type:
              </label>
              <select
                value={design.type}
                onChange={(e) => updateDesign({ type: e.target.value as DesignType })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px' }}
              >
                <option value="window">Window</option>
                <option value="door">Door</option>
              </select>
            </div>
            
            {/* Visual Template Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '10px',
              maxHeight: '500px',
              overflowY: 'auto',
              paddingRight: '4px',
              marginTop: '12px'
            }}>
              {(design.type === 'window' ? [
                { id: 'single', label: 'Single Casement', desc: 'One opening panel, side-hinged, swings outward for easy cleaning and ventilation', icon: '⬜', color: '#2196f3' },
                { id: 'double', label: 'Double Casement', desc: 'Two panels with center mullion, both panels swing open for maximum ventilation', icon: '⬜⬜', color: '#4caf50' },
                { id: 'triple', label: 'Triple Casement', desc: 'Three panels with dual mullions, ideal for wide openings with maximum light', icon: '⬜⬜⬜', color: '#8bc34a' },
                { id: 'sliding', label: 'Sliding Window', desc: 'Horizontal sliding panels, space-saving design perfect for modern architecture', icon: '↔️', color: '#ff9800' },
                { id: 'fixed', label: 'Fixed Window', desc: 'Non-opening glass panel, maximum light with no ventilation, ideal for high or hard-to-reach areas', icon: '▫️', color: '#9e9e9e' },
                { id: 'casement', label: 'Casement Window', desc: 'Side-hinged opening mechanism, swings outward like a door, excellent for catching breezes', icon: '⬜', color: '#2196f3' },
                { id: 'tilt_turn', label: 'Tilt & Turn', desc: 'Multi-position opening: tilt inwards for ventilation or fully open by turning, European style', icon: '🔄', color: '#9c27b0' },
                { id: 'awning', label: 'Awning Window', desc: 'Top-hinged, opens outward upward, provides ventilation even during rain, perfect for bathrooms', icon: '⬆️', color: '#00bcd4' },
                { id: 'hopper', label: 'Hopper Window', desc: 'Bottom-hinged, opens inward at bottom, excellent for basement or lower-level installations', icon: '⬇️', color: '#00bcd4' },
                { id: 'bay', label: 'Bay Window', desc: 'Three-panel angled projection, creates interior alcove space, adds architectural interest', icon: '⏸️', color: '#ff5722' },
                { id: 'bow', label: 'Bow Window', desc: 'Five-panel curved projection, elegant curved appearance, creates spacious interior', icon: '🌙', color: '#ff5722' },
                { id: 'arch', label: 'Arch Window', desc: 'Rounded top window, classic architectural design, adds elegance to traditional homes', icon: '🏛️', color: '#795548' },
                { id: 'picture', label: 'Picture Window', desc: 'Large fixed glass panel, unobstructed views, maximum natural light, no ventilation', icon: '🖼️', color: '#607d8b' },
                { id: 'jalousie', label: 'Jalousie Window', desc: 'Horizontal louvered slats that rotate, adjustable ventilation control, tropical style', icon: '📐', color: '#009688' },
                { id: 'transom', label: 'Transom Window', desc: 'Wide horizontal window above doors or windows, adds light and ventilation at ceiling height', icon: '⬛', color: '#3f51b5' },
                { id: 'skylight', label: 'Skylight', desc: 'Roof window for overhead natural light, transforms interior spaces, energy-efficient daylighting', icon: '☀️', color: '#ffc107' },
                { id: 'corner', label: 'Corner Window', desc: 'L-shaped installation spanning corner, unique architectural feature, panoramic corner views', icon: '🔲', color: '#e91e63' },
                { id: 'garden', label: 'Garden Window', desc: 'Projecting bay-style window, creates shelf space for plants, perfect for kitchens', icon: '🌿', color: '#4caf50' },
                { id: 'storm', label: 'Storm Window', desc: 'Double-pane weather protection, reduces heat loss, provides insulation and weather resistance', icon: '⛈️', color: '#424242' },
                { id: 'clerestory', label: 'Clerestory Window', desc: 'High horizontal window near ceiling, provides privacy while allowing natural light', icon: '⬆️⬆️', color: '#03a9f4' },
                { id: 'greenhouse', label: 'Greenhouse Window', desc: 'Full-glass design with grid pattern, maximum light transmission, ideal for plant growth', icon: '🏠', color: '#8bc34a' },
              ] : [
                { id: 'single', label: 'Single Door', desc: 'Standard single-panel door, traditional design, most common entry door style', icon: '🚪', color: '#2196f3' },
                { id: 'double', label: 'Double Door', desc: 'Two door panels, wider opening, grand entrance, perfect for main entryways', icon: '🚪🚪', color: '#4caf50' },
                { id: 'sliding', label: 'Sliding Door', desc: 'Horizontal sliding mechanism, space-saving design, ideal for patios and closets', icon: '↔️', color: '#ff9800' },
                { id: 'bifold', label: 'Bifold Door', desc: 'Folding panels that accordion-style, perfect for closets and room dividers', icon: '📐', color: '#9c27b0' },
                { id: 'pivot', label: 'Pivot Door', desc: 'Center pivot opening, modern design, rotates around center axis for dramatic entrance', icon: '🔄', color: '#00bcd4' },
                { id: 'french', label: 'French Doors', desc: 'Double doors with glass panes, elegant design, connects indoor and outdoor spaces', icon: '🏛️', color: '#795548' },
                { id: 'entry', label: 'Entry Door', desc: 'Main door with side panels (sidelights), creates grand entrance, maximum natural light', icon: '🚶', color: '#607d8b' },
                { id: 'patio', label: 'Patio Door', desc: 'Large sliding glass door, seamless indoor-outdoor connection, panoramic views', icon: '🌳', color: '#009688' },
                { id: 'barn', label: 'Barn Door', desc: 'Sliding track-mounted door, rustic industrial style, space-efficient, perfect for modern interiors', icon: '🚜', color: '#673ab7' },
                { id: 'pocket', label: 'Pocket Door', desc: 'Slides completely into wall cavity, maximizes space, perfect for tight areas', icon: '📥', color: '#ff5722' },
                { id: 'accordion', label: 'Accordion Door', desc: 'Multiple folding panels, flexible room division, space-saving design', icon: '🪗', color: '#f44336' },
                { id: 'security', label: 'Security Door', desc: 'Reinforced construction, enhanced protection, heavy-duty frame and locking system', icon: '🔒', color: '#424242' },
                { id: 'sliding_panel', label: 'Sliding Panel Door', desc: 'Multiple glass panels that slide, modern aesthetic, allows light flow', icon: '🪟', color: '#9e9e9e' },
                { id: 'louvre', label: 'Louvre Door', desc: 'Horizontal louvered slats, adjustable ventilation, classic design for closets and pantries', icon: '📋', color: '#607d8b' },
              ]).map(template => (
                <div
                  key={template.id}
                  onClick={() => updateDesign({ template: template.id as Template })}
                  style={{
                    cursor: 'pointer',
                    padding: '12px',
                    borderRadius: '8px',
                    background: design.template === template.id 
                      ? `linear-gradient(135deg, ${template.color} 0%, ${template.color}dd 100%)`
                      : '#f5f5f5',
                    border: design.template === template.id 
                      ? `2px solid ${template.color}`
                      : '2px solid transparent',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    position: 'relative',
                    boxShadow: design.template === template.id 
                      ? `0 4px 12px ${template.color}40`
                      : '0 2px 4px rgba(0,0,0,0.1)',
                    transform: design.template === template.id ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (design.template !== template.id) {
                      e.currentTarget.style.background = '#e8e8e8';
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (design.template !== template.id) {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  {/* Selected indicator */}
                  {design.template === template.id && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      ✓
                    </div>
                  )}
                  
                  <div style={{ 
                    fontSize: isMobile ? '28px' : '32px', 
                    marginBottom: '6px',
                    filter: design.template === template.id ? 'brightness(1.2)' : 'none'
                  }}>
                    {template.icon}
                  </div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    fontSize: isMobile ? '11px' : '12px', 
                    marginBottom: '4px',
                    color: design.template === template.id ? '#ffffff' : '#333'
                  }}>
                    {template.label}
                  </div>
                  <div style={{ 
                    fontSize: isMobile ? '9px' : '10px', 
                    color: design.template === template.id ? '#ffffffcc' : '#666',
                    lineHeight: '1.3',
                    minHeight: isMobile ? '30px' : '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    {template.desc}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '12px', 
              padding: '10px', 
              background: '#e3f2fd', 
              borderRadius: '6px',
              fontSize: '11px',
              color: '#1976d2',
              border: '1px solid #90caf9'
            }}>
              💡 <strong>Tip:</strong> Click any template above to preview with animated motion. Current selection is highlighted.
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Dimensions & Material" defaultOpen={true} icon="📏">
            <DesignControls design={design} onUpdate={updateDesign} />
            <ValidationDisplay design={design} />
          </CollapsibleSection>

          <CollapsibleSection title="Hardware" defaultOpen={false} icon="🔧">
            <HardwareSelector design={design} onUpdate={updateDesign} />
          </CollapsibleSection>

          <CollapsibleSection title="Extended Components" defaultOpen={false} icon="➕">
            <ExtendedComponents design={design} onUpdate={updateDesign} />
          </CollapsibleSection>
          <DesignActions 
            design={design}
            onSaveSuccess={(message) => showToast(message || 'Design saved successfully!', 'success')}
            onSaveError={(error) => showToast(error, 'error')}
            onPriceCalculated={(price) => setCalculatedPrice(price)}
          />

          {/* Quote Export - Shows when price is calculated */}
          {calculatedPrice && (
            <CollapsibleSection title="Quote Export & Lead Form" defaultOpen={false} icon="📄">
              <QuoteExport
                canvasImage={canvasImage}
                design={design}
                price={calculatedPrice}
                onExportComplete={() => showToast('Quotation exported successfully!', 'success')}
              />
              <button
                onClick={() => {
                  // Capture canvas image when user clicks
                  const image = canvasActionsRef.current?.exportAsImage?.();
                  if (image) {
                    setCanvasImage(image);
                    showToast('Design image captured! Ready to export.', 'success');
                  } else {
                    showToast('Could not capture design image. Please try again.', 'error');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '12px',
                  background: canvasImage ? '#4caf50' : '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                {canvasImage ? '✅ Design Image Captured' : '📸 Capture Design Image'}
              </button>
            </CollapsibleSection>
          )}

          {/* View 3D Preview Button */}
          <button
            onClick={() => {
              // Save current design to localStorage
              try {
                localStorage.setItem('currentDesign', JSON.stringify(design));
              } catch (e) {
                console.error('Error saving design:', e);
              }
              // Open preview in new tab/window
              const designParam = encodeURIComponent(JSON.stringify(design));
              window.open(`/preview?design=${designParam}`, '_blank');
            }}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '16px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#45a049';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4caf50';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>🎨</span>
            <span>View 3D Preview</span>
          </button>
          </div>
        </div>
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          width: isMobile && sidebarOpen ? 0 : '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Canvas Area - 2D or 3D based on view mode */}
          <div style={{ 
            flex: 1, 
            position: 'relative', 
            width: '100%',
            height: '100%',
            minHeight: isMobile ? '300px' : 'auto',
            background: '#ffffff',
            touchAction: 'pan-x pan-y pinch-zoom', // Better touch handling for iPhone 15
            WebkitTouchCallout: 'none', // Prevent iOS callout menu
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}>
            {viewMode === '2d' ? (
              <>
                {/* Simplified Dimensions Overlay */}
                <SimplifiedDimensions design={design} />
                <InteractiveCanvas2D 
                  design={design} 
                  onDesignChange={updateDesign}
                  showGrid={showGrid}
                  onGridChange={(show) => setShowGrid(show)}
                  onActionsReady={(actions) => {
                    canvasActionsRef.current = actions;
                  }}
                />
              </>
            ) : (
              <Preview3D design={design} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Quick Quote Wizard Modal */}
      {showWizard && (
        <QuickQuoteWizard
          onComplete={(preset) => {
            setDesign((prev) => {
              const updated = { ...prev, ...preset };
              historyManager.current.push(updated);
              FunnelEvents.design_template_changed(preset.template || prev.template, preset.type || prev.type);
              if (preset.width && preset.height) {
                FunnelEvents.design_dimensions_changed(preset.width, preset.height);
              }
              return updated;
            });
            setShowWizard(false);
            showToast('Quick design created!', 'success');
          }}
          onCancel={() => setShowWizard(false)}
        />
      )}
    </div>
  );
}

