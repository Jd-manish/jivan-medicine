import type { Metadata } from "next";
import { MedicineSearch } from "@/components/medicine-search";
import { ensureMedicineSeeded, getMedicineCatalog, medicineCategories } from "@/lib/medicines";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Search medicines — Indian alternative prices",
    description: "Search thousands of medicines, injections, life-saving drugs and equipment for lower-cost Indian alternatives.",
    alternates: { canonical: `/${locale}/search` },
  };
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await ensureMedicineSeeded();
  const initialData = await getMedicineCatalog({ page: 1, pageSize: 24, sort: "savings" });
  const categories = medicineCategories.filter((c) => c !== "All");

  return (
    <div className="shell py-8 sm:py-12">
      <MedicineSearch
        initialData={initialData}
        categories={categories}
        locale={locale}
        copy={{
          searchTitle: "Search medicines, injections, life-saving drugs, and medical equipment",
          searchPlaceholder: "Search by medicine, salt, strength, company, or use case",
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
