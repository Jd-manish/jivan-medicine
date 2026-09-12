import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobeArt, MoleculeArt, ShieldArt, WalletArt } from "@/components/medical-art";
import { isValidLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our mission — medicine access as a human right",
  description:
    "Jivan is a free, independent transparency platform helping patients in the US and Europe discover affordable same-salt medicine alternatives. We sell nothing and take no commission.",
};

const principles = [
  {
    icon: <ShieldArt className="h-10 w-10" />,
    title: "Truth over marketing",
    body: "Every price carries a status label. Referenced means we cross-checked it. Derived means we scaled it from a referenced anchor for the same molecule. Unavailable means we genuinely do not know — and we say so rather than inventing a number.",
  },
  {
    icon: <WalletArt className="h-10 w-10" />,
    title: "Free, permanently",
    body: "No subscription, no paywall, no account requirement, no commission on any purchase. If this platform ever costs a patient money to use, it has failed its purpose.",
  },
  {
    icon: <GlobeArt className="h-10 w-10" />,
    title: "Borderless information",
    body: "Illness does not respect borders and neither should price transparency. We serve 24 European locales plus English so a family in Riga has the same information as a family in Boston.",
  },
  {
    icon: <MoleculeArt className="h-10 w-10" />,
    title: "Science, not persuasion",
    body: "We cite RxNorm from the US National Library of Medicine, openFDA drug labels and Wikipedia. Every claim is traceable, and we would rather show a gap in our data than fill it with guesswork.",
  },
];

export default async function MissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <section className="hero-aurora relative overflow-hidden">
        <div className="grid-lines absolute inset-0" />
        <MoleculeArt className="anim-drift absolute -right-8 top-10 w-52 opacity-20" />

        <div className="shell relative py-16 sm:py-24">
          <span className="chip">Our mission</span>
          <h1 className="anim-rise mt-5 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
            Medicine access is a <span className="text-gradient">human problem</span>, not a market problem
          </h1>
          <p className="anim-rise delay-2 mt-5 max-w-2xl text-base leading-7 text-ink-200 sm:text-lg">
            Jivan is a free, independent transparency project built for one reason: nobody should stop treatment because
            they were never told an affordable equivalent of the same molecule exists.
          </p>
        </div>
      </section>

      <div className="shell py-14 sm:py-20">
        <section className="panel rounded-3xl p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">The problem we exist to solve</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-ink-600">
            <p>
              A hepatitis C cure can be priced at tens of thousands of dollars in one country and a few hundred in another —
              for the identical active pharmaceutical ingredient, often produced in the very same class of facility. A cancer
              therapy that costs a family their savings every month may be available at a fraction of that cost elsewhere.
              An adrenaline auto-injector that costs hundreds can be a few dollars as a plain ampoule.
            </p>
            <p>
              These are not secrets. They are simply invisible to the person who needs them most, at the exact moment they are
              least able to research anything: while they are ill, frightened and financially stretched.
            </p>
            <p>
              The consequence is measurable and cruel. People split tablets. They skip doses. They stop chemotherapy support
              medication. They choose between insulin and rent. Clinicians call this financial toxicity, and it damages
              outcomes as surely as any untreated disease.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">What we promise</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {principles.map((item) => (
              <article key={item.title} className="panel panel-hover rounded-3xl p-6">
                {item.icon}
                <h3 className="mt-4 text-lg font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel mt-10 rounded-3xl border-l-4 border-l-amber-500 p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-ink-900">What we are not</h2>
          <ul className="mt-5 space-y-3 text-[15px] leading-7 text-ink-600">
            <li className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              We are not a pharmacy. We do not stock, sell, ship or dispense any medicine.
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              We are not a medical service. Nothing on this site is a diagnosis, prescription or treatment recommendation.
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              We are not encouraging anyone to bypass their physician, their pharmacist or their national import regulations.
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              We are not claiming every generic is interchangeable. Biologics, narrow-therapeutic-index drugs and modified
              release formulations require specialist judgement.
            </li>
          </ul>
        </section>

        <section className="hero-aurora relative mt-10 overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12">
          <div className="grid-lines absolute inset-0" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-black text-white sm:text-3xl">Help us reach the people who need this</h2>
            <p className="mt-4 text-base leading-7 text-ink-200">
              If this information helped you or someone you care for, share it. Every person who learns that an affordable
              equivalent exists is one less person rationing their treatment.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}#catalog`} className="btn-primary">
                Search the catalog
              </Link>
              <Link href={`/${locale}/contact`} className="btn-ghost">
                Contact the team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
