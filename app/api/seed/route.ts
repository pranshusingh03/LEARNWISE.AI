import { NextResponse } from "next/server"
import { runSeed } from "@/prisma/seed"

export async function POST() {
  try {
    await runSeed()
    return NextResponse.json({ success: true, message: "Database seeded successfully." })
  } catch (err: any) {
    console.error("Seed route error:", err)
    return NextResponse.json({ error: "Failed to seed database." }, { status: 500 })
  }
}
