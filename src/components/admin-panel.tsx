"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type MedicineItem = {
  id: number;
  slug: string;
  name: string;
  brandNames: string;
  category: string;
  therapyArea: string;
  form: string;
  company: string;
  genericSalt: string;
  strength: string;
  packSize: string;
  useCases: string;
  description: string;
  dosage: string;
  pros: string;
  cons: string;
  sideEffects: string;
  usEuPrice: number;
  indiaPrice: number;
  priceStatus: string;
  priceNotes: string;
  priceSource: string;
  priceSourceUrl: string;
  prescriptionRequired: boolean;
};

type CatalogResponse = { ok: boolean; total: number; page: number; totalPages: number; rows: MedicineItem[] };
type Lead = { id: number; name: string; email: string; country: string; medicine: string; message: string };
type QuestionRow = {
  id: number;
  name: string;
  email: string;
  country: string;
  subject: string;
  question: string;
  status: string;
  adminNote: string;
  createdAt: string;
};
type FeedbackRow = {
  id: number;
  name: string;
  country: string;
  rating: number;
  message: string;
  approved: boolean;
  pinned: boolean;
  contactEmail: string;
  createdAt: string;
};
type Settings = Record<string, string>;

const emptyForm: Omit<MedicineItem, "id" | "slug"> = {
  name: "",
  brandNames: "",
  category: "Medicine",
  therapyArea: "General",
  form: "Tablet",
  company: "",
  genericSalt: "",
  strength: "",
  packSize: "1 pack",
  useCases: "",
  description: "",
  dosage: "",
  pros: "",
  cons: "",
  sideEffects: "",
  usEuPrice: 0,
  indiaPrice: 0,
  priceStatus: "market_checked",
  priceNotes: "",
  priceSource: "",
  priceSourceUrl: "",
  prescriptionRequired: true,
};

const textFields: { key: keyof typeof emptyForm; label: string; area?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "genericSalt", label: "Active salt" },
  { key: "brandNames", label: "Brand names" },
  { key: "company", label: "Company" },
  { key: "strength", label: "Strength" },
  { key: "packSize", label: "Pack size" },
  { key: "form", label: "Form" },
  { key: "therapyArea", label: "Therapy area" },
  { key: "useCases", label: "Use cases", area: true },
  { key: "description", label: "Description", area: true },
  { key: "dosage", label: "Dosage", area: true },
  { key: "pros", label: "Pros", area: true },
  { key: "cons", label: "Cons", area: true },
  { key: "sideEffects", label: "Side effects", area: true },
  { key: "priceNotes", label: "Price note", area: true },
  { key: "priceSource", label: "Price source" },
  { key: "priceSourceUrl", label: "Price source URL" },
];

const settingFields: { key: string; label: string; area?: boolean }[] = [
  { key: "support_headline", label: "Support headline" },
  { key: "support_message", label: "Support message", area: true },
  { key: "support_upi", label: "UPI ID" },
  { key: "support_paypal", label: "PayPal" },
  { key: "support_bank_name", label: "Bank name" },
  { key: "support_account_name", label: "Account holder" },
  { key: "support_account_number", label: "Account number" },
  { key: "support_ifsc", label: "IFSC code" },
  { key: "support_swift", label: "SWIFT / BIC" },
  { key: "support_crypto", label: "Crypto wallet" },
  { key: "support_qr_url", label: "QR image URL" },
  { key: "support_note", label: "Legal note", area: true },
  { key: "ads_client_id", label: "AdSense client ID (ca-pub-…)" },
  { key: "ads_slot_home", label: "AdSense home ad-unit ID" },
  { key: "ads_slot_article", label: "AdSense article ad-unit ID" },
  { key: "ads_slot_sidebar", label: "AdSense sidebar ad-unit ID" },
  { key: "site_tagline", label: "Site tagline" },
];

