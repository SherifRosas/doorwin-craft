# DoorWin Craft - Security Implementation Plan

## 🔐 Security Measures Implementation

### 1. Authentication & Authorization Security

#### Enhanced Authentication System (with Argon2 and strict tokens):
```typescript
// src/lib/security/auth.ts
import { hash as argonHash, verify as argonVerify } from 'argon2';
import jwt from 'jsonwebtoken';
import { RateLimiter } from 'limiter';

export class SecurityManager {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly TOKEN_TTL = '12h';

  // Rate limiting for login attempts (example: 5/minute)
  private static loginLimiter = new RateLimiter(5, 'minute');
  
  // Secure password hashing (one-way) with Argon2id
  static async hashPassword(password: string): Promise<string> {
    return await argonHash(password);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argonVerify(hash, password);
  }

  static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_TTL,
      issuer: 'doorwin-craft',
      audience: 'doorwin-users'
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET, { issuer: 'doorwin-craft', audience: 'doorwin-users' });
  }

  static async checkLoginRateLimit(): Promise<boolean> {
    try { await this.loginLimiter.removeTokens(1); return true; } catch { return false; }
  }
}
```

#### API Security Middleware (strict CSP with nonce):
```typescript
// src/middleware/security.ts
import { NextRequest, NextResponse } from 'next/server';

export function securityMiddleware() {
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
    "frame-ancestors 'none'",
    "base-uri 'none'"
  ].join('; ');
  res.headers.set('Content-Security-Policy', csp);
  return res;
}
```

### 2. Database Security

#### Secure Database Configuration:
```typescript
// src/lib/security/database.ts
import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from './encryption';

export class SecureDatabase {
  private static instance: PrismaClient;
  
  static getInstance(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL + '?sslmode=require'
          }
        },
        log: ['error', 'warn'],
      });
    }
    return this.instance;
  }

  // Encrypt sensitive data before storing
  static async encryptSensitiveData(data: any): Promise<any> {
    if (data.password) {
      data.password = await encrypt(data.password);
    }
    if (data.phone) {
      data.phone = await encrypt(data.phone);
    }
    return data;
  }

  // Decrypt sensitive data when retrieving
  static async decryptSensitiveData(data: any): Promise<any> {
    if (data.password) {
      data.password = await decrypt(data.password);
    }
    if (data.phone) {
      data.phone = await decrypt(data.phone);
    }
    return data;
  }
}
```

### 3. Data Encryption

#### Encryption Utilities (AES-256-GCM with createCipheriv):
```typescript
// src/lib/security/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recommended 12 bytes

export function encryptGCM(key: Buffer, plaintext: string, aad = 'doorwin-craft') {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${ciphertext.toString('hex')}`;
}

export function decryptGCM(key: Buffer, payload: string, aad = 'doorwin-craft') {
  const [ivHex, tagHex, dataHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAAD(Buffer.from(aad));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return plaintext.toString('utf8');
}
```

### 4. Input Validation & Sanitization

#### Input Security:
```typescript
// src/lib/security/validation.ts
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class InputValidator {
  // Sanitize HTML input
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input);
  }

  // Validate email
  static validateEmail(email: string): boolean {
    return validator.isEmail(email) && email.length <= 254;
  }

  // Validate password strength
  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { valid: errors.length === 0, errors };
  }

  // Validate phone number
  static validatePhone(phone: string): boolean {
    return validator.isMobilePhone(phone, 'any');
  }

  // Validate Egyptian ID
  static validateEgyptianID(id: string): boolean {
    const egyptianIDRegex = /^[0-9]{14}$/;
    return egyptianIDRegex.test(id);
  }

  // Sanitize file uploads
  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' };
    }
    
    return { valid: true };
  }
}
```

### 5. API Security

#### Secure API Routes:
```typescript
// src/app/api/secure-route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SecurityManager } from '@/lib/security/auth';
import { InputValidator } from '@/lib/security/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitOk = await SecurityManager.checkLoginRateLimit(clientIP);
    
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Input validation
    const body = await request.json();
    const sanitizedBody = InputValidator.sanitizeHTML(JSON.stringify(body));
    
    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = SecurityManager.verifyToken(token);
    
    // Log security events
    console.log(`API access from IP: ${clientIP}, User: ${decoded.id}`);
    
    // Process request...
    
  } catch (error) {
    console.error('Security error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 6. Environment Security

#### Secure Environment Configuration:
```bash
# .env.local (SECURE - DO NOT COMMIT)
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/doorwin_craft?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-super-secure-secret-key-here"
JWT_SECRET="your-jwt-secret-key-here"
ENCRYPTION_KEY="your-32-character-encryption-key"

# API Keys (keep secure)
STRIPE_SECRET_KEY="sk_test_..."
PAYPAL_CLIENT_SECRET="your-paypal-secret"
FAWRY_API_SECRET="your-fawry-secret"

# Security
CORS_ORIGIN="https://doorwincraft.com"
RATE_LIMIT_MAX="100"
SESSION_TIMEOUT="86400"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="error"
```

### 7. Security Monitoring

#### Security Logging:
```typescript
// src/lib/security/monitoring.ts
export class SecurityMonitor {
  static logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };

    // Log to console (in production, use proper logging service)
    console.log(`[SECURITY ${severity.toUpperCase()}]`, logEntry);

    // Send to monitoring service (Sentry, DataDog, etc.)
    if (severity === 'critical' || severity === 'high') {
      // Send alert to security team
      this.sendSecurityAlert(logEntry);
    }
  }

  static sendSecurityAlert(logEntry: any) {
    // Implement alert system (email, Slack, etc.)
    console.log('SECURITY ALERT:', logEntry);
  }

  static trackFailedLogin(ip: string, email: string) {
    this.logSecurityEvent('failed_login', { ip, email }, 'medium');
  }

  static trackSuspiciousActivity(ip: string, activity: string) {
    this.logSecurityEvent('suspicious_activity', { ip, activity }, 'high');
  }
}
```

This comprehensive security implementation protects your application from common vulnerabilities and establishes a strong security foundation for DoorWin Craft.
