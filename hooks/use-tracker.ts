"use client"

import { useCallback, useMemo } from "react"

const SUBMISSION_KEY = "lankanbook_submissions"
const UPVOTE_KEY = "lankanbook_upvoted"

interface SubmissionRecord {
  ids: number[]
  timestamp: number
}

interface UpvoteRecord {
  ids: number[]
}

function getStoredSubmissions(): SubmissionRecord {
  if (typeof window === "undefined") return { ids: [], timestamp: 0 }
  const stored = localStorage.getItem(SUBMISSION_KEY)
  if (!stored) return { ids: [], timestamp: 0 }
  try {
    const parsed = JSON.parse(stored) as SubmissionRecord
    const dayMs = 24 * 60 * 60 * 1000
    if (Date.now() - parsed.timestamp > dayMs) {
      localStorage.removeItem(SUBMISSION_KEY)
      return { ids: [], timestamp: 0 }
    }
    return parsed
  } catch {
    localStorage.removeItem(SUBMISSION_KEY)
    return { ids: [], timestamp: 0 }
  }
}

function getStoredUpvoted(): UpvoteRecord {
  if (typeof window === "undefined") return { ids: [] }
  const stored = localStorage.getItem(UPVOTE_KEY)
  if (!stored) return { ids: [] }
  try {
    return JSON.parse(stored) as UpvoteRecord
  } catch {
    localStorage.removeItem(UPVOTE_KEY)
    return { ids: [] }
  }
}

export function useSubmissionTracker(limit: number = 5) {
  const submissions = useMemo(getStoredSubmissions, [])

  const canSubmit = submissions.ids.length < limit
  const remaining = Math.max(0, limit - submissions.ids.length)

  const recordSubmission = useCallback(
    (id: number) => {
      const current = getStoredSubmissions()
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
  const upvoted = useMemo(getStoredUpvoted, [])

  const hasUpvoted = useCallback(
    (id: number) => {
      return upvoted.ids.includes(id)
    },
    [upvoted]
  )

  const recordUpvote = useCallback(
    (id: number) => {
      if (upvoted.ids.includes(id)) return false
      const updated: UpvoteRecord = { ids: [...upvoted.ids, id] }
      localStorage.setItem(UPVOTE_KEY, JSON.stringify(updated))
      return true
    },
    [upvoted]
  )

  return { hasUpvoted, recordUpvote }
}
