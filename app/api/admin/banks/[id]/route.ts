import { NextRequest, NextResponse } from "next/server";
import { getBackend, forwardCookies } from "../../_lib";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const res = await fetch(`${getBackend()}/api/admin/banks/${params.id}`, forwardCookies(req, { method: "DELETE" }));
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const cookie = req.headers.get("cookie") || "";
  const res = await fetch(`${getBackend()}/api/admin/banks/${params.id}`, {
    method: "PUT",
    headers: { cookie },
    body: formData,
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
