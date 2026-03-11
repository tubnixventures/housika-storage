// index.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import uploadRoute from "./routes/upload.js";
import deleteRoute from "./routes/delete.js";
import presignRoute from "./routes/preasign.js";
const app = new Hono();
// 🔎 Logger middleware
app.use("*", logger());
// 🌍 CORS middleware with `start` matcher
app.use("*", cors({
    origin: (origin) => {
        if (!origin)
            return null; // ✅ return null instead of false
        const allowedStarts = [
            "http://localhost",
            "https://housika.co.ke",
            "https://housika.com",
        ];
        return allowedStarts.some((prefix) => origin.startsWith(prefix))
            ? origin
            : null; // ✅ return null instead of false
    },
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// 🛠️ Core routes
app.route("/upload", uploadRoute);
app.route("/delete", deleteRoute);
app.route("/presign", presignRoute);
// Health check
app.get("/", (c) => c.text("Housika API running ✅"));
// 🚀 Start server
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
console.log(`Server running at http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port,
});
