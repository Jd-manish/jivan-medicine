"use client";

import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { useState } from "react";

export function LeadForm({ locale }: { locale: string }) {
  const [form, setForm] = useState({ name: "", email: "", country: "", medicine: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source: "price_research_review" }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setForm({ name: "", email: "", country: "", medicine: "", message: "", website: "" });
  };

  return (
    <form onSubmit={submit} className="panel rounded-3xl p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">Free Research Lookup</p>
      <h3 className="mt-2 text-xl font-semibold text-ink-900 sm:text-2xl">Request a Medicine Price Review</h3>
      <p className="mt-2 text-sm text-ink-600">
        Can&apos;t find your medication? Request an educational price comparison against verified public datasets. We do not sell or dispense medications.
      </p>
      
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="quote-website">Website</label>
        <input
          id="quote-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={update("website")}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={update("name")}
          placeholder={ui(locale, P.quoteName)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder={ui(locale, P.quoteEmail)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500"
        />
        <input
          value={form.country}
          onChange={update("country")}
          placeholder={ui(locale, P.quoteCountry)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500"
        />
        <input
          value={form.medicine}
          onChange={update("medicine")}
          placeholder="Medicine / Active Salt Name"
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500"
        />
      </div>
      <textarea
        value={form.message}
        onChange={update("message")}
        rows={3}
        placeholder="Additional details (dosage, strength, or current reference cost)..."
        className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500"
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary mt-4 w-full disabled:opacity-60">
        {status === "loading" ? "Submitting..." : "Submit Price Review Request"}
      </button>
      {status === "done" ? (
        <p className="mt-3 rounded-xl bg-mint-500/10 px-4 py-3 text-sm font-medium text-mint-600">
          Request received! Our team will check reference registries and update the public catalog.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          {ui(locale, P.quoteError)}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-ink-400">
        Educational reference only. Jivan is not a pharmacy and does not fulfill orders or prescriptions.
      </p>
    </form>
  );
}