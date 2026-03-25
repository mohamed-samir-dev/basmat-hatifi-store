import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

function forwardCookies(req: NextRequest, init: RequestInit): RequestInit {
  const cookie = req.headers.get("cookie") || "";
  return { ...init, headers: { ...(init.headers as Record<string, string>), cookie } };
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`${BACKEND}/api/admin/users/${params.id}`, forwardCookies(req, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${BACKEND}/api/admin/users/${params.id}`, forwardCookies(req, {
    method: "DELETE",
  }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
