import { db } from "@/db";
import { leads } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { isHoneypotFilled, rateLimit, rejectLargeBody } from "@/lib/request-guard";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const tooLarge = rejectLargeBody(request);
  if (tooLarge) return tooLarge;

  const limited = rateLimit(request, "leads", 5);
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (isHoneypotFilled(body?.website)) return NextResponse.json({ ok: true });

  const email = String(body?.email ?? "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, message: "Valid email required" }, { status: 400 });
  }

  await db.insert(leads).values({
    name: String(body?.name ?? "").slice(0, 200),
    email: email.slice(0, 200),
    country: String(body?.country ?? "").slice(0, 120),
    medicine: String(body?.medicine ?? "").slice(0, 300),
    message: String(body?.message ?? "").slice(0, 2000),
    source: String(body?.source ?? "quote").slice(0, 60),
  });

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200);
  return NextResponse.json({ ok: true, rows });
}
