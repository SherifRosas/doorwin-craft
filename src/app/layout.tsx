import './globals.css';
import { Providers } from './providers';
import { Header } from '@/src/components/Layout/Header';
import { Footer } from '@/src/components/Layout/Footer';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { Polyfills } from '@/src/components/Polyfills';
import { SplashScreen } from '@/src/components/SplashScreen';

export const metadata = {
  title: 'DoorWin Craft',
  description: 'Professional Window & Door Design Platform',
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DoorWin Craft',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        {/* Comprehensive viewport meta for all devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no" />
        
        {/* iOS specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DoorWin Craft" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        
        {/* Android specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="msapplication-TileColor" content="#1e3a5f" />
        
        {/* PWA / Mobile optimizations */}
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="320" />
        
        {/* Prevent auto-zoom on input focus (all iOS/Android versions) */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body style={{ margin: 0, padding: 0, WebkitFontSmoothing: 'antialiased', WebkitTapHighlightColor: 'transparent', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Polyfills />
        <ErrorBoundary>
          <Providers>
            <SplashScreen />
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}






