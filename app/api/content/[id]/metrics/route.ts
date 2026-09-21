import { NextRequest, NextResponse } from "next/server";
import { getContentItem, updateContentItem, userCanAccessClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { id } = await params;
  const existing = getContentItem(id);
  if (!existing) return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  if (!userCanAccessClient(existing.clientId, user.id)) {
    return NextResponse.json({ error: "No tienes acceso a este cliente." }, { status: 403 });
  }
  const body = await req.json();

  const numOrNull = (v: unknown) => (v === "" || v === undefined || v === null ? null : Number(v));

  const item = updateContentItem(id, {
    reach: numOrNull(body.reach),
    likes: numOrNull(body.likes),
    comments: numOrNull(body.comments),
    saves: numOrNull(body.saves),
    shares: numOrNull(body.shares),
    profileVisits: numOrNull(body.profileVisits),
    followersGained: numOrNull(body.followersGained),
    metricsUpdatedAt: new Date().toISOString(),
  });

  return NextResponse.json(item);
}
