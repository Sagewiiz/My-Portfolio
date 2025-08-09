import type { VercelRequest, VercelResponse } from "@vercel/node";
import jwt from "jsonwebtoken";

// In production, set these as env vars with bcrypt/argon2 hashes.
// For your quick start, we compare plain values; replace with hashes later.
const PROFILE_PASSWORDS: Record<string, string> = {
  A: process.env.PROFILE_A_PASSWORD || "meow",
  B: process.env.PROFILE_B_PASSWORD || "lock",
  C: process.env.PROFILE_C_PASSWORD || "key"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: "Password required" });

  const match = Object.entries(PROFILE_PASSWORDS).find(([_, pass]) => pass === password);
  if (!match) return res.status(401).json({ error: "Invalid password" });

  const [profileId] = match as [string, string];
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  const token = jwt.sign({ sub: profileId }, secret, { expiresIn: "1d" });
  res.status(200).json({ profileId, token });
}


