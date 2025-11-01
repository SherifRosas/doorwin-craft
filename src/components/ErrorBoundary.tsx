"use client";
import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


