import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { isValidLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <div className="shell py-10">
      <AdminPanel />
    </div>
  );
}
