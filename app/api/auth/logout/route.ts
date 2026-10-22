import { NextResponse } from "next/server"
import { removeTokenCookie } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" })
  removeTokenCookie(response)
  return response
}
