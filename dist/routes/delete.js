import { Hono } from "hono";
import { deleteObject, deleteObjectsFromUrls } from "../utils/s3.js";
const deleteRoute = new Hono();
deleteRoute.delete("/", async (c) => {
    try {
        const bucket = c.req.query("bucket");
        if (!bucket) {
            return c.json({ success: false, error: "Bucket is required" }, 400);
        }
        const key = c.req.query("key");
        if (key) {
            // Single delete
            try {
                const result = await deleteObject(bucket, key);
                return c.json({ success: true, results: [result], errors: [] });
            }
            catch (err) {
                return c.json({ success: false, results: [], errors: [err.message] }, 500);
            }
        }
        // Mass delete from URLs
        let urls;
        try {
            urls = await c.req.json();
            if (!Array.isArray(urls) || urls.length === 0) {
                return c.json({ success: false, error: "Request body must be a non-empty array of URLs" }, 400);
            }
        }
        catch {
            return c.json({ success: false, error: "Invalid JSON body" }, 400);
        }
        const results = [];
        const errors = [];
        for (const url of urls) {
            try {
                const res = await deleteObjectsFromUrls(bucket, [url]);
                results.push(...res);
            }
            catch (err) {
                errors.push(`Failed to delete ${url}: ${err.message}`);
            }
        }
        return c.json({ success: errors.length === 0, results, errors });
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
});
export default deleteRoute;
