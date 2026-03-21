import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import sharp from "sharp"
import { validateUploadFile } from "@/lib/validation"

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

    const validation = validateUploadFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 413 }
      )
    }

    const isImage = file.type.startsWith("image/")
    const buffer = Buffer.from(await file.arrayBuffer())
    const optimizedBuffer = isImage ? await optimizeImage(buffer) : buffer
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${Date.now()}-${sanitizedName}`

    const blob = await put(filename, optimizedBuffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
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
