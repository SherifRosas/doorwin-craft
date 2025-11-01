import './globals.css';
import { Providers } from './providers';
import { Header } from '@/src/components/Layout/Header';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

export const metadata = {
  title: 'DoorWin Craft',
  description: 'Professional Window & Door Design Platform',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DoorWin Craft" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body style={{ margin: 0, padding: 0, WebkitFontSmoothing: 'antialiased', WebkitTapHighlightColor: 'transparent' }}>
        <ErrorBoundary>
          <Providers>
            <Header />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}






