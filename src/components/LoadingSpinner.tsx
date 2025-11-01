"use client";

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

export function LoadingSpinner({ size = 'medium', color = '#2196f3', message }: LoadingSpinnerProps) {
  const sizes = {
    small: '16px',
    medium: '24px',
    large: '32px',
  };

  const spinnerSize = sizes[size];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '20px'
    }}>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: `3px solid ${color}20`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {message && (
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#666',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({ 
  loading, 
  children, 
  onClick, 
  disabled, 
  style,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...style,
        position: 'relative',
        opacity: loading ? 0.7 : 1,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LoadingSpinner size="small" color="currentColor" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}


