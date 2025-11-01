import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasEntitlement } from '@/src/lib/billing';

export async function requireEntitlement(request: NextRequest, orgId: string) {
  const hasAccess = await hasEntitlement(orgId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Subscription required' }, { status: 402 });
  }
  return null;
}


