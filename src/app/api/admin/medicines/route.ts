import { db } from "@/db";
import { medicines } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { getMedicineCatalog, slugify } from "@/lib/medicines";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
}

function normalize(body: Record<string, unknown>) {
  return {
    name: String(body.name ?? "").trim(),
    brandNames: String(body.brandNames ?? ""),
    category: String(body.category ?? "Medicine"),
    therapyArea: String(body.therapyArea ?? "General"),
    form: String(body.form ?? "Tablet"),
    company: String(body.company ?? ""),
    genericSalt: String(body.genericSalt ?? ""),
    strength: String(body.strength ?? ""),
    packSize: String(body.packSize ?? "1 pack"),
    useCases: String(body.useCases ?? ""),
    description: String(body.description ?? ""),
    dosage: String(body.dosage ?? ""),
    pros: String(body.pros ?? ""),
    cons: String(body.cons ?? ""),
    sideEffects: String(body.sideEffects ?? ""),
    usEuPrice: Number(body.usEuPrice ?? 0),
    indiaPrice: Number(body.indiaPrice ?? 0),
    priceStatus: String(body.priceStatus ?? "estimated"),
    priceNotes: String(body.priceNotes ?? ""),
    priceSource: String(body.priceSource ?? ""),
    priceSourceUrl: String(body.priceSourceUrl ?? ""),
    prescriptionRequired: Boolean(body.prescriptionRequired ?? true),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const sp = request.nextUrl.searchParams;
  const catalog = await getMedicineCatalog({
    search: sp.get("search") ?? "",
    category: sp.get("category") ?? "All",
    page: Number(sp.get("page") ?? "1") || 1,
    pageSize: Number(sp.get("pageSize") ?? "30") || 30,
    sort: "name",
  });

  return NextResponse.json({ ok: true, ...catalog });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json()) as Record<string, unknown>;
  const record = normalize(body);

  if (!record.name) {
    return NextResponse.json({ ok: false, message: "Name is required" }, { status: 400 });
  }

  const slug = `${slugify(`${record.name}-${record.strength}-${record.form}`)}-${Date.now().toString(36)}`;
  const highSaving = record.usEuPrice / Math.max(record.indiaPrice, 1) >= 5;

  const [inserted] = await db
    .insert(medicines)
    .values({ ...record, slug, highSaving })
    .returning();

  return NextResponse.json({ ok: true, item: inserted });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  const record = normalize(body);
  const highSaving = record.usEuPrice / Math.max(record.indiaPrice, 1) >= 5;

  const [updated] = await db
    .update(medicines)
    .set({ ...record, highSaving, priceLastChecked: new Date() })
    .where(eq(medicines.id, id))
    .returning();

  return NextResponse.json({ ok: true, item: updated });
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json()) as { id?: number };
  const id = Number(body.id);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
  }

  await db.delete(medicines).where(eq(medicines.id, id));
  return NextResponse.json({ ok: true });
}
