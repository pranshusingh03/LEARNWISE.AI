import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        goal: true,
        skillLevel: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            quizAttempts: true,
          },
        },
      },
    })

    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      goal: u.goal,
      skillLevel: u.skillLevel,
      createdAt: u.createdAt.toISOString(),
      enrollmentsCount: u._count.enrollments,
      quizAttemptsCount: u._count.quizAttempts,
    }))

    return NextResponse.json({ users: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
