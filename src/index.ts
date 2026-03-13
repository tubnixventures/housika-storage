// index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import uploadRoute from "./routes/upload.js";
import deleteRoute from "./routes/delete.js";
import presignRoute from "./routes/preasign.js";
import { authMiddleware } from "./middleware/auth.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = new Hono();

// 🔒 Security headers middleware
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
});

// � Rate limiting middleware
app.use("*", rateLimiter);

// �🔎 Logger middleware
app.use("*", logger());

// 🌍 CORS middleware with `start` matcher
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      if (origin.startsWith("http://localhost:")) return origin;
      if (origin === "https://housika.co.ke" || origin.endsWith(".housika.co.ke")) return origin;
      return null;
    },
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

// � Auth middleware for protected routes

app.use("/delete/*", authMiddleware);
app.use("/presign/*", authMiddleware);

// 🛠️ Core routes
app.route("/upload", uploadRoute);
app.route("/delete", deleteRoute);
app.route("/presign", presignRoute);

// Health check
app.get("/", (c) => c.text("Housika API running ✅"));

// 🚀 Start server
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error("R2 environment variables are required");
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
console.log(`Server running at http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
