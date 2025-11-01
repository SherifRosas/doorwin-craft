import { NextRequest } from 'next/server';
import { SecurityManager } from './security/auth';

export function getOrgIdFromRequest(req: NextRequest): string | null {
  // Try to get from Authorization header (JWT token)
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = SecurityManager.verifyToken(token);
      return decoded.orgId || null;
    } catch (e) {
      // Token invalid, fall through to x-org-id header
    }
  }
  
  // Fallback to x-org-id header
  return req.headers.get('x-org-id');
}


