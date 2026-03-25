import { NextRequest, NextResponse } from "next/server";

const ALLOWED_BACKENDS = ["http://localhost:5000", "https://pasmthatfee.com", "https://backend-for-bsmastore-public-production.up.railway.app"];

function getBackend(): string {
  const url = process.env.BACKEND_URL || "http://localhost:5000";
  return ALLOWED_BACKENDS.includes(url) ? url : "http://localhost:5000";
}

function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  return { ...init, headers: { ...(init.headers as Record<string, string>), cookie } };
}

export async function GET(req: NextRequest) {
  const res = await fetch(`${getBackend()}/api/admin/users`, forwardCookies(req, {}));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/users`, forwardCookies(req, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
