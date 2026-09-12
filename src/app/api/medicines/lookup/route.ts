import { NextRequest } from "next/server";
import { lookupMedicine } from "@/lib/external-lookup";
import { rateLimit } from "@/lib/request-guard";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "medicine-lookup", 30, 10 * 60 * 1000);
  if (limited) return limited;

  const query = request.nextUrl.searchParams.get("q") ?? "";

  if (query.trim().length < 2) {
    return Response.json({ ok: false, message: "Query too short" }, { status: 400 });
  }

  try {
    const result = await lookupMedicine(query);
    return Response.json({ ok: true, result });
  } catch {
    return Response.json({ ok: false, message: "Lookup failed" }, { status: 502 });
  }
}
