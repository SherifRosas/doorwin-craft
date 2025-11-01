import { NextRequest, NextResponse } from 'next/server';
import { getBilling } from '@/src/lib/billing';

export async function GET(req: NextRequest) {
  const orgId = req.nextUrl.searchParams.get('orgId');
  
  if (!orgId) {
    return NextResponse.json({ error: 'orgId required' }, { status: 400 });
  }

  try {
    const billing = await getBilling(orgId);
    return NextResponse.json(billing);
  } catch (error) {
    console.error('Billing fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch billing' }, { status: 500 });
  }
}






