"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import type { Establishment } from "@/lib/types"

const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
]

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "most-reported", label: "Most Reported" },
  { value: "alphabetical", label: "Alphabetical" },
]

interface DropdownProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="font-mono-dm flex items-center gap-2 border border-amber-200 bg-amber-50 px-3 py-2 text-xs tracking-widest whitespace-nowrap text-stone-600 uppercase transition-colors hover:border-amber-400 hover:bg-amber-100"
      >
        {selected ? selected.label : label}
        <span
          className={`text-[10px] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-px min-w-max border border-amber-200 bg-white shadow-[4px_4px_0_#d6cbb8]">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`font-mono-dm block w-full border-b border-amber-100 px-4 py-2.5 text-left text-xs tracking-wider transition-colors last:border-b-0 ${
                value === opt.value
                  ? "bg-stone-900 text-amber-200"
                  : "text-stone-600 hover:bg-amber-50 hover:text-stone-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="animate-pulse border-b border-amber-200 py-6">
      <div className="mb-3 h-3 w-24 rounded bg-amber-200" />
      <div className="mb-2 h-6 w-1/2 rounded bg-stone-200" />
      <div className="mb-3 h-3 w-32 rounded bg-amber-100" />
      <div className="h-3 w-3/4 rounded bg-stone-100" />
    </div>
  )
}

