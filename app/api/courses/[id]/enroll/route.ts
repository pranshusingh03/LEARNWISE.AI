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
      return NextResponse.json({ error: "Please log in to enroll." }, { status: 401 })
    }

    const { id: courseId } = await params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: "Already enrolled",
        enrollment: existingEnrollment,
      })
    }

    // Create enrollment and increment student count in transaction
    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId,
          progress: 0,
          status: "IN_PROGRESS",
        },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: { students: { increment: 1 } },
      }),
      prisma.notification.create({
        data: {
          userId: user.id,
          title: `Enrolled: ${course.title} 🎓`,
          message: `You've enrolled in ${course.title}. Start with Module 1 now!`,
          type: "info",
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in course!",
      enrollment,
    })
  } catch (err: any) {
    console.error("Enrollment error:", err)
    return NextResponse.json(
      { error: "Failed to enroll in course." },
      { status: 500 }
    )
  }
}
