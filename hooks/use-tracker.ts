"use client"

import { useEffect, useState, useCallback } from "react"

const SUBMISSION_KEY = "lankanbook_submissions"
const UPVOTE_KEY = "lankanbook_upvoted"

interface SubmissionRecord {
  ids: number[]
  timestamp: number
}

interface UpvoteRecord {
  ids: number[]
}

export function useSubmissionTracker(limit: number = 5) {
  const [submissions, setSubmissions] = useState<SubmissionRecord | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(SUBMISSION_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SubmissionRecord
        const dayMs = 24 * 60 * 60 * 1000
        if (Date.now() - parsed.timestamp > dayMs) {
          localStorage.removeItem(SUBMISSION_KEY)
          setSubmissions({ ids: [], timestamp: Date.now() })
        } else {
          setSubmissions(parsed)
        }
      } catch {
        localStorage.removeItem(SUBMISSION_KEY)
        setSubmissions({ ids: [], timestamp: Date.now() })
      }
    } else {
      setSubmissions({ ids: [], timestamp: Date.now() })
    }
  }, [])

  const canSubmit = submissions !== null && submissions.ids.length < limit
  const remaining =
    submissions !== null ? Math.max(0, limit - submissions.ids.length) : limit

  const recordSubmission = useCallback(
    (id: number) => {
      if (!submissions) return
      const updated = {
        ids: [...submissions.ids, id],
        timestamp: submissions.timestamp,
      }
      setSubmissions(updated)
      localStorage.setItem(SUBMISSION_KEY, JSON.stringify(updated))
    },
    [submissions]
  )

  return { canSubmit, remaining, recordSubmission }
}

export function useUpvoteTracker() {
  const [upvoted, setUpvoted] = useState<UpvoteRecord | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(UPVOTE_KEY)
    if (stored) {
      try {
        setUpvoted(JSON.parse(stored) as UpvoteRecord)
      } catch {
        localStorage.removeItem(UPVOTE_KEY)
        setUpvoted({ ids: [] })
      }
    } else {
      setUpvoted({ ids: [] })
    }
  }, [])

  const hasUpvoted = useCallback(
    (id: number) => {
      return upvoted?.ids.includes(id) ?? false
    },
    [upvoted]
  )

  const recordUpvote = useCallback(
    (id: number) => {
      if (!upvoted || upvoted.ids.includes(id)) return
      const updated = { ids: [...upvoted.ids, id] }
      setUpvoted(updated)
      localStorage.setItem(UPVOTE_KEY, JSON.stringify(updated))
    },
    [upvoted]
  )

  return { hasUpvoted, recordUpvote }
}
