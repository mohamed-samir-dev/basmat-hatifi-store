import { NextRequest } from "next/server";

const ALLOWED_BACKENDS = [
  "http://localhost:5000",
  "https://pasmthatfee.com",
  "https://api.pasmthatfee.com",
  "https://backend-for-bsmastore-public-production.up.railway.app",
];

export function getBackend(): string {
  const url = process.env.BACKEND_URL || "http://localhost:5000";
  return ALLOWED_BACKENDS.includes(url) ? url : "http://localhost:5000";
}

export function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  return { ...init, headers: { ...(init.headers as Record<string, string>), cookie } };
}
