import { NextRequest, NextResponse } from 'next/server';
import { SecurityManager } from '@/src/lib/security/auth';
import { db } from '@/src/lib/db';
import { rateLimit } from '@/src/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await SecurityManager.hashPassword(password);

    // Create user and org
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email,
        orgs: {
          create: {
            name: `${name || email}'s Organization`
          }
        }
      },
      include: {
        orgs: true
      }
    });

    const token = SecurityManager.generateToken({ 
      sub: user.id, 
      email: user.email,
      orgId: user.orgs[0].id 
    });

    return NextResponse.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name },
      orgId: user.orgs[0].id
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}






