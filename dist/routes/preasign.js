import { Hono } from "hono";
import { generatePresignedUrl } from "../utils/s3.js";
const presignRoute = new Hono();
// Single presign via query params
presignRoute.get("/", async (c) => {
    try {
        const bucket = c.req.query("bucket");
        const key = c.req.query("key");
        const expiresIn = Number(c.req.query("expiresIn") ?? 3600);
        const url = await generatePresignedUrl(bucket, key, expiresIn);
        return c.json({ success: true, url });
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
});
// Mass presign via POST body
presignRoute.post("/", async (c) => {
    try {
        const { bucket, keys, expiresIn = 3600 } = await c.req.json();
        const urls = await Promise.all(keys.map((key) => generatePresignedUrl(bucket, key, expiresIn)));
        return c.json({ success: true, urls });
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
});
export default presignRoute;
