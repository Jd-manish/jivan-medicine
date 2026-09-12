import { db } from "@/db";
import { questions } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { desc, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function denied() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

/** Admin-only: read every submitted question. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const rows = await db.select().from(questions).orderBy(desc(questions.createdAt)).limit(500);
  const unread = rows.filter((row) => row.status === "new").length;

  return NextResponse.json({ ok: true, rows, unread });
}

/** Admin-only: update status or attach a private note. */
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const body = (await request.json()) as { id?: number; status?: string; adminNote?: string };
  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const patch: Record<string, string> = {};
  if (body.status && ["new", "read", "answered"].includes(body.status)) patch.status = body.status;
  if (typeof body.adminNote === "string") patch.adminNote = body.adminNote.slice(0, 2000);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, message: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db.update(questions).set(patch).where(eq(questions.id, id)).returning();
  return NextResponse.json({ ok: true, item: updated });
}

/** Admin-only: delete one question, or several at once. */
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const body = (await request.json()) as { id?: number; ids?: number[] };

  if (Array.isArray(body.ids) && body.ids.length > 0) {
    const ids = body.ids.map(Number).filter(Number.isFinite);
    if (ids.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid ids" }, { status: 400 });
    }
    await db.delete(questions).where(inArray(questions.id, ids));
    return NextResponse.json({ ok: true, deleted: ids.length });
  }

  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  await db.delete(questions).where(eq(questions.id, id));
  return NextResponse.json({ ok: true, deleted: 1 });
}
