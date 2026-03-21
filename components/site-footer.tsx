import Link from "next/link"

const SiteFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-auto bg-stone-900"
      style={{ borderTop: "4px double #b45309" }}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 font-sans text-lg font-black text-amber-50">
              LankanBook
            </h3>
            <p className="text-xs leading-relaxed text-amber-700/70 italic">
              A community-driven platform documenting establishments in Sri
              Lanka that discriminate against local residents.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-[10px] tracking-widest text-amber-500 uppercase">
              Navigate
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="font-mono text-[11px] tracking-wider text-amber-600/60 transition-colors hover:text-amber-400"
                >
                  All Records
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="font-mono text-[11px] tracking-wider text-amber-600/60 transition-colors hover:text-amber-400"
                >
                  File a Report
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-mono text-[11px] tracking-wider text-amber-600/60 transition-colors hover:text-amber-400"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-[10px] tracking-widest text-amber-500 uppercase">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/dilukshann7/lankanbook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-wider text-amber-600/60 transition-colors hover:text-amber-400"
                >
                  GitHub ↗
                </a>
              </li>

            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-mono text-[10px] tracking-widest text-amber-500 uppercase">
              Legal
            </h4>
            <p className="text-xs leading-relaxed text-stone-500 italic">
              All reports are community-submitted and reflect individual
              experiences. LankanBook does not independently verify claims.
              False reports may be removed.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-stone-700 pt-5">
          <p className="font-mono text-[10px] tracking-widest text-amber-700/50 uppercase">
            © {year} LankanBook · Community Accountability Project
          </p>
          <p className="font-mono text-[10px] tracking-wider text-stone-600">
            Built in Sri Lanka 🇱🇰
          </p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
