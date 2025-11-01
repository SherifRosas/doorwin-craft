import { NextRequest, NextResponse } from 'next/server';
import { requireEntitlement } from '@/src/lib/gate';

export async function GET(req: NextRequest) {
  const orgId = req.headers.get('x-org-id') || 'default-org';
  const block = await requireEntitlement(req, orgId);
  if (block) return block;
  return NextResponse.json({ ok: true, message: 'You have access.' });
}


