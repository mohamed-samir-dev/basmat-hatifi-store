import { NextRequest } from "next/server";

export function getBackend(): string {
  return process.env.BACKEND_URL || "http://localhost:5000";
}

export function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>), cookie };
  // لو في body من نوع FormData، منعطيش Content-Type عشان fetch يولده تلقائياً مع الـ boundary
  if (init.body instanceof FormData) {
    delete headers["content-type"];
    delete headers["Content-Type"];
  }
  return { ...init, headers };
}
