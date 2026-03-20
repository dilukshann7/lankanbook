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
    if (!files || files.length === 0) return
    if (mediaUrls.length >= maxFiles) return

    setIsUploading(true)

    try {
      const newMedia: MediaItem[] = []

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
          const type = file.type.startsWith("video") ? "video" : "image"
          newMedia.push({ url, type })
        }
      }

      onMediaChange([...mediaUrls, ...newMedia])
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleUpload(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const removeMedia = (index: number) => {
    const updated = mediaUrls.filter((_, i) => i !== index)
    onMediaChange(updated)
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          dragActive
            ? "border-primary bg-muted/50"
            : "border-muted-foreground/25"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <Video className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Drag and drop photos or videos, or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-primary hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                {mediaUrls.length}/{maxFiles} files uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {mediaUrls.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {mediaUrls.map((media, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-md border bg-muted"
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  className="h-full w-full object-cover"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="text-destructive-foreground absolute top-1 right-1 rounded-full bg-destructive p-1 transition-colors hover:bg-destructive/80"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface MediaGalleryProps {
  mediaUrls: string[]
  className?: string
}

export function MediaGallery({ mediaUrls, className }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (mediaUrls.length === 0) return null

  const parsedMedia = mediaUrls.map((url) => {
    const isVideo = url.match(/\.(mp4|mov|webm|ogg)$/i)
    return { url, type: isVideo ? ("video" as const) : ("image" as const) }
  })

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
          className
        )}
      >
        {parsedMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square overflow-hidden rounded-md border bg-muted transition-opacity hover:opacity-80"
          >
            {media.type === "image" ? (
              <img
                src={media.url}
                alt={`Media ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted-foreground/20">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((prev) =>
                prev! > 0 ? prev! - 1 : parsedMedia.length - 1
              )
            }}
            className="absolute left-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <span className="text-2xl text-white">‹</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIndex((prev) =>
                prev! < parsedMedia.length - 1 ? prev! + 1 : 0
              )
            }}
            className="absolute right-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <span className="text-2xl text-white">›</span>
          </button>

          <div
            className="max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {parsedMedia[selectedIndex].type === "image" ? (
              <img
                src={parsedMedia[selectedIndex].url}
                alt={`Media ${selectedIndex + 1}`}
                className="max-h-[90vh] max-w-full object-contain"
              />
            ) : (
              <video
                src={parsedMedia[selectedIndex].url}
                className="max-h-[90vh] max-w-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
