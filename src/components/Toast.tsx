"use client";
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: { bg: '#4caf50', icon: '✅' },
    error: { bg: '#f44336', icon: '❌' },
    info: { bg: '#2196f3', icon: 'ℹ️' },
    warning: { bg: '#ff9800', icon: '⚠️' },
  };

  const style = colors[type];

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: style.bg,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '250px',
        maxWidth: '400px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontSize: '14px',
        fontWeight: '500',
      }}
    >
      <span style={{ fontSize: '18px' }}>{style.icon}</span>
      <span>{message}</span>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: ToastType }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: ToastType }>>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}


