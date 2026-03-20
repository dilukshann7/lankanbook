import Link from "next/link"
import SiteFooter from "@/components/site-footer"

export const metadata = {
  title: "About · LankanBook",
  description:
    "Learn about LankanBook - A community-driven platform documenting establishments in Sri Lanka that discriminate against local residents.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <header
        className="bg-stone-900"
        style={{ borderBottom: "4px double #b45309" }}
      >
        <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6">
          <div className="border-b border-stone-700 pb-5 text-center">
            <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-amber-600/70 uppercase">
              About
            </p>
            <h1 className="font-sans text-5xl leading-none font-black tracking-tight text-amber-50 sm:text-6xl">
              LankanBook
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            Our Mission
          </h2>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg leading-relaxed text-stone-600 italic">
              Inspired by the historic Negro Motorist Green Book, LankanBook
              empowers communities to share and verify experiences of
              discrimination—whether dual pricing, denial of entry, or selective
              enforcement of policies against Sri Lankan residents.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Browse",
                desc: "Search establishments by name, location, or province.",
              },
              {
                step: "02",
                title: "Report",
                desc: "Submit firsthand accounts of discrimination with evidence.",
              },
              {
                step: "03",
                title: "Verify",
                desc: "Upvote credible reports to help surface authentic complaints.",
              },
              {
                step: "04",
                title: "Stay Informed",
                desc: "Make informed decisions about where to spend your money.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 border border-amber-200 bg-white p-4"
              >
                <span className="font-mono text-2xl font-black text-amber-300">
                  {item.step}
                </span>
                <div>
                  <h3 className="mb-1 font-sans text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            What We Document
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Dual pricing for locals vs tourists",
              "Denial of entry without valid reason",
              "Selective enforcement of dress codes",
              "Unfair treatment by staff",
              "Restrictive policies targeting locals",
              "Other forms of discrimination",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 border border-amber-200 bg-white px-4 py-2"
              >
                <span className="text-red-700">×</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            Tech Stack
          </h2>
          <div className="border border-amber-200 bg-white">
            {[
              ["Framework", "Next.js 16 (App Router)"],
              ["Language", "TypeScript"],
              ["Database", "PostgreSQL (Neon)"],
              ["ORM", "Drizzle ORM"],
              ["Styling", "Tailwind CSS"],
              ["Media", "Vercel Blob"],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className={`flex justify-between px-4 py-2 ${i !== arr.length - 1 ? "border-b border-amber-100" : ""}`}
              >
                <span className="font-mono text-xs text-amber-700">
                  {label}
                </span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            API Endpoints
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {[
              ["GET", "/api/establishments", "List all establishments"],
              ["POST", "/api/establishments", "Create new report"],
              ["GET", "/api/establishments/[id]", "Get establishment"],
              ["POST", "/api/establishments/[id]/upvote", "Upvote"],
              ["GET", "/api/reports", "Get reports"],
              ["POST", "/api/reports", "Submit testimony"],
              ["POST", "/api/upload", "Upload media"],
            ].map(([method, path, desc]) => (
              <div
                key={`${method}-${path}`}
                className="flex items-center gap-3 border border-amber-200 bg-white px-3 py-2"
              >
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold ${
                    method === "GET"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {method}
                </span>
                <span className="flex-1 text-stone-600">{path}</span>
                <span className="text-stone-400">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-xs tracking-widest text-red-700 uppercase">
            Contribute
          </h2>
          <p className="mb-4 text-sm text-stone-500">
            Help us build a more accountable business environment in Sri Lanka.
          </p>
          <Link
            href="https://github.com/dilukshann7/lankanbook"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-stone-900 px-6 py-2.5 font-mono text-xs tracking-widest text-amber-50 uppercase transition-colors hover:bg-stone-700"
          >
            View on GitHub
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
