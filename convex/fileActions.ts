"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import * as Minio from "minio";

function getMinioClient() {
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint) throw new Error("S3_ENDPOINT not configured");

  const url = new URL(endpoint);
  return new Minio.Client({
    endPoint: url.hostname,
    port: url.port ? parseInt(url.port) : url.protocol === "https:" ? 443 : 80,
    useSSL: url.protocol === "https:",
    accessKey: process.env.S3_ACCESS_KEY || "",
    secretKey: process.env.S3_SECRET_KEY || "",
    region: process.env.S3_REGION || "us-east-1",
  });
}

function getBucketName() {
  return process.env.S3_BUCKET_NAME || "uploads";
}

function getTtl() {
  return parseInt(process.env.S3_URL_TTL_SECONDS || "3600");
}

export const generateUploadUrl = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    fileType: v.union(
      v.literal("audio"),
      v.literal("document"),
      v.literal("image")
    ),
    userId: v.string(),
  },
  handler: async (_ctx, args) => {
    const { fileName, mimeType, size, fileType, userId } = args;

    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (size > MAX_SIZE) {
      throw new Error("File size exceeds maximum of 100MB");
    }

    const timestamp = Date.now();
    const storageKey = `uploads/${fileType}/${userId}/${timestamp}_${fileName}`;

    const client = getMinioClient();
    const bucket = getBucketName();
    const ttl = getTtl();

    const presignedUrl = await client.presignedPutObject(
      bucket,
      storageKey,
      ttl
    );

    return {
      presignedUrl,
      storageKey,
      fileName,
      mimeType,
      size,
      fileType,
    };
  },
});

export const generateDownloadUrl = action({
  args: {
    storageKey: v.string(),
  },
  handler: async (_ctx, args) => {
    const client = getMinioClient();
    const bucket = getBucketName();
    const ttl = getTtl();

    const presignedUrl = await client.presignedGetObject(
      bucket,
      args.storageKey,
      ttl
    );

    return presignedUrl;
  },
});
