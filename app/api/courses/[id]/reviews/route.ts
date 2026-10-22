import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const reviews = await prisma.courseReview.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
      },
    })

    const formatted = reviews.map((r) => ({
      id: r.id,
      userId: r.userId,
      userName: r.user.name,
      userAvatar: r.user.avatar,
      courseId: r.courseId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }))

    return NextResponse.json({ reviews: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Please log in to submit a review." }, { status: 401 })
    }

    const { id: courseId } = await params
    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5 stars." }, { status: 400 })
    }

    if (!comment || comment.trim().length < 5) {
      return NextResponse.json({ error: "Review comment must be at least 5 characters." }, { status: 400 })
    }

    const review = await prisma.courseReview.create({
      data: {
        userId: user.id,
        courseId,
        rating: Math.round(rating),
        comment: comment.trim(),
      },
    })

    // Recalculate average rating
    const allReviews = await prisma.courseReview.findMany({
      where: { courseId },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1)

    await prisma.course.update({
      where: { id: courseId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    })

    return NextResponse.json({ success: true, review })
  } catch (err: any) {
    console.error("Create review error:", err)
    return NextResponse.json({ error: "Failed to post review." }, { status: 500 })
  }
}
