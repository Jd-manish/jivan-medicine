import type { Metadata } from "next";
import { MedicineSearch } from "@/components/medicine-search";
import { ensureMedicineSeeded, getMedicineCatalog, medicineCategories } from "@/lib/medicines";
import { localizedAlternates, localizedRobots } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Search medicines — Indian alternative prices",
    description: "Search medicines, health conditions, symptoms, drug classes and 25 procedure guides. Compare source-linked Indian prices where the catalog has a verified match.",
    alternates: localizedAlternates(locale, "search"),
    robots: localizedRobots(locale),
  };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await ensureMedicineSeeded();
  const initialData = await getMedicineCatalog({ page: 1, pageSize: 180, sort: "savings" });
  const categories = medicineCategories.filter((c) => c !== "All");

  return (
    <div className="shell py-8 sm:py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Search Jivan</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">Search medicines, diseases, symptoms, drug classes and operations</h1>
        <p className="mt-3 text-sm leading-6 text-ink-600">Find source-linked Indian medicine alternatives and compare operation or procedure cost guides. Search accepts common misspellings and suggests a correction when available.</p>
      </header>
      <MedicineSearch
        initialData={initialData}
        categories={categories}
        locale={locale}
        copy={{
          searchTitle: "Search medicines, conditions, symptoms, drug classes, procedures, and medical equipment",
          searchPlaceholder: "Search medicine, symptom, disease, drug class, operation, or procedure",
          allCategories: "All categories",
          tableMedicine: "Medicine",
          tableCategory: "Category",
          tableUses: "Use cases",
          tableCompany: "Company",
          tableSalt: "Active salt",
          tableUsEuPrice: "US/EU price",
          tableIndiaPrice: "India price",
          tableSavings: "Savings",
          tablePriceStatus: "Price status",
          tablePriceNotes: "Price note",
          noResults: "No medicines matched your filters.",
          resultsLabel: "results",
          pricingReal: "Market checked",
          pricingEstimated: "Estimated",
        }}
      />
    </div>
  );
}
