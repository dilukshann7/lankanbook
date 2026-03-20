"use client"

import { useState } from "react"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import { useRouter } from "next/navigation"
import { MediaUploader } from "@/components/media/upload"
import type { Media } from "@/lib/types"
import { useSubmissionTracker } from "@/hooks/use-tracker"

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

export default function SubmitPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mediaUrls, setMediaUrls] = useState<Media[]>([])
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    province: "",
    description: "",
  })
  const { canSubmit, remaining, recordSubmission } = useSubmissionTracker(5)

  const set =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setFormData((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/establishments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mediaUrls: mediaUrls.map((m) => m.url),
        }),
      })
      if (res.ok) {
        const d = await res.json()
        recordSubmission(d.id)
        router.push(`/establishment/${d.id}`)
      }
    } catch {
      console.error("Failed to submit")
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = `font-sans w-full border border-amber-200 bg-white px-3 py-2.5 text-sm text-stone-800
    placeholder:text-stone-400 placeholder:italic focus:outline-none focus:border-amber-500
    transition-colors`

  const labelClass = `font-mono block text-[10px] tracking-widest text-amber-700 uppercase mb-1.5`

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <header
        className="bg-stone-900"
        style={{ borderBottom: "4px double #b45309" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center gap-2 border-b border-stone-700 py-3 font-mono text-[10px] tracking-widest text-amber-600/70 uppercase">
            <Link href="/" className="transition-colors hover:text-amber-400">
              LankanBook
            </Link>
            <span className="text-stone-600">›</span>
            <span className="text-amber-300">File a Report</span>
          </div>
          <div className="py-6">
            <p className="mb-2 font-mono text-[10px] tracking-[0.3em] text-amber-600/60 uppercase">
              Community Record
            </p>
            <h1 className="font-sans text-4xl leading-tight font-black text-amber-50 sm:text-5xl">
              Report an Establishment
            </h1>
            <p className="mt-2 text-xs text-amber-700/70 italic">
              Help the community make informed decisions about where to spend
              their money.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Establishment Name *
              </label>
              <input
                id="name"
                required
                className={inputClass}
                placeholder="e.g., Casa Mia"
                value={formData.name}
                onChange={set("name")}
              />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Location *
              </label>
              <input
                id="location"
                required
                className={inputClass}
                placeholder="e.g., Hikkaduwa"
                value={formData.location}
                onChange={set("location")}
              />
            </div>

            <div>
              <label htmlFor="province" className={labelClass}>
                Province *
              </label>
              <select
                id="province"
                required
                className={`${inputClass} cursor-pointer appearance-none`}
                value={formData.province}
                onChange={set("province")}
              >
                <option value="" disabled>
                  Select a province…
                </option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Describe the Discrimination *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                className={`${inputClass} resize-none italic`}
                placeholder="Describe what happened, how you were treated differently…"
                value={formData.description}
                onChange={set("description")}
              />
            </div>

            <div>
              <label className={labelClass}>
                Photos & Videos{" "}
                <span className="tracking-normal text-stone-400 normal-case">
                  (optional)
                </span>
              </label>
              <div className="border border-amber-200 bg-white p-3">
                <MediaUploader
                  mediaUrls={mediaUrls}
                  onMediaChange={setMediaUrls}
                  maxFiles={10}
                />
              </div>
            </div>

            <div className="flex gap-3 border-l-2 border-amber-500 bg-amber-100 px-4 py-3">
              <span className="mt-0.5 flex-shrink-0 text-base text-amber-600">
                ⚠
              </span>
              <p className="text-xs leading-relaxed text-stone-600 italic">
                Reports are public and affect business reputations. Only submit
                accurate information about real experiences. False reports may
                be removed.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                href="/"
                className="border border-amber-300 px-5 py-2.5 font-mono text-xs tracking-widest text-stone-600 uppercase transition-colors hover:border-stone-400 hover:text-stone-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="flex-1 bg-red-700 py-2.5 font-mono text-xs tracking-widest text-white uppercase transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {isLoading
                  ? "Submitting…"
                  : canSubmit
                    ? `▲ Submit Report (${remaining} left)`
                    : "Limit Reached"}
              </button>
            </div>
          </form>

          <div className="space-y-5">
            <div className="border border-amber-200 p-4">
              <h3 className="mb-3 border-b border-amber-200 pb-2 font-sans text-sm font-bold">
                What to Report
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Dual pricing for locals vs. foreigners",
                  "Denial of entry or service",
                  "Discriminatory seating or treatment",
                  "English-only menus to discourage locals",
                  "Dress code enforced selectively",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs leading-relaxed text-stone-600"
                  >
                    <span className="mt-0.5 flex-shrink-0 font-mono text-amber-500">
                      ›
                    </span>
                    <span className="italic">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-900 p-4">
              <h3 className="mb-3 border-b border-stone-700 pb-2 font-sans text-sm font-bold text-amber-200">
                Tips for a Strong Report
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Be specific about dates and prices",
                  "Include photos of menus or signage",
                  "Note any staff names if possible",
                  "Describe the exact interaction",
                ].map((tip, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs leading-relaxed text-stone-400"
                  >
                    <span className="mt-0.5 flex-shrink-0 font-mono text-amber-600">
                      {i + 1}.
                    </span>
                    <span className="italic">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-stone-400 uppercase transition-colors hover:text-stone-900"
            >
              ← Back to all records
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
