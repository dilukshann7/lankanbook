"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  AlertTriangle,
  MapPin,
  ChevronRight,
  Shield,
  ChevronDown,
} from "lucide-react"

interface Establishment {
  id: number
  name: string
  location: string
  province: string
  description: string | null
  upvotes: number
  createdAt: string
}

const provinces = [
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

type SortOption = "newest" | "most-reported" | "alphabetical"

export default function HomePage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([])
  const [search, setSearch] = useState("")
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEstablishments()
  }, [])

  const fetchEstablishments = async () => {
    try {
      const res = await fetch("/api/establishments")
      const data = await res.json()
      setEstablishments(data)
    } catch {
      console.error("Failed to fetch establishments")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEstablishments = establishments.filter((est) => {
    const matchesSearch =
      est.name.toLowerCase().includes(search.toLowerCase()) ||
      est.location.toLowerCase().includes(search.toLowerCase())
    const matchesProvince =
      !selectedProvince || est.province === selectedProvince
    return matchesSearch && matchesProvince
  })

  const sortedEstablishments = [...filteredEstablishments].sort((a, b) => {
    switch (sortBy) {
      case "most-reported":
        return b.upvotes - a.upvotes
      case "alphabetical":
        return a.name.localeCompare(b.name)
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const totalReports = establishments.reduce((sum, est) => sum + est.upvotes, 0)
  const provinceCount = new Set(establishments.map((est) => est.province)).size

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  LankanBook
                </h1>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Establishments that discriminate against locals
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/submit">Report Establishment</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 rounded-lg bg-muted/50 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <Shield className="h-6 w-6 text-primary sm:mt-1 sm:h-8 sm:w-8" />
            <div>
              <h2 className="mb-1 text-base font-semibold sm:text-lg">
                About This Project
              </h2>
              <p className="text-sm text-muted-foreground">
                This is a community-driven database documenting establishments
                in Sri Lanka that discriminate against local residents. Like the
                Negro Motorist Green Book, our goal is to help locals make
                informed decisions about where to spend their money. Upvote
                reports to verify authenticity.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:flex lg:flex-row">
          <div className="relative lg:flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search establishments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                {selectedProvince || "All Provinces"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setSelectedProvince("")}>
                All Provinces
              </DropdownMenuItem>
              {provinces.map((province) => (
                <DropdownMenuItem
                  key={province}
                  onClick={() => setSelectedProvince(province)}
                >
                  {province}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-between">
                {sortBy === "newest"
                  ? "Newest First"
                  : sortBy === "most-reported"
                    ? "Most Reported"
                    : "Alphabetical"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("most-reported")}>
                Most Reported
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedEstablishments.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              No establishments found
            </h3>
            <p className="mb-4 text-muted-foreground">
              {search || selectedProvince
                ? "Try adjusting your search or filter"
                : "Be the first to report an establishment"}
            </p>
            <Button asChild variant="outline">
              <Link href="/submit">Report Establishment</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sortedEstablishments.map((est) => (
              <Card
                key={est.id}
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{est.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {est.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{est.province}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 sm:pb-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{est.upvotes} reports</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {new Date(est.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="self-start sm:self-auto"
                    >
                      <Link href={`/establishment/${est.id}`}>
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-12 border-t">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            LankanBook — A community project to document discrimination
          </p>
        </div>
      </footer>
    </div>
  )
}
