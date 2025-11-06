"use client";
import React from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface AndroidControlPanelProps {
  design: DesignConfig;
  onAddVerticalMullion?: () => void;
  onAddHorizontalMullion?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onResizeVertical?: () => void;
  onResizeHorizontal?: () => void;
  onDelete?: () => void;
  onToggleGrid?: () => void;
  onMoreOptions?: () => void;
}

interface ButtonConfig {
  icon: string;
  label: string;
  action: (() => void) | undefined;
  customIcon?: React.ReactNode;
}

export function AndroidControlPanel({
  design,
  onAddVerticalMullion,
  onAddHorizontalMullion,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onResizeVertical,
  onResizeHorizontal,
  onDelete,
  onToggleGrid,
  onMoreOptions
}: AndroidControlPanelProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Tool buttons matching Android app style
  const buttons: ButtonConfig[] = [
    // Row 1
    { icon: '☰', label: 'Grid', action: onToggleGrid },
    { icon: '│', label: 'Vertical Line', action: onAddVerticalMullion },
    { icon: '─', label: 'Horizontal Line', action: onAddHorizontalMullion },
    { icon: '↑', label: 'Move Up', action: onMoveUp },
    { icon: '←', label: 'Move Left', action: onMoveLeft },
    { icon: '⇅', label: 'Resize Vertical', action: onResizeVertical },
    // Row 2
    { icon: '☰', label: 'Menu', action: onMoreOptions },
    { icon: '││', label: 'Double Vertical', action: onAddVerticalMullion },
    { icon: '+', label: 'Add', action: () => {} },
    { icon: '↓', label: 'Move Down', action: onMoveDown },
    { icon: '→', label: 'Move Right', action: onMoveRight },
    { icon: '⇄', label: 'Resize Horizontal', action: onResizeHorizontal },
    // Row 3 - Square icons with diagonal lines
    { 
      icon: 'square-diag-1', 
      label: 'Square Diagonal 1', 
      action: () => {},
      customIcon: (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #2c3e50',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '2px',
            background: '#2c3e50',
            transform: 'rotate(45deg)',
            position: 'absolute'
          }} />
        </div>
      )
    },
    { 
      icon: 'square-diag-2', 
      label: 'Square Diagonal 2', 
      action: () => {},
      customIcon: (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #2c3e50',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '2px',
            background: '#2c3e50',
            transform: 'rotate(-45deg)',
            position: 'absolute'
          }} />
        </div>
      )
    },
    { 
      icon: 'square-diag-3', 
      label: 'Square Diagonal 3', 
      action: () => {},
      customIcon: (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #2c3e50',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '2px',
            background: '#2c3e50',
            transform: 'rotate(135deg)',
            position: 'absolute'
          }} />
        </div>
      )
    },
    { 
      icon: 'square-diag-4', 
      label: 'Square Diagonal -135°', 
      action: () => {},
      customIcon: (
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #2c3e50',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            height: '2px',
            background: '#2c3e50',
            transform: 'rotate(-135deg)',
            position: 'absolute'
          }} />
        </div>
      )
    },
    { icon: '⌫', label: 'Delete', action: onDelete },
    { icon: '☷', label: 'More', action: onMoreOptions },
  ];

  return (
    <div style={{
      background: 'linear-gradient(180deg, #e8f4f8 0%, #d0e8f0 100%)',
      padding: isMobile ? '8px 12px' : '10px 16px',
      borderBottom: '1px solid #b8d4e0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: isMobile ? '4px' : '6px',
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            style={{
              padding: isMobile ? '8px 4px' : '10px 6px',
              background: '#ffffff',
              border: '1px solid #c0d0d8',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: isMobile ? '14px' : '16px',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '36px' : '40px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f8ff';
              e.currentTarget.style.borderColor = '#90caf9';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#c0d0d8';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            }}
            title={btn.label}
          >
            {btn.customIcon || btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}



