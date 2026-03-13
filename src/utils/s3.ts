// utils/s3.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(bucket: string, key: string, expiresIn = 3600) {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(r2Client, command, { expiresIn });
}

export async function uploadReceipt(bucket: string, key: string, body: Buffer | Uint8Array | string, contentType?: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType || "application/octet-stream",
  });
  return await r2Client.send(command);
}

export async function deleteObject(bucket: string, key: string) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  return await r2Client.send(command);
}

export async function deleteObjectsFromUrls(bucket: string, urls: string[]) {
  const results = [];
  for (const url of urls) {
    const key = extractKeyFromUrl(url, bucket);
    results.push(await deleteObject(bucket, key));
  }
  return results;
}

function extractKeyFromUrl(url: string, bucket: string): string {
  const u = new URL(url);
  const parts = u.pathname.split("/");
  const bucketIndex = parts.indexOf(bucket);
  if (bucketIndex === -1) throw new Error("Bucket not found in URL");
  return parts.slice(bucketIndex + 1).join("/");
}
