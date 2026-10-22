import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ tasks: [] }, { status: 200 })
    }

    const tasks = await prisma.studyTask.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ tasks })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch study plan" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { day, title, duration } = await request.json()

    if (!day || !title) {
      return NextResponse.json({ error: "Day and task title are required." }, { status: 400 })
    }

    const task = await prisma.studyTask.create({
      data: {
        userId: user.id,
        day,
        title: title.trim(),
        duration: duration || "30 min",
        done: false,
      },
    })

    return NextResponse.json({ success: true, task })
  } catch (err: any) {
    console.error("Create task error:", err)
    return NextResponse.json({ error: "Failed to create study task." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, done } = await request.json()

    const task = await prisma.studyTask.update({
      where: { id, userId: user.id },
      data: { done: !!done },
    })

    return NextResponse.json({ success: true, task })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 })
    }

    await prisma.studyTask.delete({
      where: { id, userId: user.id },
    })

    return NextResponse.json({ success: true, message: "Task removed." })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 })
  }
}
