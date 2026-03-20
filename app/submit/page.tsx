"use client"

import { useState } from "react"
import Link from "next/link"
import SiteFooter from "@/components/site-footer"
import { useRouter } from "next/navigation"
import { MediaUploader } from "@/components/media/upload"
import type { Media } from "@/lib/types"

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

interface MediaItem {
  url: string
  type: "image" | "video"
}

export default function SubmitPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mediaUrls, setMediaUrls] = useState<MediaItem[]>([])
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    province: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        const establishment = await res.json()
        router.push(`/establishment/${establishment.id}`)
      }
    } catch {
      console.error("Failed to submit")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Report Establishment
              </h1>
              <p className="text-sm text-muted-foreground">
                Submit a new report
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Report an Establishment</CardTitle>
            <CardDescription>
              Help others by reporting establishments that discriminate against
              locals. Please provide accurate information and any proof you
              have.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Establishment Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Casa Mia"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Hikkaduwa"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <select
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <option value="">Select a province</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe the discrimination *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened, how you were treated differently..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Photos & Videos (optional)</Label>
                <MediaUploader
                  mediaUrls={mediaUrls}
                  onMediaChange={setMediaUrls}
                  maxFiles={10}
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Reports are public and affect business reputations. Only
                    submit accurate information about real experiences. False
                    reports may be removed.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
