import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface RateLimitRecord {
  count: number
  timestamp: number
}

const rateLimit = new Map<string, RateLimitRecord>()
const RATE_LIMIT_WINDOW = 60 * 1000
const MAX_GET_REQUESTS = 100
const MAX_MUTATE_REQUESTS = 30
const CLEANUP_INTERVAL = 5 * 60 * 1000

let lastCleanup = Date.now()

function cleanupStaleEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, record] of rateLimit.entries()) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.delete(key)
    }
  }
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : (request.headers.get("x-real-ip") ?? "unknown")
  return `${ip}:${request.method}`
}

function isRateLimited(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimit.get(key)

  if (!record) {
    rateLimit.set(key, { count: 1, timestamp: now })
    return false
  }

  if (now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(key, { count: 1, timestamp: now })
    return false
  }

  if (record.count >= maxRequests) {
    return true
  }

  record.count++
  return false
}

export function middleware(request: NextRequest) {
  cleanupStaleEntries()

  const key = getRateLimitKey(request)
  const isMutating =
    request.method === "POST" ||
    request.method === "PUT" ||
    request.method === "DELETE"
  const maxRequests = isMutating ? MAX_MUTATE_REQUESTS : MAX_GET_REQUESTS

  if (isRateLimited(key, maxRequests)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      }
    )
  }

  const response = NextResponse.next()
  response.headers.set("X-Request-ID", crypto.randomUUID())
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")

  return response
}

export const config = {
  matcher: ["/api/:path*"],
}
