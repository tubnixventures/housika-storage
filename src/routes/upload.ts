import { Hono } from "hono";
import { uploadReceipt } from "../utils/s3.js";

const uploadRoute = new Hono();

uploadRoute.post("/", async (c) => {
  try {
    const bucket = c.req.query("bucket");
    const key = c.req.query("key");
    if (!bucket || !key) {
      return c.json({ success: false, error: "Bucket and key are required" }, 400);
    }

    const body = await c.req.arrayBuffer();
    const contentType = c.req.header("content-type");

    const result = await uploadReceipt(bucket, key, Buffer.from(body), contentType);
    return c.json({ success: true, result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default uploadRoute;
