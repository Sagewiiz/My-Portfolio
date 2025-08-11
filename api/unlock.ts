import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Simple in-memory rate limit per IP (best-effort; resets per function instance)
const attemptsByIp: Record<string, number[]> = {};
const MAX_ATTEMPTS = 10; // per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  // Compare equal-length buffers in constant time
  if (a.length !== b.length) {
    // Compare with same length to avoid early return timing leak
    const pad = Buffer.alloc(Math.max(a.length, b.length));
    try {
      crypto.timingSafeEqual(
        Buffer.concat([a, pad.slice(0, pad.length - a.length)]),
        Buffer.concat([b, pad.slice(0, pad.length - b.length)])
      );
    } catch (_) {}
    return false;
  }
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function hashPassword(password: string, salt: string): string {
  // scrypt with 64-byte key, hex-encoded
  const key = crypto.scryptSync(password, salt, 64);
  return key.toString("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Rate limit
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";
  const now = Date.now();
  const arr = (attemptsByIp[ip] = (attemptsByIp[ip] || []).filter(
    (t) => now - t < WINDOW_MS
  ));
  if (arr.length >= MAX_ATTEMPTS)
    return res.status(429).json({ error: "Too many attempts, try later" });

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Password required" });

  const HASHES: Record<"A" | "B" | "C", string | undefined> = {
    A: process.env.PROFILE_A_PASSWORD_HASH,
    B: process.env.PROFILE_B_PASSWORD_HASH,
    C: process.env.PROFILE_C_PASSWORD_HASH
  };
  const salt = process.env.PASSWORD_SALT || process.env.JWT_SECRET;
  if (!HASHES.A || !HASHES.B || !HASHES.C || !salt) {
    return res.status(500).json({ error: "Server not configured" });
  }

  const providedHash = hashPassword(password, String(salt));
  let profileId: "A" | "B" | "C" | null = null;
  (Object.keys(HASHES) as Array<"A" | "B" | "C">).forEach((id) => {
    if (
      !profileId &&
      HASHES[id] &&
      timingSafeEqualHex(providedHash, String(HASHES[id]))
    ) {
      profileId = id;
    }
  });
  arr.push(now);

  if (!profileId) return res.status(401).json({ error: "Invalid password" });

  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  const token = jwt.sign({ sub: profileId }, secret, { expiresIn: "1d" });
  res.status(200).json({ profileId, token });
}
