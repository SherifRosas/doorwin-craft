import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { getOrgIdFromRequest } from '@/src/lib/auth-helper';
import { rateLimit } from '@/src/lib/rate-limit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const customer = await db.customer.findFirst({
      where: { id: params.id, orgId },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const updates = await req.json();

  try {
    // Verify customer belongs to org
    const existing = await db.customer.findFirst({
      where: { id: params.id, orgId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customer = await db.customer.update({
      where: { id: params.id },
      data: updates
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    // Verify customer belongs to org
    const existing = await db.customer.findFirst({
      where: { id: params.id, orgId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    await db.customer.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Customer deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}


