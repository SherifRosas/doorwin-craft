"use client";
import { useState, useEffect, lazy, Suspense } from 'react';

// Placeholder for future 3D asset loading
const LazyThreeView = lazy(() => Promise.resolve({ default: () => <div>3D Viewer (coming soon)</div> }));

export function LazyAssetLoader({ assetUrl, type = '3d' }: { assetUrl?: string; type?: '3d' | 'image' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assetUrl) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [assetUrl]);

  if (loading) return <div>Loading asset...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!assetUrl) return <div>No asset provided</div>;

  if (type === '3d') {
    return (
      <Suspense fallback={<div>Loading 3D...</div>}>
        <LazyThreeView />
      </Suspense>
    );
  }

  return <img src={assetUrl} alt="Design asset" style={{ maxWidth: '100%', height: 'auto' }} />;
}




