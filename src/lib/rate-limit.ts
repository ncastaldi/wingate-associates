export type RateLimitOptions = {
  // Allowed hits per key within the window.
  limit: number;
  windowMs: number;
  // Oldest keys are dropped beyond this, so memory stays bounded under many IPs.
  maxKeys?: number;
};

export type RateLimiter = {
  // Records a hit and returns true if the key is under its limit; returns false
  // (recording nothing) if the key has already used its allowance.
  take(key: string, now?: number): boolean;
};

// Sliding-window limiter held in process memory. The site runs as one `web`
// container, so this is the whole picture; a restart resets the counts.
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
}: RateLimitOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    take(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      // Re-insert so the Map's order runs from least to most recently used.
      hits.delete(key);
      hits.set(key, recent);
      while (hits.size > maxKeys) {
        const oldest = hits.keys().next().value;
        if (oldest === undefined) break;
        hits.delete(oldest);
      }
      return true;
    },
  };
}
