import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

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

  // Upstash Redis REST helper
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL as string;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN as string;
  const call = async (command: string[]) => {
    const resp = await fetch(upstashUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command })
    });
    return resp.json() as Promise<{ result: any }>; // result may be string | null
  };

  if (req.method === "GET") {
    const out = await call(["HGET", key, "content"]);
    const content = (out.result as string) || "";
    return res.status(200).json({ content });
  }

  if (req.method === "PUT") {
    const { content } = req.body || {};
    await call(["HSET", key, "content", String(content), "updatedAt", String(Date.now())]);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}


