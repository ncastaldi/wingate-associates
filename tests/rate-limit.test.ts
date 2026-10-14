import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

const MINUTE = 60_000;

describe("createRateLimiter", () => {
  it("allows hits up to the limit within the window, then refuses", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: MINUTE });
    expect([0, 1, 2].map((t) => limiter.take("a", t))).toEqual([true, true, true]);
    expect(limiter.take("a", 3)).toBe(false);
  });

  it("allows again once the oldest hit leaves the sliding window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: MINUTE });
    limiter.take("a", 0);
    limiter.take("a", 30_000);
    expect(limiter.take("a", MINUTE - 1)).toBe(false);
    expect(limiter.take("a", MINUTE)).toBe(true);
    expect(limiter.take("a", MINUTE + 1)).toBe(false);
  });

  it("does not record refused hits, so hammering does not extend the lockout", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: MINUTE });
    limiter.take("a", 0);
    for (let t = 1; t < MINUTE; t += 1_000) limiter.take("a", t);
    expect(limiter.take("a", MINUTE)).toBe(true);
  });

  it("counts each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: MINUTE });
    expect(limiter.take("a", 0)).toBe(true);
    expect(limiter.take("b", 0)).toBe(true);
    expect(limiter.take("a", 1)).toBe(false);
  });

  it("forgets the least recently used keys beyond maxKeys", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: MINUTE, maxKeys: 2 });
    limiter.take("a", 0);
    limiter.take("b", 1);
    limiter.take("c", 2);
    // "a" was evicted, so its earlier hit no longer counts.
    expect(limiter.take("a", 3)).toBe(true);
    expect(limiter.take("c", 4)).toBe(false);
  });
});
