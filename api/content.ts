import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Missing token" });
  const token = authorization.replace(/^Bearer\s+/i, "");
  let profileId = "";
  try {
    const secret = process.env.JWT_SECRET || "dev-secret-change-me";
    const payload = jwt.verify(token, secret) as any;
    profileId = payload.sub;
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const app = (req.query.app as string) || "typora";
  const key = `${app}:${profileId}`;

  // Upstash Redis client (Edge-safe)
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string
  });

  if (req.method === "GET") {
    const content = (await redis.hget<string>(key, "content")) || "";
    return res.status(200).json({ content });
  }

  if (req.method === "PUT") {
    const { content } = req.body || {};
    await redis.hset(key, { content: String(content), updatedAt: Date.now() });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
