"use client"

import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4 font-sans text-stone-900">
      <p className="mb-2 font-sans text-[80px] leading-none font-black text-red-200">
        ⚠
      </p>
      <h1 className="mb-2 font-sans text-2xl font-bold italic">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-sm text-center text-sm text-stone-500">
        An unexpected error occurred. Please try again or return to the home
        page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="border border-amber-300 px-5 py-2.5 font-mono text-xs tracking-widest text-stone-600 uppercase transition-colors hover:border-stone-400 hover:text-stone-900"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-stone-900 px-6 py-2.5 font-mono text-xs tracking-widest text-amber-50 uppercase transition-colors hover:bg-stone-700"
        >
          ← Home
        </Link>
      </div>
    </div>
  )
}
