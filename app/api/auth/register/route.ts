import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { hashPassword, signToken, setTokenCookie, SafeUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, goal } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: "STUDENT",
        goal: goal || "Software Engineering Internship",
        avatar: "/student-avatar.png",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        goal: true,
        avatar: true,
        skillLevel: true,
        learningStyle: true,
        weeklyTime: true,
        bio: true,
        createdAt: true,
      },
    })

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to LearnWise! 🚀",
        message: "Your learning workspace is ready. Explore courses or take a diagnostic quiz to personalize your path.",
        type: "milestone",
      },
    })

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const response = NextResponse.json({
      success: true,
      user,
    })

    setTokenCookie(response, token)
    return response
  } catch (err: any) {
    console.error("Register error:", err)
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    )
  }
}
