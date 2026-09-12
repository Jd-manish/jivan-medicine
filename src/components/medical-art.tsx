import type { CSSProperties } from "react";

type ArtProps = {
  className?: string;
  style?: CSSProperties;
};

export function CapsuleArt({ className = "", style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="capA" x1="0" x2="1">
          <stop offset="0%" stopColor="#6ee7c7" />
          <stop offset="100%" stopColor="#12b98c" />
        </linearGradient>
        <linearGradient id="capB" x1="0" x2="1">
          <stop offset="0%" stopColor="#eef4ff" />
          <stop offset="100%" stopColor="#c3d7ff" />
        </linearGradient>
      </defs>
      <g transform="rotate(-18 60 30)">
        <path d="M32 8h28v44H32a22 22 0 0 1 0-44Z" fill="url(#capA)" />
        <path d="M60 8h28a22 22 0 0 1 0 44H60V8Z" fill="url(#capB)" />
        <ellipse cx="46" cy="20" rx="7" ry="4" fill="#ffffff" opacity="0.45" />
      </g>
    </svg>
  );
}

export function TabletArt({ className = "", style }: ArtProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={style} aria-hidden="true">
      <defs>
        <radialGradient id="tabG" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#dbe7ff" />
          <stop offset="100%" stopColor="#9db9ef" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="32" fill="url(#tabG)" />
      <path d="M18 40h44" stroke="#6b86bd" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="30" cy="27" rx="9" ry="5" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

export function SyringeArt({ className = "", style }: ArtProps) {
  return (
    <svg viewBox="0 0 140 70" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="syrBody" x1="0" x2="1">
          <stop offset="0%" stopColor="#f4f8ff" />
          <stop offset="100%" stopColor="#cfe0fb" />
        </linearGradient>
        <linearGradient id="syrFluid" x1="0" x2="1">
          <stop offset="0%" stopColor="#34d3aa" />
          <stop offset="100%" stopColor="#12b98c" />
        </linearGradient>
      </defs>
      <g transform="rotate(-24 70 35)">
        <rect x="26" y="24" width="66" height="22" rx="7" fill="url(#syrBody)" stroke="#a9c1e8" strokeWidth="1.5" />
        <rect x="30" y="28" width="38" height="14" rx="5" fill="url(#syrFluid)" />
        <rect x="12" y="28" width="16" height="14" rx="4" fill="#b9cdee" />
        <rect x="4" y="24" width="10" height="22" rx="3" fill="#8fa8d4" />
        <rect x="92" y="31" width="14" height="8" rx="3" fill="#9db9ef" />
        <path d="M106 35h26" stroke="#8fa8d4" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function VialArt({ className = "", style }: ArtProps) {
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} aria-hidden="true">
      <defs>
        <linearGradient id="vialG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#eaf3ff" />
          <stop offset="100%" stopColor="#bcd4f7" />
        </linearGradient>
      </defs>
      <rect x="16" y="6" width="28" height="10" rx="3" fill="#7f96c4" />
      <rect x="12" y="16" width="36" height="76" rx="12" fill="url(#vialG)" stroke="#a9c1e8" strokeWidth="1.5" />
      <rect x="16" y="46" width="28" height="42" rx="9" fill="#34d3aa" opacity="0.85" />
      <circle cx="24" cy="60" r="4" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

export function MoleculeArt({ className = "", style }: ArtProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <g stroke="#6ee7c7" strokeWidth="2" opacity="0.85">
        <path d="M60 26 24 50m36-24 36 24M24 50v40m72-40v40M24 90l36 22m36-22-36 22" />
      </g>
      <g fill="#12b98c">
        <circle cx="60" cy="26" r="8" />
        <circle cx="24" cy="50" r="7" />
        <circle cx="96" cy="50" r="7" />
        <circle cx="24" cy="90" r="7" />
        <circle cx="96" cy="90" r="7" />
        <circle cx="60" cy="112" r="8" />
      </g>
      <circle cx="60" cy="26" r="14" fill="none" stroke="#6ee7c7" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function EcgLine({ className = "" }: ArtProps) {
  return (
    <svg viewBox="0 0 520 80" className={`anim-ecg ${className}`} preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 46h58l12-26 16 46 14-32 18 12h52l14-24 16 44 15-30 17 10h60l13-22 17 40 14-28 16 10h158"
        fill="none"
        stroke="#6ee7c7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldArt({ className = "" }: ArtProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 4 8 11v13c0 10 6.8 17.6 16 20 9.2-2.4 16-10 16-20V11L24 4Z" fill="#0d9370" opacity="0.14" />
      <path d="M24 4 8 11v13c0 10 6.8 17.6 16 20 9.2-2.4 16-10 16-20V11L24 4Z" fill="none" stroke="#12b98c" strokeWidth="2" />
      <path d="m16 24 6 6 11-12" fill="none" stroke="#12b98c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GlobeArt({ className = "" }: ArtProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="19" fill="#3d7dfb" opacity="0.12" />
      <circle cx="24" cy="24" r="19" fill="none" stroke="#3d7dfb" strokeWidth="2" />
      <path d="M5 24h38M24 5c6 6 6 32 0 38M24 5c-6 6-6 32 0 38" fill="none" stroke="#3d7dfb" strokeWidth="1.8" />
    </svg>
  );
}

export function WalletArt({ className = "" }: ArtProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="12" width="36" height="26" rx="6" fill="#12b98c" opacity="0.12" />
      <rect x="6" y="12" width="36" height="26" rx="6" fill="none" stroke="#12b98c" strokeWidth="2" />
      <path d="M6 20h36" stroke="#12b98c" strokeWidth="2" />
      <circle cx="34" cy="29" r="3.5" fill="#12b98c" />
    </svg>
  );
}

export function HeroArtCluster() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="absolute left-[6%] top-[16%] h-24 w-24 rounded-full bg-mint-400/20 blur-2xl" />
      <span className="absolute right-[10%] top-[26%] h-32 w-32 rounded-full bg-royal-500/20 blur-3xl" />

      <CapsuleArt className="anim-drift absolute right-[6%] top-[12%] w-28 opacity-90 sm:w-36" style={{ ["--tilt" as string]: "-8deg" }} />
      <SyringeArt className="anim-float delay-3 absolute right-[22%] bottom-[14%] w-32 opacity-80 sm:w-44" />
      <TabletArt className="anim-float delay-5 absolute left-[8%] bottom-[18%] w-16 opacity-80 sm:w-20" />
      <VialArt className="anim-drift delay-2 absolute left-[20%] top-[10%] hidden w-12 opacity-70 lg:block" />
      <MoleculeArt className="anim-float delay-6 absolute right-[42%] top-[6%] hidden w-24 opacity-40 lg:block" />

      <span className="anim-ring absolute right-[8%] top-[16%] hidden h-24 w-24 rounded-full border border-mint-300/40 lg:block" />
      <span className="anim-ring delay-6 absolute left-[12%] bottom-[22%] hidden h-20 w-20 rounded-full border border-royal-400/40 lg:block" />
    </div>
  );
}
