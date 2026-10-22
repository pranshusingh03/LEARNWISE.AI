import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.toLowerCase() || ""
    const category = searchParams.get("category") || ""
    const difficulty = searchParams.get("difficulty") || ""
    const sort = searchParams.get("sort") || "popular"

    const currentUser = await getUserFromRequest(request)

    // Build filter conditions
    const where: any = {
      published: true,
    }

    if (category) {
      where.category = category
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { instructor: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    let orderBy: any = { students: "desc" }
    if (sort === "rating") orderBy = { rating: "desc" }
    else if (sort === "newest") orderBy = { createdAt: "desc" }
    else if (sort === "duration") orderBy = { duration: "asc" }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { lessonsList: true },
        },
      },
    })

    // If user is logged in, attach enrollment and bookmark statuses
    let enrollmentsMap = new Map<string, number>()
    let bookmarksSet = new Set<string>()

    if (currentUser) {
      const userEnrollments = await prisma.enrollment.findMany({
        where: { userId: currentUser.id },
        select: { courseId: true, progress: true },
      })
      userEnrollments.forEach((e) => enrollmentsMap.set(e.courseId, e.progress))

      const userBookmarks = await prisma.bookmark.findMany({
        where: { userId: currentUser.id },
        select: { courseId: true },
      })
      userBookmarks.forEach((b) => bookmarksSet.add(b.courseId))
    }

    const formattedCourses = courses.map((c) => {
      let parsedTags: string[] = []
      try {
        parsedTags = JSON.parse(c.tags)
      } catch {
        parsedTags = []
      }

      return {
        id: c.id,
        title: c.title,
        instructor: c.instructor,
        category: c.category,
        difficulty: c.difficulty,
        duration: c.duration,
        rating: c.rating,
        students: c.students,
        lessons: c._count.lessonsList || c.lessons,
        match: c.match,
        description: c.description,
        gradient: c.gradient,
        tags: parsedTags,
        published: c.published,
        isEnrolled: enrollmentsMap.has(c.id),
        progress: enrollmentsMap.get(c.id) ?? 0,
        isBookmarked: bookmarksSet.has(c.id),
      }
    })

    return NextResponse.json({ courses: formattedCourses })
  } catch (err: any) {
    console.error("Fetch courses error:", err)
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      instructor,
      category,
      difficulty,
      duration,
      description,
      gradient,
      tags,
    } = body

    if (!title || !instructor || !category || !difficulty || !duration || !description) {
      return NextResponse.json(
        { error: "All course fields are required." },
        { status: 400 }
      )
    }

    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const course = await prisma.course.create({
      data: {
        id: `${id}-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        instructor: instructor.trim(),
        category,
        difficulty,
        duration,
        description,
        gradient: gradient || "from-indigo-500 to-violet-600",
        tags: JSON.stringify(tags || []),
        published: true,
      },
    })

    return NextResponse.json({ success: true, course })
  } catch (err: any) {
    console.error("Create course error:", err)
    return NextResponse.json(
      { error: "Failed to create course." },
      { status: 500 }
    )
  }
}
