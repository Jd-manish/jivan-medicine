type BrandLogoProps = {
  name?: string;
  tagline?: string;
  compact?: boolean;
  inverse?: boolean;
  className?: string;
  idPrefix?: string;
};

/**
 * Lightweight, CSS-interactive SVG logo.
 * The capsule lifts, the ECG draws and the pulse expands on hover/focus of
 * the parent link. No JavaScript or image request is required.
 */
export function BrandLogo({
  name = "Jivan",
  tagline,
  compact = false,
  inverse = false,
  className = "",
  idPrefix = "jivan-logo",
}: BrandLogoProps) {
  return (
    <span className={`brand-logo inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className="brand-logo-mark h-10 w-10 shrink-0 overflow-visible"
        role="img"
        aria-label={`${name} logo`}
      >
        <defs>
          <linearGradient id={`${idPrefix}-bg`} x1="5" y1="4" x2="43" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#17233E" />
            <stop offset="1" stopColor="#08131B" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-pill`} x1="13" y1="11" x2="34" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8FF0D3" />
            <stop offset="1" stopColor="#12B98C" />
          </linearGradient>
          <clipPath id={`${idPrefix}-clip`}>
            <rect x="2" y="2" width="44" height="44" rx="14" />
          </clipPath>
        </defs>

        <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${idPrefix}-bg)`} />
        <rect x="2.75" y="2.75" width="42.5" height="42.5" rx="13.25" fill="none" stroke="#ffffff" strokeOpacity=".13" strokeWidth="1.5" />

        <g clipPath={`url(#${idPrefix}-clip)`}>
          <circle className="brand-logo-pulse" cx="33" cy="13" r="4" fill="none" stroke="#6EE7C7" strokeWidth="1.2" />
          <path className="brand-logo-shine" d="M-8 43 34-5h13L5 52H-8Z" fill="#fff" opacity=".08" />
        </g>

        <g className="brand-logo-capsule" transform="rotate(-38 27 20)">
          <path d="M13.5 20a7 7 0 0 1 7-7H27v14h-6.5a7 7 0 0 1-7-7Z" fill={`url(#${idPrefix}-pill)`} />
          <path d="M27 13h6.5a7 7 0 1 1 0 14H27V13Z" fill="#EAF4FF" />
          <path d="M27 13v14" stroke="#A7C7E8" strokeWidth="1" />
          <ellipse cx="20" cy="17" rx="2.8" ry="1.3" fill="#fff" opacity=".42" />
        </g>

        <path
          className="brand-logo-j"
          d="M30.5 22.5v8.2c0 4.3-2.5 6.8-6.7 6.8-3.1 0-5.3-1.4-6.4-3.9"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <path
          className="brand-logo-ecg"
          d="M7 31h6l2-4 3.2 8 3-6 2.4 2H29"
          fill="none"
          stroke="#6EE7C7"
          strokeWidth="1.45"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!compact ? (
        <span className="min-w-0 leading-none">
          <span className={`block text-lg font-black tracking-[-0.035em] ${inverse ? "text-white" : "text-ink-900"}`}>
            {name}
          </span>
          {tagline ? (
            <span className={`mt-1 block truncate text-[9px] font-semibold uppercase tracking-[0.14em] ${inverse ? "text-ink-300" : "text-ink-400"}`}>
              {tagline}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
