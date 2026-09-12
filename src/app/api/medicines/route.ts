import { NextRequest } from "next/server";
import { ensureMedicineSeeded, getMedicineCatalog, type CatalogParams } from "@/lib/medicines";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  await ensureMedicineSeeded();

  const catalog = await getMedicineCatalog({
    search: sp.get("search") ?? "",
    category: sp.get("category") ?? "All",
    therapyArea: sp.get("therapyArea") ?? "All",
    page: Number(sp.get("page") ?? "1") || 1,
    pageSize: Number(sp.get("pageSize") ?? "24") || 24,
    sort: (sp.get("sort") as CatalogParams["sort"]) ?? "savings",
    highSavingOnly: sp.get("highSavingOnly") === "true",
    verifiedOnly: sp.get("verifiedOnly") === "true",
  });

  return Response.json(catalog);
}
