import { isAdminRequest } from "@/lib/admin-auth";
import { getSettings, saveSettings, type SettingsMap } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<SettingsMap>;
  await saveSettings(body);
  revalidatePath("/", "layout");

  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}
