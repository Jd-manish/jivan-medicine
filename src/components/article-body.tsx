import type { ArticleSection, Callout } from "@/lib/article-types";

const calloutStyle: Record<Callout["kind"], { wrap: string; label: string; icon: string }> = {
  tip: { wrap: "border-mint-500/40 bg-mint-500/8", label: "text-mint-600", icon: "💡" },
  warning: { wrap: "border-amber-400/50 bg-amber-50", label: "text-amber-700", icon: "⚠" },
  case: { wrap: "border-royal-500/40 bg-royal-500/8", label: "text-royal-600", icon: "◆" },
  fact: { wrap: "border-ink-200 bg-ink-50", label: "text-ink-600", icon: "✓" },
};

function CalloutBox({ callout }: { callout: Callout }) {
  const style = calloutStyle[callout.kind];
  return (
    <aside className={`mt-5 rounded-2xl border-l-4 p-5 ${style.wrap}`}>
      <p className={`flex items-center gap-2 text-sm font-bold ${style.label}`}>
        <span aria-hidden>{style.icon}</span>
        {callout.title}
      </p>
      <p className="mt-2 text-sm leading-7 text-ink-700">{callout.body}</p>
    </aside>
  );
}

export function ArticleBody({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className="scroll-mt-32">
          <h2 className="flex items-start gap-3 text-xl font-bold leading-snug text-ink-900 sm:text-2xl">
            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mint-500/10 text-xs font-black text-mint-600">
              {index + 1}
            </span>
            {section.heading}
          </h2>

          <div className="mt-4 space-y-4 sm:pl-10">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)} className="text-[15px] leading-8 text-ink-700">
                {paragraph}
              </p>
            ))}

            {section.bullets ? (
              <ul className="space-y-2.5">
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 60)} className="flex gap-3 text-[15px] leading-7 text-ink-700">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {section.numbered ? (
              <ol className="space-y-3">
                {section.numbered.map((item, i) => (
                  <li key={item.slice(0, 60)} className="flex gap-3 text-[15px] leading-7 text-ink-700">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-900 text-[11px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : null}

            {section.table ? (
              <figure className="mt-5 overflow-hidden rounded-2xl border border-ink-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <caption className="sr-only">{section.table.caption}</caption>
                    <thead className="bg-ink-50">
                      <tr>
                        {section.table.head.map((cell) => (
                          <th key={cell} scope="col" className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-500">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")} className="even:bg-ink-50/40">
                          {row.map((cell, ci) => (
                            <td
                              key={`${cell}-${ci}`}
                              className={`px-4 py-3 align-top ${ci === 0 ? "font-semibold text-ink-900" : "text-ink-700"}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className="border-t border-ink-100 bg-white px-4 py-2.5 text-xs text-ink-500">
                  {section.table.caption}
                </figcaption>
              </figure>
            ) : null}

            {section.callout ? <CalloutBox callout={section.callout} /> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
