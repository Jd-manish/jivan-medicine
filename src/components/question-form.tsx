"use client";

import { P } from "@/lib/ui-panels";
import { ui } from "@/lib/ui-core";
import { useState } from "react";

const subjects = [
  "General",
  "Medicine price check",
  "Is this alternative safe?",
  "Buying and shipping",
  "Website problem",
  "Report a wrong price",
];

export function QuestionForm({ locale }: { locale: string }) {
  const [form, setForm] = useState({ name: "", email: "", country: "", subject: "General", question: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = (await res.json().catch(() => ({}))) as { message?: string };

    if (!res.ok) {
      setError(json.message ?? "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("sent");
    setForm({ name: "", email: "", country: "", subject: "General", question: "", website: "" });
  };

  if (status === "sent") {
    return (
      <div className="panel rounded-3xl p-6 text-center sm:p-8">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint-500/10 text-xl text-mint-600">✓</div>
        <h3 className="mt-4 text-xl font-bold text-ink-900">{ui(locale, P.qSentTitle)}</h3>
        <p className="mt-2 text-sm leading-7 text-ink-600">
          {ui(locale, P.qSentBody)}
        </p>
        <button onClick={() => setStatus("idle")} className="btn-primary mt-5">
          {ui(locale, P.qAskAnother)}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-ink-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          {ui(locale, P.qPrivate)}
        </span>
        <span className="text-xs text-ink-400">{ui(locale, P.qPrivateNote)}</span>
      </div>

      <h2 className="mt-3 text-2xl font-bold text-ink-900">{ui(locale, P.qTitle)}</h2>
      <p className="mt-2 text-sm leading-7 text-ink-600">
        {ui(locale, P.qBody)}
      </p>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="question-website">Website</label>
        <input
          id="question-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={update("website")}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          value={form.name}
          onChange={update("name")}
          placeholder={ui(locale, P.qName)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
        />
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder={ui(locale, P.qEmail)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
        />
        <input
          value={form.country}
          onChange={update("country")}
          placeholder={ui(locale, P.qCountry)}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
        />
        <select
          value={form.subject}
          onChange={update("subject")}
          className="rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-mint-500"
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        rows={5}
        value={form.question}
        onChange={update("question")}
        placeholder={ui(locale, P.qPlaceholder)}
        className="mt-3 w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mint-500 focus:ring-4 focus:ring-mint-500/10"
      />

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-4 w-full disabled:opacity-60">
        {status === "sending" ? ui(locale, P.quoteSending) : ui(locale, P.qSubmit)}
      </button>

      {error ? <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</p> : null}

      <p className="mt-3 text-xs leading-6 text-ink-400">
        {ui(locale, P.qEmergency)}
      </p>
    </form>
  );
}
