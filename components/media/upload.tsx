"use client"

import { useState, useRef, DragEvent } from "react"
import type { Media } from "@/lib/types"

interface MediaUploaderProps {
  mediaUrls: Media[]
  onMediaChange: (media: Media[]) => void
  maxFiles?: number
}

export function MediaUploader({
  mediaUrls,
  onMediaChange,
  maxFiles = 10,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || mediaUrls.length >= maxFiles) return
    setIsUploading(true)
    try {
      const newMedia = []
      for (
        let i = 0;
        i < files.length && mediaUrls.length + newMedia.length < maxFiles;
        i++
      ) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (res.ok) {
          const { url } = await res.json()
          newMedia.push({
            url,
            type: (file.type.startsWith("video") ? "video" : "image") as
              | "video"
              | "image",
          })
        }
      }
      onMediaChange([...mediaUrls, ...newMedia])
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    handleUpload(e.dataTransfer.files)
  }
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }
  const handleDragLeave = () => setDragActive(false)
  const removeMedia = (index: number) =>
    onMediaChange(mediaUrls.filter((_, i) => i !== index))
  const atLimit = mediaUrls.length >= maxFiles

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-amber-500 bg-amber-50"
            : atLimit
              ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-60"
              : "border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono-dm animate-pulse text-xs tracking-widest text-amber-600 uppercase">
              Uploading…
            </span>
            <div className="relative h-px w-32 overflow-hidden bg-amber-200">
              <div
                className="absolute inset-y-0 left-0 animate-[loading_1s_ease-in-out_infinite] bg-amber-500"
                style={{
                  width: "40%",
                  animation: "slide 1s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl text-amber-400 select-none">⊕</span>
            <p className="font-mono-dm text-[11px] tracking-wider text-stone-500">
              Drag & drop photos or videos, or{" "}
              <button
                type="button"
                onClick={() => !atLimit && inputRef.current?.click()}
                className="text-amber-700 underline underline-offset-2 transition-colors hover:text-amber-500"
              >
                browse
              </button>
            </p>
            <p className="font-mono-dm text-[10px] tracking-widest text-amber-400 uppercase">
              {mediaUrls.length} / {maxFiles} files
            </p>
          </div>
        )}
      </div>

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {mediaUrls.map((media, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden border border-amber-200 bg-stone-100"
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-200">
                  <span className="text-2xl text-stone-400">▶</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute inset-0 flex items-center justify-center bg-stone-900/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <span className="font-mono-dm text-[10px] tracking-widest text-red-300 uppercase">
                  Remove
                </span>
              </button>
              <span className="font-mono-dm absolute bottom-1 left-1 bg-stone-900/70 px-1 text-[9px] text-amber-200">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  )
}

export function MediaGallery({
  mediaUrls,
  className = "",
}: {
  mediaUrls: string[]
  className?: string
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!mediaUrls || mediaUrls.length === 0) return null

  const parsed: Media[] = mediaUrls.map((url) => ({
    url,
    type: (/\.(mp4|mov|webm|ogg)$/i.test(url) ? "video" : "image") as
      | "video"
      | "image",
  }))

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : parsed.length - 1))
  }
  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIndex((i) => (i !== null && i < parsed.length - 1 ? i + 1 : 0))
  }

  return (
    <>
      <div className={`grid grid-cols-3 gap-1.5 sm:grid-cols-4 ${className}`}>
        {parsed.map((media, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-square overflow-hidden border border-amber-200 bg-stone-100 transition-colors hover:border-amber-500"
          >
            {media.type === "image" ? (
              <img
                src={media.url}
                alt={`Media ${index + 1}`}
                className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stone-200">
                <span className="text-2xl text-stone-400 transition-colors group-hover:text-stone-600">
                  ▶
                </span>
              </div>
            )}
            <span className="font-mono-dm absolute bottom-1 left-1 bg-stone-900/70 px-1 text-[9px] text-amber-200">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="absolute top-0 right-0 left-0 flex items-center justify-between border-b border-stone-800 px-4 py-3 sm:px-6">
            <span className="font-mono-dm text-[10px] tracking-widest text-amber-600 uppercase">
              LankanBook · Evidence
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono-dm text-[10px] tracking-widest text-stone-500">
                {selectedIndex + 1} / {parsed.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="font-mono-dm text-[10px] tracking-widest text-stone-400 uppercase transition-colors hover:text-amber-400"
              >
                Close ×
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            className="font-mono-dm absolute left-3 z-10 px-2 py-4 text-2xl text-stone-400 transition-colors hover:text-amber-400 sm:left-6"
          >
            ‹
          </button>

          <div
            className="mx-16 mt-10 max-h-[80vh] max-w-4xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {parsed[selectedIndex].type === "image" ? (
              <img
                src={parsed[selectedIndex].url}
                alt={`Media ${selectedIndex + 1}`}
                className="max-h-[80vh] max-w-full border border-stone-700 object-contain"
              />
            ) : (
              <video
                src={parsed[selectedIndex].url}
                className="max-h-[80vh] max-w-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>

          <button
            type="button"
            onClick={next}
            className="font-mono-dm absolute right-3 z-10 px-2 py-4 text-2xl text-stone-400 transition-colors hover:text-amber-400 sm:right-6"
          >
            ›
          </button>

          {parsed.length > 1 && (
            <div className="absolute right-0 bottom-0 left-0 flex justify-center gap-1.5 border-t border-stone-800 py-3">
              {parsed.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedIndex(i)
                  }}
                  className={`h-1 w-6 transition-colors ${i === selectedIndex ? "bg-amber-500" : "bg-stone-600 hover:bg-stone-400"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
