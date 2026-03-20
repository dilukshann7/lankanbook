import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { reportsTable } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const establishmentId = searchParams.get("establishmentId")

    if (establishmentId) {
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
    const { establishmentId, testimony, mediaUrls, reporterName } = body

    const newReport = await db
      .insert(reportsTable)
      .values({
        establishmentId,
        testimony,
        mediaUrls: JSON.stringify(mediaUrls || []),
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
