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
    const order = await db.order.findFirst({
      where: { id: params.id, orgId },
      include: {
        customer: true,
        items: {
          include: {
            design: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
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
    // Verify order belongs to org
    const existing = await db.order.findFirst({
      where: { id: params.id, orgId }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = await db.order.update({
      where: { id: params.id },
      data: updates,
      include: {
        customer: true,
        items: {
          include: {
            design: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}


