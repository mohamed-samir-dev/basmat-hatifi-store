import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/admin/products/${id}`, forwardCookies(req, { method: "GET" }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const cookie = req.headers.get("cookie") || "";
    const body = await req.json();
    const res = await fetch(`${getBackend()}/api/admin/products/${id}`, {
      method: "PUT",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ error: text }, { status: res.status });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/admin/products/${id}`, forwardCookies(req, { method: "DELETE" }));
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: res.status });
}
