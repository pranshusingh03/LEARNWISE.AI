import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: lessonId } = await params

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    const courseId = lesson.courseId

    // Ensure enrollment exists
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId,
          progress: 0,
          status: "IN_PROGRESS",
        },
      })
    }

    // Optional explicit completion state from request body
    let requestedCompleted: boolean | undefined = undefined
    try {
      const body = await request.json()
      if (typeof body?.completed === "boolean") {
        requestedCompleted = body.completed
      }
    } catch {
      // No JSON body passed, default to toggling
    }

    // Check if already completed
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    })

    let completedState = true

    if (existingProgress) {
      // If explicit completed was passed, use it; otherwise toggle
      completedState = requestedCompleted !== undefined ? requestedCompleted : !existingProgress.completed
      await prisma.lessonProgress.update({
        where: { id: existingProgress.id },
        data: { completed: completedState },
      })
    } else {
      completedState = requestedCompleted !== undefined ? requestedCompleted : true
      await prisma.lessonProgress.create({
        data: {
          userId: user.id,
          lessonId,
          courseId,
          completed: completedState,
        },
      })
    }

    // Recalculate course percentage
    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    })

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        courseId,
        completed: true,
      },
    })

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    const isFullyCompleted = progressPercentage >= 100

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: progressPercentage,
        lastAccessedAt: new Date(),
        status: isFullyCompleted ? "COMPLETED" : "IN_PROGRESS",
        ...(isFullyCompleted && !enrollment.completedAt && { completedAt: new Date() }),
      },
    })

    // If fully completed for first time, create notification
    if (isFullyCompleted && enrollment.status !== "COMPLETED") {
      const course = await prisma.course.findUnique({ where: { id: courseId } })
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Course Completed: ${course?.title || "Course"} 🏆`,
          message: `Congratulations on finishing all lessons! You've mastered this skill track.`,
          type: "milestone",
        },
      })
    }

    return NextResponse.json({
      success: true,
      completed: completedState,
      courseProgress: progressPercentage,
      isFullyCompleted,
    })
  } catch (err: any) {
    console.error("Mark lesson complete error:", err)
    return NextResponse.json(
      { error: "Failed to update lesson completion status." },
      { status: 500 }
    )
  }
}
