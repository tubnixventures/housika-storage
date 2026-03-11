import { Hono } from "hono";
import { uploadReceipt } from "../utils/s3.js";

const uploadRoute = new Hono();

uploadRoute.post("/", async (c) => {
  try {
    const body = await c.req.arrayBuffer();
    const bucket = c.req.query("bucket")!;
    const key = c.req.query("key")!;

    const result = await uploadReceipt(bucket, key, Buffer.from(body));
    return c.json({ success: true, result });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default uploadRoute;
