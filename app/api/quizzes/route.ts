import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: { select: { questions: true, attempts: true } },
      },
    })

    const formatted = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      topic: q.topic,
      passingScore: q.passingScore,
      questionsCount: q._count.questions,
      attemptsCount: q._count.attempts,
    }))

    return NextResponse.json({ quizzes: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}
