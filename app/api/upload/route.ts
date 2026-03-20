import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"

const MAX_WIDTH = 1920
const MAX_HEIGHT = 1920
const QUALITY = 80

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  if (!metadata.width || !metadata.height) {
    return buffer
  }

  let optimized = image.clone()

  if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
    optimized = optimized.resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  if (metadata.format === "jpeg" || metadata.format === "jpg") {
    return optimized.jpeg({ quality: QUALITY }).toBuffer()
  }

  if (metadata.format === "png") {
    return optimized.png({ compressionLevel: 9, quality: QUALITY }).toBuffer()
  }

  if (metadata.format === "webp") {
    return optimized.webp({ quality: QUALITY }).toBuffer()
  }

  if (metadata.format === "gif") {
    return optimized.gif().toBuffer()
  }

  return optimized.jpeg({ quality: QUALITY }).toBuffer()
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
