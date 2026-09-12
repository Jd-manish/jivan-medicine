import { db } from "@/db";
import { feedback } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function denied() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

/** Refresh cached pages that render published feedback. */
function purge() {
  revalidatePath("/", "layout");
}

/** Admin-only: every row including unapproved submissions and contact emails. */
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const rows = await db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(500);
  const pending = rows.filter((row) => !row.approved).length;

  return NextResponse.json({ ok: true, rows, pending });
}

/** Admin-only: approve, unapprove, pin or edit a feedback entry. */
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const body = (await request.json()) as {
    id?: number;
    approved?: boolean;
    pinned?: boolean;
    message?: string;
    name?: string;
  };

  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.approved === "boolean") patch.approved = body.approved;
  if (typeof body.pinned === "boolean") patch.pinned = body.pinned;
  if (typeof body.message === "string") patch.message = body.message.slice(0, 2000);
  if (typeof body.name === "string") patch.name = body.name.slice(0, 120) || "Anonymous";

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, message: "Nothing to update" }, { status: 400 });
  }

  const [updated] = await db.update(feedback).set(patch).where(eq(feedback.id, id)).returning();
  purge();

  return NextResponse.json({ ok: true, item: updated });
}

/** Admin-only: delete one or many feedback entries. */
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return denied();

  const body = (await request.json()) as { id?: number; ids?: number[] };

  if (Array.isArray(body.ids) && body.ids.length > 0) {
    const ids = body.ids.map(Number).filter(Number.isFinite);
    if (ids.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid ids" }, { status: 400 });
    }
    await db.delete(feedback).where(inArray(feedback.id, ids));
    purge();
    return NextResponse.json({ ok: true, deleted: ids.length });
  }

  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  await db.delete(feedback).where(eq(feedback.id, id));
  purge();

  return NextResponse.json({ ok: true, deleted: 1 });
}
