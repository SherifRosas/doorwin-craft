import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { getOrgIdFromRequest } from '@/src/lib/auth-helper';
import { rateLimit } from '@/src/lib/rate-limit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const customers = await db.customer.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Customers fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { name, email, phone, address, notes } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const customer = await db.customer.create({
      data: {
        orgId,
        name,
        email,
        phone,
        address,
        notes,
      }
    });

    // Track customer creation (client-side will also track)
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Customer creation error:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

