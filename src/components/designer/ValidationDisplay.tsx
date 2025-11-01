"use client";
import { validateDesign } from './DesignValidator';
import type { DesignConfig } from '@/src/app/draw/page';

export function ValidationDisplay({ design }: { design: DesignConfig }) {
  const errors = validateDesign(design);

  if (errors.length === 0) return null;

  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      background: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      <strong style={{ display: 'block', marginBottom: '8px', color: '#856404' }}>⚠️ Design Warnings:</strong>
      <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
        {errors.map((error, idx) => (
          <li key={idx}>{error.message}</li>
        ))}
      </ul>
    </div>
  );
}




