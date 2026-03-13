import { Hono } from "hono";
import { generatePresignedUrl } from "../utils/s3.js";

const presignRoute = new Hono();

// Single presign via query params
presignRoute.get("/", async (c) => {
  try {
    const bucket = c.req.query("bucket");
    const key = c.req.query("key");
    if (!bucket || !key) {
      return c.json({ success: false, error: "Bucket and key are required" }, 400);
    }
    const expiresIn = Number(c.req.query("expiresIn") ?? 3600);

    const url = await generatePresignedUrl(bucket, key, expiresIn);
    return c.json({ success: true, url });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Mass presign via POST body
presignRoute.post("/", async (c) => {
  try {
    const { bucket, keys, expiresIn = 3600 } = await c.req.json<{
      bucket: string;
      keys: string[];
      expiresIn?: number;
    }>();
    if (!bucket || !keys || !Array.isArray(keys) || keys.length === 0) {
      return c.json({ success: false, error: "Bucket and non-empty keys array are required" }, 400);
    }

    const urls = await Promise.all(
      keys.map((key) => generatePresignedUrl(bucket, key, expiresIn))
    );

    return c.json({ success: true, urls });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default presignRoute;
