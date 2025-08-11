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
      body: JSON.stringify({ commands: [command] })
    });
    const text = await resp.text();
    if (!resp.ok) {
      console.error("Upstash error", resp.status, text);
      throw new Error(`Upstash ${resp.status}`);
    }
    try {
      return JSON.parse(text) as { result: any };
    } catch {
      return { result: text } as any;
    }
  };

  if (req.method === "GET") {
    const out = await call(["HGET", key, "content"]);
    // Upstash returns { result: [{ result: "..." }] } when using commands
    const nested = out?.result?.[0]?.result;
    const content = (nested ?? out?.result ?? "") as string;
    return res.status(200).json({ content });
  }

  if (req.method === "PUT") {
    const { content } = req.body || {};
    const out = await call([
      "HSET",
      key,
      "content",
      String(content),
      "updatedAt",
      String(Date.now())
    ]);
    const nested = (out as any)?.result?.[0]?.result ?? (out as any)?.result;
    console.log("Upstash HSET result", nested);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
