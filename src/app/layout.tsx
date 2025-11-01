import './globals.css';
import { Providers } from './providers';
import { Header } from '@/src/components/Layout/Header';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

export const metadata = {
  title: 'DoorWin Craft',
  description: 'Professional Window & Door Design Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body style={{ margin: 0, padding: 0 }}>
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






