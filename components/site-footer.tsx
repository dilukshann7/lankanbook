import Link from "next/link"

const SiteFooter = () => {
  return (
    <footer
      className="bg-stone-900 py-5 text-center"
      style={{ borderTop: "4px double #b45309" }}
    >
      <p className="font-mono text-[11px] tracking-widest text-amber-700/70 uppercase">
        LankanBook · A Community Project to Document Discrimination ·{" "}
        {new Date().getFullYear()}
      </p>
      <div className="mt-2 flex justify-center gap-4">
        <a
          href="https://github.com/dilukshann7/lankanbook"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] tracking-widest text-amber-600/50 uppercase transition-colors hover:text-amber-400"
        >
          GitHub
        </a>
        <Link
          href="/about"
          className="font-mono text-[10px] tracking-widest text-amber-600/50 uppercase transition-colors hover:text-amber-400"
        >
          About
        </Link>
      </div>
    </footer>
  )
}

export default SiteFooter
