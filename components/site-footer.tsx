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
      <a
        href="https://github.com/dilukshann7/lankanbook"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono mt-2 inline-block text-[10px] tracking-widest text-amber-600/50 uppercase transition-colors hover:text-amber-400"
      >
        View on GitHub
      </a>
    </footer>
  )
}

export default SiteFooter
