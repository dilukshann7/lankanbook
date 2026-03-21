import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reportsTable } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import {
  sanitizeString,
  isValidPositiveInteger,
  isValidMediaUrls,
} from "@/lib/validation"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get("establishmentId")

    if (establishmentId) {
      if (!isValidPositiveInteger(establishmentId)) {
        return NextResponse.json(
          { error: "Invalid establishment ID." },
          { status: 400 }
        )
      }

      const reports = await db
        .select()
        .from(reportsTable)
        .where(eq(reportsTable.establishmentId, parseInt(establishmentId)))
        .orderBy(desc(reportsTable.upvotes))
      return NextResponse.json(reports)
    }

    const reports = await db
      .select()
      .from(reportsTable)
      .orderBy(desc(reportsTable.upvotes))

    return NextResponse.json(reports)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      establishmentId,
      testimony: rawTestimony,
      mediaUrls,
      reporterName: rawReporterName,
    } = body

    if (!isValidPositiveInteger(establishmentId)) {
      return NextResponse.json(
        { error: "Invalid or missing establishment ID." },
        { status: 400 }
      )
    }

    const testimony = sanitizeString(rawTestimony, 5000)
    if (!testimony) {
      return NextResponse.json(
        { error: "Testimony is required and cannot be empty." },
        { status: 400 }
      )
    }

    const reporterName = sanitizeString(rawReporterName, 255)

    const urls = mediaUrls || []
    if (!isValidMediaUrls(urls)) {
      return NextResponse.json(
        { error: "Invalid media URLs provided." },
        { status: 400 }
      )
    }

    const newReport = await db
      .insert(reportsTable)
      .values({
        establishmentId,
        testimony,
        mediaUrls: JSON.stringify(urls),
        reporterName,
      })
      .returning()

    return NextResponse.json(newReport[0], { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    )
  }
}
