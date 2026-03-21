"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 px-4 font-sans text-stone-900">
      <p className="mb-2 font-sans text-[120px] leading-none font-black text-amber-200">
        404
      </p>
      <h1 className="mb-2 font-sans text-2xl font-bold italic">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-sm text-center text-sm text-stone-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-stone-900 px-6 py-2.5 font-mono text-xs tracking-widest text-amber-50 uppercase transition-colors hover:bg-stone-700"
      >
        ← Back to Records
      </Link>
    </div>
  )
}
