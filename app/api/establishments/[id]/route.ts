import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { establishmentsTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { isValidPositiveInteger } from "@/lib/validation"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!isValidPositiveInteger(id)) {
      return NextResponse.json(
        { error: "Invalid establishment ID." },
        { status: 400 }
      )
    }

    const establishment = await db
      .select()
      .from(establishmentsTable)
      .where(eq(establishmentsTable.id, parseInt(id)))
      .limit(1)

    if (establishment.length === 0) {
      return NextResponse.json(
        { error: "Establishment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(establishment[0])
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch establishment" },
      { status: 500 }
    )
  }
}
