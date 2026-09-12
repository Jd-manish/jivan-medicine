import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description: "Important medical disclaimer for medicine comparisons shown on Jivan.",
};

export default async function MedicalDisclaimerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <section className="shell panel my-12 rounded-3xl p-6 sm:p-9">
      <h1 className="text-3xl font-bold text-ink-900">Medical Disclaimer</h1>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
        <p>All medicine content on Jivan is for educational and affordability comparison purposes only.</p>
        <p>Do not start, stop, replace, or modify any prescription medicine without guidance from a licensed physician.</p>
        <p>If you have severe symptoms, allergic reactions, or emergency concerns, seek immediate local emergency medical care.</p>
      </div>
    </section>
  );
}
