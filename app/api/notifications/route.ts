import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ notifications: [] }, { status: 200 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ notifications })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, markAllRead } = await request.json()

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true, message: "All notifications marked as read." })
    }

    if (id) {
      await prisma.notification.update({
        where: { id, userId: user.id },
        data: { read: true },
      })
      return NextResponse.json({ success: true, message: "Notification marked as read." })
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
