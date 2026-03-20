"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  MapPin,
  ThumbsUp,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Home,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { MediaUploader, MediaGallery } from "@/components/media/upload"

interface MediaItem {
  url: string
  type: "image" | "video"
}

interface Establishment {
  id: number
  name: string
  location: string
  province: string
  description: string | null
  mediaUrls: string
  upvotes: number
  createdAt: string
}

interface Report {
  id: number
  establishmentId: number
  testimony: string
  mediaUrls: string
  reporterName: string | null
  upvotes: number
  createdAt: string
}

export default function EstablishmentPage() {
  const params = useParams()
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [testimony, setTestimony] = useState("")
  const [mediaUrls, setMediaUrls] = useState<MediaItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUpvoted, setHasUpvoted] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [estRes, reportsRes] = await Promise.all([
        fetch(`/api/establishments/${params.id}`),
        fetch(`/api/reports?establishmentId=${params.id}`),
      ])

      if (estRes.ok) {
        const estData = await estRes.json()
        setEstablishment(estData)
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData)
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

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!testimony.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          establishmentId: params.id,
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
      console.error("Failed to submit report")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpvote = async () => {
    if (hasUpvoted) return
    setHasUpvoted(true)
    try {
      await fetch(`/api/establishments/${params.id}/upvote`, {
        method: "POST",
      })
    } catch {
      setHasUpvoted(false)
    }
  }

  const parseMediaUrls = (urls: string): string[] => {
    try {
      return JSON.parse(urls || "[]")
    } catch {
      return []
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!establishment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-12 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            Establishment not found
          </h3>
          <Button asChild variant="outline">
            <Link href="/">Go Back</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const establishmentMedia = parseMediaUrls(establishment.mediaUrls)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {establishment.name}
              </h1>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {establishment.location} • {establishment.province}
              </p>
            </div>
            <button
              onClick={handleUpvote}
              disabled={hasUpvoted}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                hasUpvoted
                  ? "bg-destructive/20 text-destructive"
                  : "bg-destructive/10 text-destructive hover:bg-destructive/20"
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 ${hasUpvoted ? "animate-bounce" : ""}`}
              />
              {establishment.upvotes + (hasUpvoted ? 1 : 0)} reports
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {establishment.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Initial Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {establishment.description}
                  </p>
                  {establishmentMedia.length > 0 && (
                    <MediaGallery mediaUrls={establishmentMedia} />
                  )}
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="mb-4 text-xl font-semibold">
                Community Reports ({reports.length})
              </h2>
              {reports.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No additional reports yet
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => {
                    const reportMedia = parseMediaUrls(report.mediaUrls)
                    return (
                      <Card key={report.id}>
                        <CardContent className="space-y-4 pt-6">
                          <p className="text-muted-foreground">
                            {report.testimony}
                          </p>
                          {reportMedia.length > 0 && (
                            <MediaGallery mediaUrls={reportMedia} />
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {report.reporterName && (
                                <span>Reported by {report.reporterName}</span>
                              )}
                              <span>
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Your Report</CardTitle>
                <CardDescription>
                  Share your experience to help others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testimony">Your Experience *</Label>
                    <Textarea
                      id="testimony"
                      placeholder="Describe what happened..."
                      rows={4}
                      value={testimony}
                      onChange={(e) => setTestimony(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Photos & Videos (optional)</Label>
                    <MediaUploader
                      mediaUrls={mediaUrls}
                      onMediaChange={setMediaUrls}
                      maxFiles={5}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Helpful Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(establishment.name + " " + establishment.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted"
                >
                  <span className="text-sm">View on Google</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
