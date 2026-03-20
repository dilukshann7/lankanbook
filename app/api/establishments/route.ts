import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { establishmentsTable } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

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
    const { name, location, province, description, mediaUrls } = body

    const newEstablishment = await db
      .insert(establishmentsTable)
      .values({
        name,
        location,
        province,
        description,
        mediaUrls: JSON.stringify(mediaUrls || []),
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