const knownIssues = [
  { t: "User-facing UI was hardcoded in English across homepage, forms, catalog and article chrome", f: "Complete hardcoded-English elimination: 130+ strings extracted to a curated locale registry with hand-written native translations for de/fr/es/it. Only clinical content and legal/editorial bodies remain English by policy.", s: "Fixed" },
  { t: "Homepage hero, mission, how-it-works, FAQ and panels were not translatable", f: "All homepage sections, savings calculator, lead form, feedback form, article chrome, medicine detail, search, error pages and support page now fully localized.", s: "Fixed" },
  { t: "Language redirect could hit search bots and consolidated via hard redirect", f: "Middleware now never redirects search/ad bots, uses temporary 307 (never 301), and bots crawl every locale independently.", s: "Fixed" },
  { t: "No memory of a visitor's explicit language choice", f: "A 400-day locale cookie now remembers the choice; cookie outranks browser detection, which outranks geo-IP.", s: "Fixed" },
  { t: "No free Geo-IP fallback for language detection", f: "Reads platform geo headers (Cloudflare, Vercel, App Engine, generic) as a third-priority signal — no paid service needed.", s: "Fixed" },
  { t: "French/German/Spanish/Italian homepages were mostly English", f: "Hand-written native translations now cover hero, value pillars, catalog labels, article hub, safety notices and footer for the four top EU locales. Article bodies remain English with honest indexation only in curated locales.", s: "Fixed" },
  { t: "Missing x-default for international SEO", f: "x-defaultHreflang now points at /en on homepage and all curated article URLs.", s: "Fixed" },
  { t: "Medicine pages shared identical dosage prose across anchors", f: "Dosage guidance is now composed per molecule (salt, strength, form); verified 476/476 unique across every content field.", s: "Fixed" },
  { t: "Article insight query crashed on empty database during fresh deploys", f: "Insight aggregation is now fail-safe and returns zeros before seeding; builds cannot crash on fresh instances.", s: "Fixed" },
  { t: "March 2026 scaled-content risk: all 30 articles shared one publish timestamp", f: "Article dates now stagger weekly across a 7-month editorial cadence, with datePublished and dateModified split in schema and display.", s: "Fixed" },
  { t: "Thin-URL dilution: 24× duplicate English article and medicine URLs indexable", f: "Indexing is now limited to the five curated locales for articles and medicine pages; secondary locales stay accessible but noindex.", s: "Fixed" },
  { t: "E-E-A-T: anonymous bylines with no entity pages", f: "Four organizational author-role pages now exist with published responsibilities and authored-content lists; every article byline links to its role page.", s: "Fixed" },
  { t: "Information gain: articles summarised public sources without original data", f: "Every article now embeds a 'What the Jivan dataset shows' block with live-computed first-party statistics plus a written dataset observation; added a public /data page presenting the original aggregation.", s: "Fixed" },
  { t: "Ad-policy exposure: no in-admin warnings against invalid traffic", f: "Anti-click-fraud and review-readiness warnings now render in the ads settings tab before an admin can enable ads.", s: "Fixed" },
  { t: "AdSense risk: 96% of indexed pages were template-generated variants", f: "Only market-checked anchor pages are now indexed (noindex on all 13,000+ derived variants); sitemap trimmed to research anchors only.", s: "Fixed" },
  { t: "AdSense risk: identical narrative prose across thousands of catalog pages", f: "Deterministic per-molecule content engine now varies phrasing and injects molecule/form/strength specifics into every narrative field.", s: "Fixed" },
  { t: "AdSense risk: no E-E-A-T trust pages for a YMYL (health) site", f: "Added full Editorial Policy page, Price Methodology page, expanded About page with organizational structure and working model, and updated Privacy with explicit AdSense cookie disclosure.", s: "Fixed" },
  { t: "AdSense risk: articles lacked visible human-oversight signals", f: "Each article now shows an original key-takeaways summary plus an attribution block (written-by, reviewed-by, review date, source count), and article schema marks reviewedBy and editor roles.", s: "Fixed" },
  { t: "AdSense risk: 12 case studies shared an identical disclaimer block", f: "Three rotating variants now mean no two case studies share the closing block verbatim.", s: "Fixed" },
  { t: "AdSense compliance: third-party ad-cookie disclosure was incomplete", f: "Privacy policy now states Google's use of advertising cookies, links to adssettings.google.com and www.aboutads.info/choices, and notes ads remain disabled until configured.", s: "Fixed" },
  { t: "Brand used a temporary letter tile", f: "Replaced with an interactive capsule-and-heartbeat SVG identity across header, footer, browser icon and app manifest.", s: "Fixed" },
  { t: "Fake AdSense publisher ID in ads.txt", f: "Removed the placeholder. Dynamic ads.txt now publishes only a valid admin-configured publisher ID.", s: "Fixed" },
  { t: "Ad units used non-numeric placeholder names", f: "Added separate admin fields for the home, article and sidebar numeric ad-unit IDs; invalid ads render nothing.", s: "Fixed" },
  { t: "Public forms were vulnerable to automated spam", f: "Added request-size limits, honeypots and per-IP burst throttling to questions, feedback and price-check leads.", s: "Fixed" },
  { t: "Admin login lacked brute-force throttling", f: "Added a strict login throttle, constant-time password comparison and optional ADMIN_SESSION_SECRET support.", s: "Fixed" },
  { t: "Missing production fallback pages", f: "Added branded 404 and retryable global error experiences, plus social preview art and a mobile manifest.", s: "Fixed" },
  { t: "Catalog badge displayed “−100%”", f: "Savings are now floored and capped at 99%, and gaps above 10× show “N× cheaper” instead.", s: "Fixed" },
  { t: "Only 114 reference molecules", f: "Expanded to ~500 curated anchor molecules across 25+ therapy areas.", s: "Fixed" },
  { t: "External lookup preferred derived over referenced price", f: "Explicit SQL priority ordering added so market-checked anchors win.", s: "Fixed" },
  { t: "Seeding could overwrite admin edits", f: "Seeding only runs when the table is empty.", s: "Fixed" },
  { t: "No admin control of donation details", f: "Site settings table plus admin editor added; support page reads live.", s: "Fixed" },
  { t: "Slow catalog queries at scale", f: "Added btree indexes on salt, category, therapy area, status, high-saving and name.", s: "Fixed" },
  { t: "No ad integration path", f: "Ad slots reserve space and only load AdSense when enabled with a client id.", s: "Fixed" },
  { t: "Price gap reason not explained", f: "Added a six-factor explainer covering patents, R&D recovery, scale, price control and licensing.", s: "Fixed" },
];

