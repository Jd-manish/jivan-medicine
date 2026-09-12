import { NextRequest } from "next/server";
import { ensureMedicineSeeded, getSuggestions } from "@/lib/medicines";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  if (query.trim().length < 2) return Response.json({ items: [] });

  await ensureMedicineSeeded();
  const items = await getSuggestions(query, 8);

  return Response.json({ items });
}
