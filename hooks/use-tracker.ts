"use client"

import { useCallback, useSyncExternalStore } from "react"

const SUBMISSION_KEY = "lankanbook_submissions"
const UPVOTE_KEY = "lankanbook_upvoted"

interface SubmissionRecord {
  ids: number[]
  timestamp: number
}

interface UpvoteRecord {
  ids: number[]
}

const emptySubmissions: SubmissionRecord = { ids: [], timestamp: 0 }
const emptyUpvoted: UpvoteRecord = { ids: [] }

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getSubmissions(): SubmissionRecord {
  if (typeof window === "undefined") return emptySubmissions
  const stored = localStorage.getItem(SUBMISSION_KEY)
  if (!stored) return emptySubmissions
  try {
    const parsed = JSON.parse(stored) as SubmissionRecord
    const dayMs = 24 * 60 * 60 * 1000
    if (Date.now() - parsed.timestamp > dayMs) {
      localStorage.removeItem(SUBMISSION_KEY)
      return emptySubmissions
    }
    return parsed
  } catch {
    localStorage.removeItem(SUBMISSION_KEY)
    return emptySubmissions
  }
}

function getUpvoted(): UpvoteRecord {
  if (typeof window === "undefined") return emptyUpvoted
  const stored = localStorage.getItem(UPVOTE_KEY)
  if (!stored) return emptyUpvoted
  try {
    return JSON.parse(stored) as UpvoteRecord
  } catch {
    localStorage.removeItem(UPVOTE_KEY)
    return emptyUpvoted
  }
}

export function useSubmissionTracker(limit: number = 5) {
  const submissions = useSyncExternalStore(
    subscribe,
    getSubmissions,
    getSubmissions
  )

  const canSubmit = submissions.ids.length < limit
  const remaining = Math.max(0, limit - submissions.ids.length)

  const recordSubmission = useCallback(
    (id: number) => {
      const current = getSubmissions()
      if (current.ids.length >= limit) return false
      const updated: SubmissionRecord = {
        ids: [...current.ids, id],
        timestamp: current.timestamp || Date.now(),
      }
      localStorage.setItem(SUBMISSION_KEY, JSON.stringify(updated))
      return true
    },
    [limit]
  )

  return { canSubmit, remaining, recordSubmission }
}

export function useUpvoteTracker() {
  const upvoted = useSyncExternalStore(subscribe, getUpvoted, getUpvoted)

  const hasUpvoted = useCallback(
    (id: number) => upvoted.ids.includes(id),
    [upvoted]
  )

  const recordUpvote = useCallback((id: number) => {
    const current = getUpvoted()
    if (current.ids.includes(id)) return false
    const updated: UpvoteRecord = { ids: [...current.ids, id] }
    localStorage.setItem(UPVOTE_KEY, JSON.stringify(updated))
    return true
  }, [])

  return { hasUpvoted, recordUpvote }
}
