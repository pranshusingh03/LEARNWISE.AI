import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Administrator access required" }, { status: 403 })
    }

    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      completedEnrollments,
      totalQuizAttempts,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.enrollment.count({ where: { status: "COMPLETED" } }),
      prisma.quizAttempt.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          goal: true,
          createdAt: true,
        },
      }),
    ])

    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        completedEnrollments,
        completionRate,
        totalQuizAttempts,
      },
      recentUsers,
    })
  } catch (err: any) {
    console.error("Admin stats error:", err)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
