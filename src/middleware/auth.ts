// src/middleware/auth.ts
import type { MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken";
import { getCookie } from "hono/cookie";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  // Extract token from Authorization header or cookie
  let token = c.req.header("authorization")?.replace("Bearer ", "") || getCookie(c, "token");

  if (!token) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    c.set("user", decoded);
    await next();
  } catch (err) {
    return c.json({ success: false, error: "Invalid token" }, 401);
  }
};