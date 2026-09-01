type Bucket = { hits: number; start: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.start > windowMs) {
    buckets.set(key, { hits: 1, start: now });
    return { allowed: true, remaining: limit - 1 };
  }
  b.hits += 1;
  if (b.hits > limit) return { allowed: false, remaining: 0 };
  return { allowed: true, remaining: Math.max(0, limit - b.hits) };
}
