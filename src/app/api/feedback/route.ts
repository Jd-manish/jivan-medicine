import { db } from "@/db";
import { feedback } from "@/db/schema";
import { isHoneypotFilled, rateLimit, rejectLargeBody } from "@/lib/request-guard";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * PUBLIC read: approved feedback only.
 * contactEmail is never selected, so it cannot leak through this route.
 */
export async function GET() {
  const rows = await db
    .select({
      id: feedback.id,
      name: feedback.name,
      country: feedback.country,
      rating: feedback.rating,
      message: feedback.message,
      pinned: feedback.pinned,
      createdAt: feedback.createdAt,
    })
    .from(feedback)
    .where(eq(feedback.approved, true))
    .orderBy(desc(feedback.pinned), desc(feedback.createdAt))
    .limit(60);

  return NextResponse.json({ ok: true, rows });
}

/** PUBLIC submit. Held unapproved until an admin publishes it. */
export async function POST(request: NextRequest) {
  const tooLarge = rejectLargeBody(request);
  if (tooLarge) return tooLarge;

  const limited = rateLimit(request, "feedback", 5);
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (isHoneypotFilled(body?.website)) return NextResponse.json({ ok: true });

  const message = String(body?.message ?? "").trim();
  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please write at least 10 characters." },
      { status: 400 },
    );
  }

  const ratingRaw = Number(body?.rating ?? 5);
  const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, Math.round(ratingRaw))) : 5;

  await db.insert(feedback).values({
    name: String(body?.name ?? "").trim().slice(0, 120) || "Anonymous",
    country: String(body?.country ?? "").slice(0, 120),
    contactEmail: String(body?.contactEmail ?? "").slice(0, 200),
    rating,
    message: message.slice(0, 2000),
    approved: false,
  });

  return NextResponse.json({
    ok: true,
    message: "Thank you. Your feedback will appear on the site once reviewed.",
  });
}

/** Count of published feedback, used for the public summary. */
export async function HEAD() {
  const rows = await db
    .select({ id: feedback.id })
    .from(feedback)
    .where(and(eq(feedback.approved, true)));

  return new NextResponse(null, { headers: { "X-Total-Count": String(rows.length) } });
}
