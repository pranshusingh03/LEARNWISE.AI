import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { comparePassword, signToken, setTokenCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      )
    }

    const isMatch = await comparePassword(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      goal: user.goal,
      avatar: user.avatar,
      skillLevel: user.skillLevel,
      learningStyle: user.learningStyle,
      weeklyTime: user.weeklyTime,
      bio: user.bio,
      createdAt: user.createdAt,
    }

    const response = NextResponse.json({
      success: true,
      user: safeUser,
    })

    setTokenCookie(response, token)
    return response
  } catch (err: any) {
    console.error("Login error:", err)
    return NextResponse.json(
      { error: "Internal server error during login." },
      { status: 500 }
    )
  }
}
