import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetch(`${getBackend()}/api/admin/banks/${id}`, forwardCookies(req, { method: "DELETE" }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await req.formData();
  const cookie = req.headers.get("cookie") || "";
  const res = await fetch(`${getBackend()}/api/admin/banks/${id}`, {
    method: "PUT",
    headers: { cookie },
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
