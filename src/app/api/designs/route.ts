import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { requireEntitlement } from '@/src/lib/gate';

export async function POST(req: NextRequest) {
  const orgId = req.headers.get('x-org-id') || 'default-org';
  const block = await requireEntitlement(req, orgId);
  if (block) return block;

  const { name, config } = await req.json();
  if (!name || !config) {
    return NextResponse.json({ error: 'Name and config required' }, { status: 400 });
  }

  try {
    // In a real app, save to Designs table
    // For now, return success (would need to extend Prisma schema)
    return NextResponse.json({ 
      id: `design_${Date.now()}`,
      name,
      config,
      orgId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Design save error:', error);
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId') || 'default-org';
  const block = await requireEntitlement(req, orgId);
  if (block) return block;

  // In a real app, fetch from Designs table
  return NextResponse.json({ designs: [] });
}




