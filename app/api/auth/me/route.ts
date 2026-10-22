import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    return NextResponse.json({ user })
  } catch (err: any) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, goal, skillLevel, learningStyle, weeklyTime, bio } = body

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(goal !== undefined && { goal }),
        ...(skillLevel !== undefined && { skillLevel }),
        ...(learningStyle !== undefined && { learningStyle }),
        ...(weeklyTime !== undefined && { weeklyTime }),
        ...(bio !== undefined && { bio }),
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

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err: any) {
    console.error("Update profile error:", err)
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    )
  }
}
