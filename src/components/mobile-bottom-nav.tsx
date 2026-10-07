import Link from "next/link";

const icons = {
  home: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-7.5Z",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4.2-4.2",
  book: "M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm12 0h2v16",
  chat: "M4 5h16v11H9l-5 4V5Z",
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function MobileBottomNav({ locale }: { locale: string }) {
  const links = [
    { href: `/${locale}`, label: "Home", d: icons.home },
    { href: `/${locale}#catalog`, label: "Search", d: icons.search },
    { href: `/${locale}/articles`, label: "Guides", d: icons.book },
    { href: `/${locale}/contact/`, label: "Quote", d: icons.chat },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-2 text-center">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="rounded-xl px-1 py-1.5 text-[11px] font-semibold text-ink-600 transition active:scale-95 active:bg-ink-50"
          >
            <Icon d={link.d} />
            <span className="mt-0.5 block">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
