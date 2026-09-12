import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  const match = settings.ads_client_id.trim().match(/^ca-(pub-\d{10,20})$/);

  const body = match
    ? `google.com, ${match[1]}, DIRECT, f08c47fec0942fa0\n`
    : "# AdSense publisher ID is not configured yet. Add it in Jivan Admin > Donations & Ads.\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
