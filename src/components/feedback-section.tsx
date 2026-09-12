"use client";

import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { useEffect, useMemo, useState } from "react";

type FeedbackRow = {
  id: number;
  name: string;
  country: string;
  rating: number;
  message: string;
  pinned: boolean;
  createdAt: string;
};

function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-mint-500" : "fill-ink-200"}`}
          aria-hidden="true"
        >
          <path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

export function FeedbackSection({ locale }: { locale: string }) {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", contactEmail: "", rating: 5, message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const json = (await res.json()) as { rows: FeedbackRow[] };
      setRows(json.rows ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const average = useMemo(() => {
    if (rows.length === 0) return 0;
    return rows.reduce((sum, row) => sum + row.rating, 0) / rows.length;
  }, [rows]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = (await res.json().catch(() => ({}))) as { message?: string };

    if (!res.ok) {
      setNote(json.message ?? "Something went wrong.");
      setStatus("error");
      return;
    }

    setNote(json.message ?? "Thank you for your feedback.");
    setStatus("sent");
    setForm({ name: "", country: "", contactEmail: "", rating: 5, message: "", website: "" });
  };

  return (
    <section id="feedback" className="shell scroll-mt-24 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-600">{ui(locale, P.fbKicker)}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {ui(locale, P.fbTitle)}
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-600">
            {ui(locale, P.fbSub)}
          </p>
        </div>

        {rows.length > 0 ? (
          <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-ink-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-ink-900">{average.toFixed(1)}</span>
              <div>
                <Stars rating={Math.round(average)} />
                <p className="mt-1 text-xs text-ink-400">{rows.length} {ui(locale, P.fbPublished)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Published feedback */}
      {loading ? (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-3xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="panel mt-10 rounded-3xl p-8 text-center">
          <p className="text-sm text-ink-600">
            {ui(locale, P.fbEmpty)}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {rows.slice(0, 6).map((row) => (
            <figure key={row.id} className="panel panel-hover relative rounded-3xl p-6">
              {row.pinned ? (
                <span className="absolute right-4 top-4 rounded-lg bg-mint-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-mint-600">
                  {ui(locale, P.fbFeatured)}
                </span>
              ) : null}
              <Stars rating={row.rating} />
              <blockquote className="mt-4 text-sm leading-7 text-ink-600">“{row.message}”</blockquote>
              <figcaption className="mt-5 border-t border-ink-100 pt-4">
                <p className="text-sm font-bold text-ink-900">{row.name}</p>
                {row.country ? <p className="text-xs text-ink-400">{row.country}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        {!open ? (
          <button onClick={() => setOpen(true)} className="btn-primary">
            {ui(locale, P.fbLeave)}
          </button>
        ) : (
          <form onSubmit={submit} className="panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-ink-900">{ui(locale, P.fbShareTitle)}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-ink-400 hover:text-ink-900"
                aria-label="Close feedback form"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-sm text-ink-600">
              {ui(locale, P.fbShareSub)}
            </p>

            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="feedback-website">Website</label>
              <input
                id="feedback-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              />
            </div>

            <div className="mt-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{ui(locale, P.fbRatingLabel)}</span>
              <div className="mt-2 flex gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: value }))}
                    aria-label={`Rate ${value} out of 5`}
                    className="transition hover:scale-110"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-7 w-7 ${value <= form.rating ? "fill-mint-500" : "fill-ink-200"}`}
                    >
                      <path d="m10 1.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={ui(locale, P.fbDisplayName)}
                className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-mint-500"
              />
              <input
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                placeholder={ui(locale, P.qCountry)}
                className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-mint-500"
              />
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                placeholder={ui(locale, P.qEmail)}
                className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-mint-500"
              />
            </div>

            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder={ui(locale, P.fbMsgPlaceholder)}
              className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none focus:border-mint-500"
            />

            <button type="submit" disabled={status === "sending"} className="btn-primary mt-4 disabled:opacity-60">
              {status === "sending" ? ui(locale, P.quoteSending) : ui(locale, P.fbSubmit)}
            </button>

            {note ? (
              <p
                className={`mt-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  status === "error" ? "bg-rose-50 text-rose-600" : "bg-mint-500/10 text-mint-600"
                }`}
              >
                {note}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
