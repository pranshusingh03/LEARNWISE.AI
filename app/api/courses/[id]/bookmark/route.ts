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

    const { id: courseId } = await params

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    })

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      })
      return NextResponse.json({ success: true, bookmarked: false })
    } else {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          courseId,
        },
      })
      return NextResponse.json({ success: true, bookmarked: true })
    }
  } catch (err: any) {
    console.error("Bookmark toggle error:", err)
    return NextResponse.json(
      { error: "Failed to toggle bookmark." },
      { status: 500 }
    )
  }
}
