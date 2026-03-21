/**
 * Shared input validation utilities for API routes.
 */

const VALID_PROVINCES = [
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

export function sanitizeString(
  value: unknown,
  maxLength: number
): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  return trimmed.slice(0, maxLength)
}

export function isValidProvince(province: string): boolean {
  return VALID_PROVINCES.includes(province)
}

export function isValidPositiveInteger(value: unknown): value is number {
  if (typeof value === "string") {
    const parsed = parseInt(value, 10)
    return !isNaN(parsed) && parsed > 0 && String(parsed) === value
  }
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0
  }
  return false
}

export function isValidMediaUrls(value: unknown): value is string[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      typeof item === "string" &&
      item.length < 2048 &&
      (item.startsWith("https://") || item.startsWith("http://"))
  )
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateUploadFile(file: File): {
  valid: boolean
  error?: string
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type "${file.type}". Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
    }
  }

  return { valid: true }
}
