import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../../_lib";

async function safeJson(res: Response) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { ok: res.ok }; }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", cookie: req.headers.get("cookie") || "" },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await safeJson(res), { status: res.status });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/admin/orders/${id}`, {
    method: "DELETE",
    headers: { cookie: req.headers.get("cookie") || "" },
  });
  return NextResponse.json(await safeJson(res), { status: res.status });
}
