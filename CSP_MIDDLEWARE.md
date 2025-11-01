# Next.js Security Headers and Strict CSP (Production-Ready)

## Middleware example (app-wide)

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https:",
    "font-src 'self' data: https:",
    "frame-ancestors 'none'",
    "base-uri 'none'"
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

## Notes
- Remove `'unsafe-inline'` from `script-src` to block inline scripts. Use nonces or hashes if necessary.
- Keep `'unsafe-inline'` only for styles temporarily, migrate to CSS modules or hashed inline styles later.
- Validate CSP in `Report-Only` first, then enforce.






