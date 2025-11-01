"use client";
import { useState, useEffect } from 'react';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  unit?: string;
  helpText?: string;
}

export function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  min,
  max,
  step,
  required = false,
  disabled = false,
  unit,
  helpText,
}: InputFieldProps) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleBlur = () => {
    setTouched(true);
    // Client-side validation
    if (required && !value) {
      setLocalError(`${label} is required`);
    } else if (type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setLocalError('Please enter a valid number');
      } else if (min !== undefined && numValue < min) {
        setLocalError(`Minimum value is ${min}`);
      } else if (max !== undefined && numValue > max) {
        setLocalError(`Maximum value is ${max}`);
      } else {
        setLocalError(undefined);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
    if (touched && localError) {
      setLocalError(undefined);
    }
  };

  const showError = touched && localError;

  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: showError ? '#d32f2f' : '#333',
        }}
      >
        {label}
        {required && <span style={{ color: '#d32f2f', marginLeft: '4px' }}>*</span>}
        {unit && <span style={{ color: '#666', marginLeft: '4px', fontWeight: 'normal' }}>({unit})</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          required={required}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${showError ? '#d32f2f' : '#ddd'}`,
            borderRadius: '4px',
            fontSize: '14px',
            transition: 'border-color 0.2s',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
            boxSizing: 'border-box',
          }}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${label}-error` : undefined}
        />
        {unit && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '12px',
              pointerEvents: 'none',
            }}
          >
            {unit}
          </span>
        )}
      </div>
      {showError && (
        <div
          id={`${label}-error`}
          role="alert"
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#d32f2f',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>⚠️</span>
          <span>{localError}</span>
        </div>
      )}
      {!showError && helpText && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          {helpText}
        </div>
      )}
    </div>
  );
}


