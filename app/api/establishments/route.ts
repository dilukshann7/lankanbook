import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { establishmentsTable } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import {
  sanitizeString,
  isValidProvince,
  isValidMediaUrls,
} from "@/lib/validation"

export async function GET() {
  try {
    const establishments = await db
      .select()
      .from(establishmentsTable)
      .orderBy(desc(establishmentsTable.upvotes))

    return NextResponse.json(establishments)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch establishments" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name: rawName, location: rawLocation, province: rawProvince, description: rawDescription, mediaUrls } = body

    const name = sanitizeString(rawName, 255)
    const location = sanitizeString(rawLocation, 255)
    const province = sanitizeString(rawProvince, 100)
    const description = sanitizeString(rawDescription, 5000)

    if (!name || !location || !province) {
      return NextResponse.json(
        { error: "Missing required fields: name, location, and province are required." },
        { status: 400 }
      )
    }

    if (!isValidProvince(province)) {
      return NextResponse.json(
        { error: "Invalid province. Please select a valid Sri Lankan province." },
        { status: 400 }
      )
    }

    const urls = mediaUrls || []
    if (!isValidMediaUrls(urls)) {
      return NextResponse.json(
        { error: "Invalid media URLs provided." },
        { status: 400 }
      )
    }

    const newEstablishment = await db
      .insert(establishmentsTable)
      .values({
        name,
        location,
        province,
        description,
        mediaUrls: JSON.stringify(urls),
      })
      .returning()

    return NextResponse.json(newEstablishment[0], { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create establishment" },
      { status: 500 }
    )
  }
}
