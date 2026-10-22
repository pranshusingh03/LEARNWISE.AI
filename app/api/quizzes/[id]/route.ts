import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Strip answers so frontend cannot inspect correct options
    const safeQuestions = quiz.questions.map((q) => {
      let options: string[] = []
      try {
        options = JSON.parse(q.options)
      } catch {
        options = []
      }

      return {
        id: q.id,
        topic: q.topic,
        question: q.question,
        options,
      }
    })

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        topic: quiz.topic,
        passingScore: quiz.passingScore,
        questions: safeQuestions,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 })
  }
}
