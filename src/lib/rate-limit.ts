type RateRecord = { count: number; windowStart: number };

const ipStore: Map<string, RateRecord> = new Map();

export function rateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const rec = ipStore.get(ip);
  if (!rec) {
    ipStore.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (now - rec.windowStart > windowMs) {
    rec.count = 1;
    rec.windowStart = now;
    return true;
  }
  if (rec.count >= limit) return false;
  rec.count += 1;
  return true;
}








