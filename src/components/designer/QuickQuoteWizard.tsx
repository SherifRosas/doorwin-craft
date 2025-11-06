"use client";
import { useState } from 'react';
import type { DesignConfig } from '@/src/app/draw/page';

interface QuickQuoteWizardProps {
  onComplete: (design: Partial<DesignConfig>) => void;
  onCancel: () => void;
}

export function QuickQuoteWizard({ onComplete, onCancel }: QuickQuoteWizardProps) {
  const [step, setStep] = useState(1);
  const [design, setDesign] = useState<Partial<DesignConfig>>({
    type: 'window',
    template: 'single',
    width: 1200,
    height: 1500,
    material: 'aluminum',
    glass: true
  });

  const steps = [
    { id: 1, title: 'Size', icon: '📏' },
    { id: 2, title: 'Type', icon: '🪟' },
    { id: 3, title: 'Material', icon: '🔧' },
    { id: 4, title: 'Review', icon: '✅' }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(design);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '24px',
          position: 'relative'
        }}>
          {steps.map((s, idx) => (
            <div key={s.id} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= s.id ? '#2196f3' : '#e0e0e0',
                color: step >= s.id ? 'white' : '#999',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}>
                {step > s.id ? '✓' : s.icon}
              </div>
              <div style={{
                fontSize: '11px',
                color: step >= s.id ? '#2196f3' : '#999',
                fontWeight: step === s.id ? '600' : '400'
              }}>
                {s.title}
              </div>
              {idx < steps.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '60%',
                  right: '-40%',
                  height: '2px',
                  background: step > s.id ? '#2196f3' : '#e0e0e0',
                  zIndex: -1
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Size */}
        {step === 1 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              What size do you need?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { name: 'Small', width: 600, height: 800 },
                { name: 'Medium', width: 1200, height: 1500 },
                { name: 'Large', width: 1800, height: 2000 },
                { name: 'Custom', width: 0, height: 0 }
              ].map(size => (
                <button
                  key={size.name}
                  onClick={() => {
                    if (size.name === 'Custom') {
                      const w = prompt('Width (mm):', '1200');
                      const h = prompt('Height (mm):', '1500');
                      if (w && h) {
                        setDesign({ ...design, width: Number(w), height: Number(h) });
                      }
                    } else {
                      setDesign({ ...design, width: size.width, height: size.height });
                    }
                  }}
                  style={{
                    padding: '16px',
                    border: '2px solid',
                    borderColor: design.width === size.width && design.height === size.height ? '#2196f3' : '#e0e0e0',
                    borderRadius: '8px',
                    background: design.width === size.width && design.height === size.height ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{size.name}</div>
                  {size.width > 0 && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {size.width}×{size.height}mm
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Type & Template */}
        {step === 2 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              What type?
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Type:</label>
              <select
                value={design.type}
                onChange={(e) => setDesign({ ...design, type: e.target.value as 'window' | 'door' })}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="window">Window</option>
                <option value="door">Door</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Template:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(design.type === 'window' 
                  ? ['single', 'double', 'sliding']
                  : ['single', 'double', 'sliding']
                ).map(template => (
                  <button
                    key={template}
                    onClick={() => setDesign({ ...design, template: template as any })}
                    style={{
                      padding: '12px',
                      border: '2px solid',
                      borderColor: design.template === template ? '#2196f3' : '#e0e0e0',
                      borderRadius: '6px',
                      background: design.template === template ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontSize: '13px'
                    }}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Material */}
        {step === 3 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              Choose Material
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {['aluminum', 'upvc', 'wood'].map(material => (
                <button
                  key={material}
                  onClick={() => setDesign({ ...design, material: material as any })}
                  style={{
                    padding: '20px',
                    border: '2px solid',
                    borderColor: design.material === material ? '#2196f3' : '#e0e0e0',
                    borderRadius: '8px',
                    background: design.material === material ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {material === 'upvc' ? 'uPVC' : material.charAt(0).toUpperCase() + material.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              Review Your Design
            </h3>
            <div style={{
              padding: '16px',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Size:</strong> {design.width}×{design.height}mm
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Type:</strong> {design.type} - {design.template}
              </div>
              <div>
                <strong>Material:</strong> {design.material}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={handleBack}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              background: '#2196f3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {step === 4 ? 'Create Design' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}