export default function HomePage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [search, setSearch] = useState("")
  const [province, setProvince] = useState("")
  const [sort, setSort] = useState("newest")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/establishments")
      .then((r) => r.json())
      .then((data) => {
        setEstablishments(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const provinceOptions = [
    { value: "", label: "All Provinces" },
    ...PROVINCES.map((p) => ({ value: p, label: p })),
  ]

  const filtered = establishments
    .filter(
      (e) =>
        (e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())) &&
        (!province || e.province === province)
    )
    .sort((a, b) =>
      sort === "most-reported"
        ? b.upvotes - a.upvotes
        : sort === "alphabetical"
          ? a.name.localeCompare(b.name)
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const totalReports = establishments.reduce((s, e) => s + e.upvotes, 0)
  const provinceCount = new Set(establishments.map((e) => e.province)).size

  const today = new Date().toLocaleDateString("en-LK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="font-playfair min-h-screen bg-amber-50 text-stone-900">
      <header
        className="bg-stone-900"
        style={{ borderBottom: "4px double #b45309" }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="font-mono-dm flex flex-wrap items-center justify-between gap-1 border-b border-stone-700 py-2.5 text-[10px] tracking-widest text-amber-600/80 uppercase">
            <span>Est. 2024 · Community Accountability Project</span>
            <span className="hidden sm:block">{today}</span>
          </div>

          <div className="border-b border-stone-700/40 py-7 text-center">
            <p className="font-mono-dm mb-2 text-[10px] tracking-[0.4em] text-amber-600/70 uppercase">
              The People&apos;s Record of
            </p>
            <h1 className="font-playfair text-6xl leading-none font-black tracking-tight text-amber-50 sm:text-8xl">
              LankanBook
            </h1>
            <p className="mt-3 text-xs text-amber-700/80 italic">
              Documenting establishments that discriminate against local
              residents of Sri Lanka
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            <div className="font-mono-dm flex flex-wrap gap-5 text-[11px] tracking-wider text-amber-600/70">
              <span>
                <span className="font-medium text-amber-300">
                  {establishments.length}
                </span>{" "}
                establishments
              </span>
              <span>
                <span className="font-medium text-amber-300">
                  {totalReports}
                </span>{" "}
                community reports
              </span>
              <span>
                <span className="font-medium text-amber-300">
                  {provinceCount}
                </span>{" "}
                provinces
              </span>
            </div>
            <Link
              href="/submit"
              className="font-mono-dm bg-red-700 px-5 py-2 text-[11px] tracking-widest text-white uppercase transition-colors hover:bg-red-600"
            >
              + File a Report
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-amber-300 bg-amber-100">
        <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-4 sm:px-6">
          <span className="mt-0.5 flex-shrink-0 text-xl">⚖️</span>
          <div>
            <h2 className="font-playfair mb-1 text-sm font-bold">
              A Modern Green Book for Sri Lanka
            </h2>
            <p className="text-xs leading-relaxed text-stone-600 italic">
              Like the Negro Motorist Green Book, this project documents
              establishments with dual standards — charging locals more, denying
              entry, or otherwise discriminating against Sri Lankan residents.
              Upvote reports to help verify authenticity.
            </p>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-stone-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <div className="relative min-w-44 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-amber-600 select-none">
              ⌕
            </span>
            <input
              className="font-playfair w-full border border-amber-200 bg-white py-2 pr-3 pl-8 text-sm text-stone-700 italic transition-colors placeholder:text-amber-400/80 focus:border-amber-500 focus:outline-none"
              placeholder="Search by name or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dropdown
            label="All Provinces"
            options={provinceOptions}
            value={province}
            onChange={setProvince}
          />
          <Dropdown
            label="Sort"
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl items-center justify-between border-b border-amber-200 px-4 py-2.5 sm:px-6">
        <span className="font-mono-dm text-[11px] tracking-widest text-amber-700 uppercase">
          {loading
            ? "Loading…"
            : `${filtered.length} establishment${filtered.length !== 1 ? "s" : ""} on record`}
        </span>
        {(search || province) && !loading && (
          <button
            onClick={() => {
              setSearch("")
              setProvince("")
            }}
            className="font-mono-dm text-[10px] tracking-wider text-red-700 uppercase transition-colors hover:text-red-500"
          >
            Clear ×
          </button>
        )}
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        {loading && [1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-playfair mb-4 text-7xl leading-none font-black text-amber-200">
              ¶
            </p>
            <h3 className="font-playfair mb-2 text-xl italic">
              No establishments found
            </h3>
            <p className="mb-6 text-sm text-stone-400">
              {search || province
                ? "Try adjusting your filters."
                : "Be the first to file a report."}
            </p>
            <Link
              href="/submit"
              className="font-mono-dm bg-stone-900 px-6 py-2.5 text-xs tracking-widest text-amber-50 uppercase transition-colors hover:bg-stone-700"
            >
              File a Report
            </Link>
          </div>
        )}

        {!loading &&
          filtered.map((est, i) => (
            <Link
              key={est.id}
              href={`/establishment/${est.id}`}
              className="group -mx-4 flex items-start gap-4 border-b border-amber-200 px-4 py-5 transition-colors hover:bg-amber-100/70 sm:-mx-6 sm:px-6"
            >
              <span className="font-mono-dm hidden w-6 flex-shrink-0 pt-1.5 text-[11px] text-amber-300 select-none sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-mono-dm mb-1 text-[10px] tracking-widest text-red-700 uppercase">
                  {est.province}
                </p>
                <h3 className="font-playfair mb-1 text-xl leading-tight font-bold transition-colors group-hover:text-red-800 sm:text-2xl">
                  {est.name}
                </h3>
                <p className="font-mono-dm mb-2 text-[11px] tracking-wider text-amber-700">
                  📍 {est.location}
                </p>
                {est.description && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-stone-500 italic">
                    &ldquo;{est.description}&rdquo;
                  </p>
                )}
                <p className="font-mono-dm mt-2.5 text-[10px] tracking-wider text-stone-400">
                  Added{" "}
                  {new Date(est.createdAt).toLocaleDateString("en-LK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div
                className={`flex min-w-[60px] flex-shrink-0 flex-col items-center justify-center px-3 py-2 ${est.upvotes >= 100 ? "bg-red-700 text-white" : "bg-stone-900 text-amber-50"}`}
              >
                <span className="font-playfair text-2xl leading-none font-black">
                  {est.upvotes}
                </span>
                <span className="font-mono-dm mt-0.5 text-[9px] tracking-widest uppercase opacity-60">
                  reports
                </span>
              </div>

              <span className="font-mono-dm hidden pt-1 text-sm text-stone-300 transition-colors group-hover:text-red-600 sm:block">
                →
              </span>
            </Link>
          ))}
      </main>

      <SiteFooter />
    </div>
  )
}
