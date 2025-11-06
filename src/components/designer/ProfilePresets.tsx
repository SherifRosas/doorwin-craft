"use client";
import type { DesignConfig } from '@/src/app/draw/page';

interface ProfilePresetsProps {
  design: DesignConfig;
  onUpdate: (updates: Partial<DesignConfig>) => void;
}

type ProfileType = 'ovolo' | 'chamfer' | 'round' | 'square';

interface ProfilePreset {
  id: ProfileType;
  name: string;
  icon: string;
  description: string;
}

const profiles: ProfilePreset[] = [
  { id: 'ovolo', name: 'Ovolo', icon: '⭕', description: 'Classic curved edge profile' },
  { id: 'chamfer', name: 'Chamfer', icon: '◢', description: 'Angled cut profile' },
  { id: 'round', name: 'Round', icon: '○', description: 'Fully rounded profile' },
  { id: 'square', name: 'Square', icon: '▢', description: 'Sharp square edges' },
];

export function ProfilePresets({ design, onUpdate }: ProfilePresetsProps) {
  const currentProfile = (design as any).profileType || 'square';

  return (
    <div style={{
      background: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #e0e0e0'
    }}>
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '10px'
      }}>
        Frame Profile Style
      </div>
      <div style={{
        fontSize: '11px',
        color: '#666',
        marginBottom: '8px'
      }}>
        Choose how the inner frame edge looks. Ovolo/Round are curved, Chamfer is beveled, Square is sharp.
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px'
      }}>
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onUpdate({ profileType: profile.id as any })}
            style={{
              padding: '12px 8px',
              background: currentProfile === profile.id ? '#2196f3' : '#ffffff',
              color: currentProfile === profile.id ? 'white' : '#333',
              border: currentProfile === profile.id ? '2px solid #1976d2' : '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: currentProfile === profile.id ? '600' : '400',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: currentProfile === profile.id ? '0 2px 8px rgba(33,150,243,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (currentProfile !== profile.id) {
                e.currentTarget.style.background = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentProfile !== profile.id) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            title={profile.description}
          >
            <span style={{ fontSize: '24px' }}>{profile.icon}</span>
            <span style={{ fontSize: '11px', opacity: 0.9 }}>{profile.name}</span>
          </button>
        ))}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#666',
        marginTop: '10px',
        paddingTop: '8px',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span title="Visual only — beveled corners">Chamfer ×1.05</span>
        <span title="Visual only — subtle curve">Ovolo ×1.08</span>
        <span title="Visual only — rounded corners">Round ×1.10</span>
        <span title="Baseline">Square ×1.00</span>
      </div>
    </div>
  );
}