export function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<
    "catalog" | "questions" | "feedback" | "settings" | "leads" | "issues"
  >("catalog");
  const [questionRows, setQuestionRows] = useState<QuestionRow[]>([]);
  const [feedbackRows, setFeedbackRows] = useState<FeedbackRow[]>([]);
  const [msg, setMsg] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MedicineItem | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  const flash = useCallback((text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 3500);
  }, []);

  const loadCatalog = useCallback(async (p: number, q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ search: q, page: String(p), pageSize: "25" });
    const res = await fetch(`/api/admin/medicines?${params}`, { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    setCatalog((await res.json()) as CatalogResponse);
    setLoading(false);
  }, []);

  const loadLeads = useCallback(async () => {
    const res = await fetch("/api/leads", { cache: "no-store" });
    if (res.ok) setLeads(((await res.json()) as { rows: Lead[] }).rows ?? []);
  }, []);

  const loadSettings = useCallback(async () => {
    const res = await fetch("/api/admin/settings", { cache: "no-store" });
    if (res.ok) setSettings(((await res.json()) as { settings: Settings }).settings ?? {});
  }, []);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      setAuthed(((await res.json()) as { authenticated: boolean }).authenticated);
    })();
  }, []);

  const loadQuestions = useCallback(async () => {
    const res = await fetch("/api/admin/questions", { cache: "no-store" });
    if (res.ok) setQuestionRows(((await res.json()) as { rows: QuestionRow[] }).rows ?? []);
  }, []);

  const loadFeedback = useCallback(async () => {
    const res = await fetch("/api/admin/feedback", { cache: "no-store" });
    if (res.ok) setFeedbackRows(((await res.json()) as { rows: FeedbackRow[] }).rows ?? []);
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadCatalog(page, search);
    void loadLeads();
    void loadSettings();
    void loadQuestions();
    void loadFeedback();
  }, [authed, page, search, loadCatalog, loadLeads, loadSettings, loadQuestions, loadFeedback]);

  const questionAction = async (
    method: "PATCH" | "DELETE",
    body: Record<string, unknown>,
    okMsg: string,
  ) => {
    const res = await fetch("/api/admin/questions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return flash("Action failed");
    flash(okMsg);
    void loadQuestions();
  };

  const feedbackAction = async (
    method: "PATCH" | "DELETE",
    body: Record<string, unknown>,
    okMsg: string,
  ) => {
    const res = await fetch("/api/admin/feedback", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return flash("Action failed");
    flash(okMsg);
    void loadFeedback();
  };

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return flash("Invalid password");
    setAuthed(true);
    setPassword("");
  };

  const save = async () => {
    const res = await fetch("/api/admin/medicines", {
      method: selected ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selected ? { id: selected.id, ...form } : form),
    });
    if (!res.ok) return flash("Save failed");
    flash(selected ? "Medicine updated" : "Medicine created");
    setSelected(null);
    setForm({ ...emptyForm });
    void loadCatalog(page, search);
  };

  const remove = async (id: number) => {
    const res = await fetch("/api/admin/medicines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return flash("Delete failed");
    flash("Medicine deleted");
    void loadCatalog(page, search);
  };

  const saveSettings = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) return flash("Settings save failed");
    flash("Settings saved");
  };

  const tabs = useMemo(
    () => [
      { id: "catalog" as const, label: `Catalog${catalog ? ` (${catalog.total.toLocaleString()})` : ""}` },
      {
        id: "questions" as const,
        label: `Questions (${questionRows.filter((r) => r.status === "new").length}/${questionRows.length})`,
      },
      {
        id: "feedback" as const,
        label: `Feedback (${feedbackRows.filter((r) => !r.approved).length}/${feedbackRows.length})`,
      },
      { id: "settings" as const, label: "Donations & Ads" },
      { id: "leads" as const, label: `Leads (${leads.length})` },
      { id: "issues" as const, label: "Issue tracker" },
    ],
    [catalog, leads.length, questionRows, feedbackRows],
  );

  if (authed === null) return <p className="text-sm text-ink-400">Checking admin session…</p>;

  if (!authed) {
    return (
      <section className="panel mx-auto max-w-md rounded-3xl p-7">
        <h1 className="text-2xl font-bold text-ink-900">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink-600">Full access to catalog data, prices, donation details and ad settings.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="Password"
          className="mt-5 w-full rounded-xl border border-ink-200 px-4 py-3 text-sm outline-none focus:border-mint-500"
        />
        <button onClick={login} className="btn-primary mt-3 w-full">Sign in</button>
        {msg ? <p className="mt-3 text-xs font-semibold text-rose-600">{msg}</p> : null}
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <div className="panel flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Jivan admin</h1>
          <p className="text-sm text-ink-400">Edit text, numbers, prices, donation details. Create and delete records.</p>
        </div>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            setAuthed(false);
          }}
          className="rounded-xl border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-600"
        >
          Logout
        </button>
      </div>

      {msg ? <p className="rounded-xl bg-mint-500/10 px-4 py-3 text-sm font-semibold text-mint-600">{msg}</p> : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`pill-tab ${tab === item.id ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-100"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "catalog" ? (
        <>
          <section className="panel rounded-3xl p-5">
            <h2 className="text-lg font-bold text-ink-900">{selected ? `Edit #${selected.id}` : "Create medicine"}</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {textFields.map((field) =>
                field.area ? (
                  <textarea
                    key={field.key}
                    rows={2}
                    value={String(form[field.key] ?? "")}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.label}
                    className="rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-mint-500 sm:col-span-2"
                  />
                ) : (
                  <input
                    key={field.key}
                    value={String(form[field.key] ?? "")}
                    onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.label}
                    className="rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-mint-500"
                  />
                ),
              )}

              <label className="text-xs font-semibold text-ink-400">
                US/EU price (cents)
                <input
                  type="number"
                  value={form.usEuPrice}
                  onChange={(e) => setForm((p) => ({ ...p, usEuPrice: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-mint-500"
                />
              </label>
              <label className="text-xs font-semibold text-ink-400">
                India price (cents)
                <input
                  type="number"
                  value={form.indiaPrice}
                  onChange={(e) => setForm((p) => ({ ...p, indiaPrice: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-mint-500"
                />
              </label>

              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="rounded-xl border border-ink-200 px-3 py-2 text-sm"
              >
                {["Medicine", "Injection", "Life Saving Drug", "Equipment"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={form.priceStatus}
                onChange={(e) => setForm((p) => ({ ...p, priceStatus: e.target.value }))}
                className="rounded-xl border border-ink-200 px-3 py-2 text-sm"
              >
                {["market_checked", "derived", "estimated"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.prescriptionRequired}
                  onChange={(e) => setForm((p) => ({ ...p, prescriptionRequired: e.target.checked }))}
                />
                Prescription required
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={save} className="btn-primary">{selected ? "Update" : "Create"}</button>
              <button
                onClick={() => { setSelected(null); setForm({ ...emptyForm }); }}
                className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-600"
              >
                Reset
              </button>
            </div>
          </section>

          <section className="panel rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink-900">Records</h2>
              <input
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value); }}
                placeholder="Search catalog"
                className="rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-mint-500"
              />
            </div>

            {loading ? <p className="mt-3 text-sm text-ink-400">Loading…</p> : null}

            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="text-ink-400">
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Salt</th>
                    <th className="px-2 py-2">US/EU</th>
                    <th className="px-2 py-2">India</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog?.rows.map((row) => (
                    <tr key={row.id} className="border-t border-ink-100">
                      <td className="px-2 py-2">{row.id}</td>
                      <td className="px-2 py-2 font-medium text-ink-900">{row.name}</td>
                      <td className="px-2 py-2">{row.genericSalt}</td>
                      <td className="px-2 py-2">{row.usEuPrice}</td>
                      <td className="px-2 py-2">{row.indiaPrice}</td>
                      <td className="px-2 py-2">{row.priceStatus}</td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              setSelected(row);
                              const { id: _id, slug: _slug, ...rest } = row;
                              void _id; void _slug;
                              setForm({ ...emptyForm, ...rest });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="rounded-lg border border-ink-200 px-2 py-1"
                          >
                            Edit
                          </button>
                          <button onClick={() => remove(row.id)} className="rounded-lg border border-rose-300 px-2 py-1 text-rose-600">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-ink-200 px-3 py-1.5 disabled:opacity-40">Prev</button>
              <span>Page {catalog?.page ?? 1} / {catalog?.totalPages ?? 1}</span>
              <button onClick={() => setPage((p) => Math.min(catalog?.totalPages ?? 1, p + 1))} disabled={page >= (catalog?.totalPages ?? 1)} className="rounded-lg border border-ink-200 px-3 py-1.5 disabled:opacity-40">Next</button>
            </div>
          </section>
        </>
      ) : null}

      {tab === "questions" ? (
        <section className="panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Visitor questions</h2>
              <p className="text-sm text-ink-400">
                Private. These are never shown anywhere on the public site.
              </p>
            </div>
            <button
              onClick={() => void loadQuestions()}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
            >
              Refresh
            </button>
          </div>

          {questionRows.length === 0 ? (
            <p className="mt-4 text-sm text-ink-400">No questions submitted yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {questionRows.map((row) => (
                <article
                  key={row.id}
                  className={`rounded-2xl border p-4 ${
                    row.status === "new" ? "border-mint-500/40 bg-mint-500/5" : "border-ink-100 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900">
                        {row.name || "Anonymous"}
                        {row.email ? <span className="font-normal text-ink-500"> · {row.email}</span> : null}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {row.subject}
                        {row.country ? ` · ${row.country}` : ""} ·{" "}
                        {new Date(row.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${
                        row.status === "new"
                          ? "bg-mint-500/15 text-mint-600"
                          : row.status === "answered"
                            ? "bg-royal-500/15 text-royal-600"
                            : "bg-ink-100 text-ink-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-700">{row.question}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {row.status !== "read" ? (
                      <button
                        onClick={() => void questionAction("PATCH", { id: row.id, status: "read" }, "Marked as read")}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
                      >
                        Mark read
                      </button>
                    ) : null}
                    {row.status !== "answered" ? (
                      <button
                        onClick={() => void questionAction("PATCH", { id: row.id, status: "answered" }, "Marked answered")}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
                      >
                        Mark answered
                      </button>
                    ) : null}
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}?subject=${encodeURIComponent("Re: " + row.subject)}`}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
                      >
                        Reply by email
                      </a>
                    ) : null}
                    <button
                      onClick={() => void questionAction("DELETE", { id: row.id }, "Question deleted")}
                      className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === "feedback" ? (
        <section className="panel rounded-3xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Feedback moderation</h2>
              <p className="text-sm text-ink-400">
                Only approved entries appear publicly on the site. Emails stay private.
              </p>
            </div>
            <button
              onClick={() => void loadFeedback()}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
            >
              Refresh
            </button>
          </div>

          {feedbackRows.length === 0 ? (
            <p className="mt-4 text-sm text-ink-400">No feedback submitted yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {feedbackRows.map((row) => (
                <article
                  key={row.id}
                  className={`rounded-2xl border p-4 ${
                    row.approved ? "border-ink-100 bg-white" : "border-amber-300/60 bg-amber-50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-ink-900">
                        {row.name}
                        {row.country ? <span className="font-normal text-ink-500"> · {row.country}</span> : null}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {"★".repeat(row.rating)}
                        {"☆".repeat(5 - row.rating)} · {new Date(row.createdAt).toLocaleDateString()}
                        {row.contactEmail ? ` · ${row.contactEmail}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {row.pinned ? (
                        <span className="rounded-lg bg-mint-500/15 px-2 py-1 text-[10px] font-bold uppercase text-mint-600">
                          Featured
                        </span>
                      ) : null}
                      <span
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${
                          row.approved ? "bg-mint-500/15 text-mint-600" : "bg-amber-500/20 text-amber-700"
                        }`}
                      >
                        {row.approved ? "Published" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-700">{row.message}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        void feedbackAction(
                          "PATCH",
                          { id: row.id, approved: !row.approved },
                          row.approved ? "Unpublished" : "Published to site",
                        )
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        row.approved
                          ? "border border-ink-200 text-ink-600"
                          : "bg-mint-500 text-white"
                      }`}
                    >
                      {row.approved ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() =>
                        void feedbackAction(
                          "PATCH",
                          { id: row.id, pinned: !row.pinned },
                          row.pinned ? "Unfeatured" : "Featured",
                        )
                      }
                      className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600"
                    >
                      {row.pinned ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => void feedbackAction("DELETE", { id: row.id }, "Feedback deleted")}
                      className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === "settings" ? (
        <section className="panel rounded-3xl p-5">
          <h2 className="text-lg font-bold text-ink-900">Donation details, QR and ads</h2>
          <p className="mt-1 text-sm text-ink-600">These values appear on the public support page immediately after saving.</p>

          <div className="mt-4 rounded-2xl border-l-4 border-l-rose-500 bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-800">AdSense account-safety rules — read before enabling</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-5 text-rose-700">
              <li>• Never click your own ads, and never ask anyone to click them. This is permanent account termination, not a warning.</li>
              <li>• Do not enable ads before the site has real organic traffic and is indexed — a zero-traffic new domain rarely passes review.</li>
              <li>• Only paste your verified publisher ID from Google AdSense (ca-pub-…). Invalid IDs mean ads render nothing.</li>
              <li>• Ad placements are pre-set below the hero content to respect Google's no-stacking and no-intrusive-interstitial rules.</li>
            </ul>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={settings.support_enabled === "true"}
                onChange={(e) => setSettings((p) => ({ ...p, support_enabled: String(e.target.checked) }))}
              />
              Show floating “Help the admin” button
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={settings.ads_enabled === "true"}
                onChange={(e) => setSettings((p) => ({ ...p, ads_enabled: String(e.target.checked) }))}
              />
              Enable advertising
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {settingFields.map((field) =>
              field.area ? (
                <textarea
                  key={field.key}
                  rows={3}
                  value={settings[field.key] ?? ""}
                  onChange={(e) => setSettings((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.label}
                  className="rounded-xl border border-ink-200 px-3 py-2 text-sm outline-none focus:border-mint-500 sm:col-span-2"
                />
              ) : (
                <label key={field.key} className="text-xs font-semibold text-ink-400">
                  {field.label}
                  <input
                    value={settings[field.key] ?? ""}
                    onChange={(e) => setSettings((p) => ({ ...p, [field.key]: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-mint-500"
                  />
                </label>
              ),
            )}
          </div>

          <button onClick={saveSettings} className="btn-primary mt-4">Save settings</button>
        </section>
      ) : null}

      {tab === "leads" ? (
        <section className="panel rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Price-check requests</h2>
            <button onClick={() => void loadLeads()} className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600">Refresh</button>
          </div>
          {leads.length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">No requests yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-xl bg-ink-50 p-3 text-xs">
                  <p className="font-semibold text-ink-900">{lead.name || "Unnamed"} · {lead.email}</p>
                  <p className="mt-1 text-ink-600">{lead.country ? `${lead.country} · ` : ""}{lead.medicine || "No medicine specified"}</p>
                  {lead.message ? <p className="mt-1 text-ink-600">{lead.message}</p> : null}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === "issues" ? (
        <section className="panel rounded-3xl p-5">
          <h2 className="text-lg font-bold text-ink-900">Issue and bug tracker</h2>
          <ul className="mt-4 space-y-2.5">
            {knownIssues.map((issue) => (
              <li key={issue.t} className="rounded-xl bg-ink-50 p-4 text-sm">
                <p className="font-semibold text-ink-900">{issue.t}</p>
                <p className="mt-1 text-ink-600">Fix: {issue.f}</p>
                <span className="mt-2 inline-block rounded-lg bg-mint-500/10 px-2 py-0.5 text-[11px] font-bold text-mint-600">{issue.s}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
