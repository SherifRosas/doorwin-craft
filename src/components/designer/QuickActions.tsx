"use client";
import type { DesignConfig } from '@/src/app/draw/page';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: (design: DesignConfig) => Partial<DesignConfig>;
  tooltip: string;
}

const actions: QuickAction[] = [
  {
    id: 'reset',
    label: 'Reset',
    icon: '↺',
    action: () => ({
      width: 1200,
      height: 1500,
      color: '#ffffff',
    }),
    tooltip: 'Reset to default size and color',
  },
  {
    id: 'center',
    label: 'Center View',
    icon: '⌂',
    action: () => ({}),
    tooltip: 'Center the design in view',
  },
  {
    id: 'fit',
    label: 'Fit to View',
    icon: '⤢',
    action: () => ({}),
    tooltip: 'Fit design to viewport',
  },
];

export function QuickActions({
  design,
  onAction,
}: {
  design: DesignConfig;
  onAction: (action: string, updates?: Partial<DesignConfig>) => void;
}) {
  return (
    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Quick Actions</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.id === 'center' || action.id === 'fit') {
                onAction(action.id);
              } else {
                onAction(action.id, action.action(design));
              }
            }}
            style={{
              padding: '6px 10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title={action.tooltip}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2196f3';
              e.currentTarget.style.background = '#f5f9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#ddd';
              e.currentTarget.style.background = 'white';
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}




