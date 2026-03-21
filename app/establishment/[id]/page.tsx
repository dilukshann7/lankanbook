"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import { MediaUploader, MediaGallery } from "@/components/media/upload"
import type { Establishment, Report, Media } from "@/lib/types"
import { useUpvoteTracker } from "@/hooks/use-tracker"

export default function EstablishmentPage() {
  const params = useParams()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [testimony, setTestimony] = useState("")
  const [mediaUrls, setMediaUrls] = useState<Media[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { hasUpvoted, recordUpvote } = useUpvoteTracker()
  const [upvoteCount, setUpvoteCount] = useState(0)
  const establishmentId = Number(params.id)
  const userHasUpvoted = hasUpvoted(establishmentId)

  const fetchData = useCallback(async () => {
    try {
      const [estRes, reportsRes] = await Promise.all([
        fetch(`/api/establishments/${params.id}`),
        fetch(`/api/reports?establishmentId=${params.id}`),
      ])
      if (estRes.ok) {
        const d = await estRes.json()
        setEstablishment(d)
        setUpvoteCount(d.upvotes)
      }
      if (reportsRes.ok) {
        const data = await reportsRes.json()
        setReports(data)
      }
    } catch {
      console.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testimony.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          establishmentId: Number(params.id),
          testimony,
          mediaUrls: mediaUrls.map((m) => m.url),
        }),
      })
      if (res.ok) {
        setTestimony("")
        setMediaUrls([])
        fetchData()
      }
    } catch {
      console.error("Failed to submit")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpvote = async () => {
    if (userHasUpvoted) return
    recordUpvote(establishmentId)
    setUpvoteCount((c) => c + 1)
    try {
      await fetch(`/api/establishments/${params.id}/upvote`, { method: "POST" })
    } catch {
      setUpvoteCount((c) => c - 1)
    }
  }

  const parseMedia = (s: string | null | undefined): string[] => {
    try {
      return JSON.parse(s || "[]")
    } catch {
      return []
    }
  }

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50 font-sans">
        <div className="text-center">
          <p className="animate-pulse font-sans text-5xl font-black text-amber-200">
            …
          </p>
          <p className="mt-2 font-mono text-xs tracking-widest text-amber-600 uppercase">
            Loading record
          </p>
        </div>
      </div>
    )

  if (!establishment)
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50 font-sans">
        <div className="text-center">
          <p className="mb-4 font-sans text-6xl font-black text-amber-200">¶</p>
          <h3 className="mb-4 font-sans text-xl italic">
            Establishment not found
          </h3>
          <Link
            href="/"
            className="bg-stone-900 px-5 py-2 font-mono text-xs tracking-widest text-amber-50 uppercase transition-colors hover:bg-stone-700"
          >
            ← Back to Records
          </Link>
        </div>
      </div>
    )

  const estMedia = parseMedia(establishment.mediaUrls)

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-stone-900">
      <header
        className="bg-stone-900"
        style={{ borderBottom: "4px double #b45309" }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-2 border-b border-stone-700 py-3 font-mono text-[10px] tracking-widest text-amber-600/70 uppercase">
            <Link href="/" className="transition-colors hover:text-amber-400">
              LankanBook
            </Link>
            <span className="text-stone-600">›</span>
            <span className="text-amber-500/60">{establishment.province}</span>
            <span className="text-stone-600">›</span>
            <span className="max-w-48 truncate text-amber-300">
              {establishment.name}
            </span>
          </div>

          <div className="py-6">
            <p className="mb-2 font-mono text-[10px] tracking-widest text-red-500 uppercase">
              {establishment.province} · {establishment.location}
            </p>
            <h1 className="mb-4 font-sans text-3xl leading-tight font-black text-amber-50 sm:text-5xl">
              {establishment.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleUpvote}
                disabled={userHasUpvoted}
                className={`flex items-center gap-2 border px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors ${userHasUpvoted
                  ? "cursor-default border-red-700 bg-red-700 text-white"
                  : "border-amber-600/50 text-amber-400 hover:border-red-600 hover:text-red-400"
                  }`}
              >
                <span>{userHasUpvoted ? "✓" : "▲"}</span>
                <span>
                  {upvoteCount} {upvoteCount === 1 ? "report" : "reports"}
                </span>
              </button>
              <span className="font-mono text-[10px] tracking-wider text-stone-500">
                First reported{" "}
                {new Date(establishment.createdAt).toLocaleDateString("en-LK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {establishment.description && (
              <div>
                <div className="mb-4 flex items-baseline gap-3 border-b-2 border-stone-900 pb-2">
                  <h2 className="font-sans text-xl font-bold">
                    Initial Report
                  </h2>
                  <span className="font-mono text-[10px] tracking-widest text-amber-600 uppercase">
                    Filed by original reporter
                  </span>
                </div>
                <div className="border border-amber-200 bg-amber-100 p-5">
                  <p className="text-sm leading-relaxed font-bold text-stone-700">
                    {establishment.description}
                  </p>
                  {estMedia.length > 0 && (
                    <div className="mt-4">
                      <MediaGallery mediaUrls={estMedia} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border border-amber-200 bg-white p-4">
              <div className="mb-4 flex items-baseline gap-3 border-b-2 border-stone-900 pb-2">
                <h2 className="font-sans text-xl font-bold">Location</h2>
                <span className="font-mono text-[10px] tracking-widest text-amber-600 uppercase">
                  Google Maps
                </span>
              </div>
              <iframe
                title={`Map of ${establishment.name}`}
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(establishment.name + ", " + establishment.location + ", " + establishment.province + ", Sri Lanka")}`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="bg-amber-100"
              />
            </div>

            <div>
              <div className="mb-4 flex items-baseline gap-3 border-b-2 border-stone-900 pb-2">
                <h2 className="font-sans text-xl font-bold">
                  Community Testimonies
                </h2>
                <span className="font-mono text-[10px] tracking-widest text-amber-600 uppercase">
                  {reports.length} filed
                </span>
              </div>

              {reports.length === 0 ? (
                <div className="border border-dashed border-amber-300 p-8 text-center">
                  <p className="font-sans text-lg text-stone-400 italic">
                    No additional testimonies yet.
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-amber-600">
                    Be the first to corroborate this report.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report, i) => {
                    const rMedia = parseMedia(report.mediaUrls)
                    return (
                      <div
                        key={report.id}
                        className="border-b border-amber-200 pb-5"
                      >
                        <div className="flex gap-4">
                          <span className="hidden w-5 shrink-0 pt-0.5 font-mono text-xs text-amber-300 sm:block">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed text-stone-600 italic">
                              &ldquo;{report.testimony}&rdquo;
                            </p>
                            {rMedia.length > 0 && (
                              <div className="mt-3">
                                <MediaGallery mediaUrls={rMedia} />
                              </div>
                            )}
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-wider text-stone-400 uppercase">
                              {report.reporterName && (
                                <span>— {report.reporterName}</span>
                              )}
                              <span>
                                {new Date(report.createdAt).toLocaleDateString(
                                  "en-LK",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-stone-900 p-5 text-amber-50">
              <h3 className="mb-0.5 font-sans text-lg font-bold">
                Add Your Testimony
              </h3>
              <p className="mb-4 font-mono text-[10px] tracking-wider text-amber-600/80 uppercase">
                Share your experience
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                    Your Experience *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe what happened…"
                    value={testimony}
                    onChange={(e) => setTestimony(e.target.value)}
                    className="w-full resize-none border border-stone-700 bg-stone-800 p-3 font-sans text-sm text-amber-50 italic transition-colors placeholder:text-stone-500 focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                    Photos & Videos (optional)
                  </label>
                  <div className="border border-stone-700 p-2">
                    <MediaUploader
                      mediaUrls={mediaUrls}
                      onMediaChange={setMediaUrls}
                      maxFiles={5}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !testimony.trim()}
                  className="w-full bg-red-700 py-2.5 font-mono text-xs tracking-widest text-white uppercase transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-500"
                >
                  {isSubmitting ? "Submitting…" : "▲ Submit Testimony"}
                </button>
              </form>
            </div>

            <div className="border border-amber-200 p-4">
              <h3 className="mb-3 border-b border-amber-200 pb-2 font-sans text-sm font-bold">
                Helpful Links
              </h3>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(establishment.name + " " + establishment.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-b border-amber-100 py-1.5 font-mono text-[11px] tracking-wider text-stone-600 transition-colors last:border-b-0 hover:text-red-700"
              >
                <span>View on Google</span>
                <span className="text-amber-400">↗</span>
              </a>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-stone-500 uppercase transition-colors hover:text-stone-900"
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
