import { db } from "@/db";
import { questions } from "@/db/schema";
import { isHoneypotFilled, rateLimit, rejectLargeBody } from "@/lib/request-guard";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * PUBLIC: submit only.
 * There is deliberately no public GET — questions are private to the admin.
 */
export async function POST(request: NextRequest) {
  const tooLarge = rejectLargeBody(request);
  if (tooLarge) return tooLarge;

  const limited = rateLimit(request, "questions", 5);
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  // Silently accept bot submissions so automated senders do not adapt.
  if (isHoneypotFilled(body?.website)) return NextResponse.json({ ok: true });

  const question = String(body?.question ?? "").trim();
  if (question.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please write at least 10 characters so we can help properly." },
      { status: 400 },
    );
  }

  const email = String(body?.email ?? "").trim();
  if (email && !email.includes("@")) {
    return NextResponse.json({ ok: false, message: "Email address looks invalid." }, { status: 400 });
  }

  await db.insert(questions).values({
    name: String(body?.name ?? "").slice(0, 120),
    email: email.slice(0, 200),
    country: String(body?.country ?? "").slice(0, 120),
    subject: String(body?.subject ?? "General").slice(0, 120),
    question: question.slice(0, 4000),
  });

  return NextResponse.json({ ok: true });
}
