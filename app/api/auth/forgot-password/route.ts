import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } })

    if (!user) {
      // Return positive message for security to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, password reset instructions have been sent.",
      })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: cleanEmail,
        token,
        expiresAt,
      },
    })

    const resetLink = `/reset-password?token=${token}`

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully.",
      resetLink, // returned so the user can click it directly during testing
    })
  } catch (err: any) {
    console.error("Forgot password error:", err)
    return NextResponse.json(
      { error: "Failed to process password reset request." },
      { status: 500 }
    )
  }
}
