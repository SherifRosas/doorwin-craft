import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { getOrgIdFromRequest } from '@/src/lib/auth-helper';
import { rateLimit } from '@/src/lib/rate-limit';

// Generate human-readable order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}-${random}`;
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (!rateLimit(String(ip), 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const orgId = getOrgIdFromRequest(req);
  if (!orgId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get('status');

  try {
    const orders = await db.order.findMany({
      where: {
        orgId,
        ...(status ? { status: status as any } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            design: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { items: true }
        }
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
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

  const { customerId, items, notes } = await req.json();

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
  }

  try {
    // Verify customer belongs to org
    const customer = await db.customer.findFirst({
      where: { id: customerId, orgId }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += (item.price || 0) * (item.quantity || 1);
    }

    const vat = Math.round(subtotal * 0.15); // KSA 15% VAT
    const total = subtotal + vat;

    // Create order with items
    const order = await db.order.create({
      data: {
        orgId,
        customerId,
        orderNumber: generateOrderNumber(),
        status: 'DRAFT',
        subtotal,
        vat,
        total,
        notes,
        items: {
          create: items.map((item: any) => ({
            designId: item.designId,
            quantity: item.quantity || 1,
            price: item.price || 0,
            notes: item.notes,
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            design: true
          }
        }
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}


