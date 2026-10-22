import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getUserFromRequest(request)

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    let isEnrolled = false
    let enrollmentProgress = 0
    let completedLessonIds = new Set<string>()
    let isBookmarked = false

    if (currentUser) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: currentUser.id,
            courseId: id,
          },
        },
      })

      if (enrollment) {
        isEnrolled = true
        enrollmentProgress = enrollment.progress

        // Get completed lessons
        const progressRecords = await prisma.lessonProgress.findMany({
          where: {
            userId: currentUser.id,
            courseId: id,
            completed: true,
          },
          select: { lessonId: true },
        })
        progressRecords.forEach((p) => completedLessonIds.add(p.lessonId))
      }

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          userId_courseId: {
            userId: currentUser.id,
            courseId: id,
          },
        },
      })
      isBookmarked = !!bookmark
    }

    let parsedTags: string[] = []
    try {
      parsedTags = JSON.parse(course.tags)
    } catch {
      parsedTags = []
    }

    const DEFAULT_VIDEOS: Record<string, string> = {
      Programming: "https://www.youtube.com/embed/8hly31xKli0",
      "Web Development": "https://www.youtube.com/embed/bMknfKXIFA8",
      "Artificial Intelligence": "https://www.youtube.com/embed/i_LwzRVP7bg",
      "Data Science": "https://www.youtube.com/embed/HXV3zeQKqGY",
      Cybersecurity: "https://www.youtube.com/embed/inWWhr5tnEA",
      "Cloud Computing": "https://www.youtube.com/embed/k1RI5locZE4",
    }

    const formattedModules = course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      duration: m.duration,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        moduleId: l.moduleId,
        courseId: l.courseId,
        title: l.title,
        duration: l.duration,
        videoUrl:
          l.videoUrl ||
          DEFAULT_VIDEOS[course.category] ||
          "https://www.youtube.com/embed/8hly31xKli0",
        content: l.content,
        order: l.order,
        completed: completedLessonIds.has(l.id),
      })),
    }))

    const formattedReviews = course.reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userAvatar: r.user.avatar,
      courseId: r.courseId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }))

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration,
        rating: course.rating,
        students: course.students,
        lessons: course.lessons,
        match: course.match,
        description: course.description,
        gradient: course.gradient,
        tags: parsedTags,
        published: course.published,
        isEnrolled,
        progress: enrollmentProgress,
        isBookmarked,
        modules: formattedModules,
        reviews: formattedReviews,
      },
    })
  } catch (err: any) {
    console.error("Fetch course details error:", err)
    return NextResponse.json(
      { error: "Failed to fetch course details." },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.instructor && { instructor: body.instructor }),
        ...(body.category && { category: body.category }),
        ...(body.difficulty && { difficulty: body.difficulty }),
        ...(body.duration && { duration: body.duration }),
        ...(body.description && { description: body.description }),
        ...(body.gradient && { gradient: body.gradient }),
        ...(body.tags && { tags: JSON.stringify(body.tags) }),
        ...(body.published !== undefined && { published: body.published }),
      },
    })

    return NextResponse.json({ success: true, course: updated })
  } catch (err: any) {
    console.error("Update course error:", err)
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Course deleted." })
  } catch (err: any) {
    console.error("Delete course error:", err)
    return NextResponse.json({ error: "Failed to delete course." }, { status: 500 })
  }
}
