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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/users/${id}`, forwardCookies(req, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/admin/users/${id}`, forwardCookies(req, {
    method: "DELETE",
  }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
