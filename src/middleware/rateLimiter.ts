// src/middleware/rateLimiter.ts
import type { MiddlewareHandler } from "hono";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.connect().catch(console.error);

export const rateLimiter: MiddlewareHandler = async (c, next) => {
  const ip = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
  const key = `rate_limit:${ip}`;
  const limit = 100; // requests per minute
  const window = 60; // seconds

  try {
    const current = await redisClient.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= limit) {
      return c.json({ success: false, error: "Rate limit exceeded" }, 429);
    }

    await redisClient.multi().incr(key).expire(key, window).exec();
    await next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    await next(); // Continue if Redis fails
  }
};