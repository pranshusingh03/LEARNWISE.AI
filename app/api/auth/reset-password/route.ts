import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      )
    }

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetTokenRecord || resetTokenRecord.used || resetTokenRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This password reset link is invalid or has expired." },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetTokenRecord.email },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { used: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. Please log in with your new password.",
    })
  } catch (err: any) {
    console.error("Reset password error:", err)
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    )
  }
}
