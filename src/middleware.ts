import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  const isDev = process.env.NODE_ENV !== 'production';
  const csp = [
    "default-src 'self'",
    // In dev, relax to allow Next.js/devtools inline/eval and third-party scripts
    isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:"
      : "script-src 'self' 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "font-src 'self' data: https:",
    // Allow iframes from payment providers in app (checkout) in dev; adjust for prod as needed
    isDev ? "frame-src 'self' https:" : undefined,
    "frame-ancestors 'none'",
    "base-uri 'none'"
  ]
    .filter(Boolean)
    .join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};



