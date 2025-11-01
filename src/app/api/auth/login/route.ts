import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/src/lib/rate-limit';
import { SecurityManager } from '@/src/lib/security/auth';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  try {
    // Find user with org
    const user = await db.user.findUnique({
      where: { email },
      include: { orgs: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isValid = await SecurityManager.verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = SecurityManager.generateToken({ 
      sub: user.id, 
      email: user.email,
      orgId: user.orgs[0]?.id 
    });

    return NextResponse.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name },
      orgId: user.orgs[0]?.id
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


