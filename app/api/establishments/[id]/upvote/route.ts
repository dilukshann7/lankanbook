import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { establishmentsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updated = await db
      .update(establishmentsTable)
      .set({ upvotes: sql`${establishmentsTable.upvotes} + 1` })
      .where(eq(establishmentsTable.id, parseInt(id)))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Establishment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated[0])
  } catch {
    return NextResponse.json(
      { error: "Failed to upvote establishment" },
      { status: 500 }
    )
  }
}
