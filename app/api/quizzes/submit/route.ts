import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Please log in to submit quiz." }, { status: 401 })
    }

    const { quizId, answers } = await request.json()
    // answers is an object: { [questionId]: selectedOptionIndex }

    if (!quizId || !answers) {
      return NextResponse.json({ error: "Quiz ID and answers are required." }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 })
    }

    let correctCount = 0
    const totalQuestions = quiz.questions.length
    const topicStats: Record<string, { total: number; correct: number }> = {}

    quiz.questions.forEach((q) => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 }
      }
      topicStats[q.topic].total += 1

      const selected = answers[q.id]
      if (selected !== undefined && Number(selected) === q.answer) {
        correctCount += 1
        topicStats[q.topic].correct += 1
      }
    })

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const passed = percentage >= quiz.passingScore

    // Build topic accuracy score array
    const topicScores = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      score: Math.round((stats.correct / stats.total) * 100),
    }))

    // Generate AI feedback based on performance
    const weakTopics = topicScores.filter((t) => t.score < 70).map((t) => t.topic)
    const strongTopics = topicScores.filter((t) => t.score >= 70).map((t) => t.topic)

    let feedback = ""
    if (passed) {
      feedback = `Outstanding work! You demonstrated solid mastery in ${strongTopics.join(", ") || "the assessed topics"}.`
      if (weakTopics.length > 0) {
        feedback += ` To prepare for senior interview questions, focus next on revising: ${weakTopics.join(", ")}.`
      }
    } else {
      feedback = `Good effort. You scored ${percentage}%. Review ${weakTopics.join(", ")} in your learning path, then retake the assessment to solidify your understanding.`
    }

    // Persist attempt in database
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId,
        score: correctCount,
        totalQuestions,
        percentage,
        passed,
        answers: JSON.stringify(answers),
        topicScores: JSON.stringify(topicScores),
        feedback,
      },
    })

    // If passed, create notification
    if (passed) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `Quiz Passed: ${quiz.title} 🎉`,
          message: `You scored ${percentage}% on ${quiz.title}! Your skill index has been updated.`,
          type: "success",
        },
      })
    }

    return NextResponse.json({
      success: true,
      result: {
        attemptId: attempt.id,
        score: correctCount,
        totalQuestions,
        percentage,
        passed,
        passingScore: quiz.passingScore,
        topicScores,
        feedback,
      },
    })
  } catch (err: any) {
    console.error("Submit quiz error:", err)
    return NextResponse.json(
      { error: "Failed to grade and submit quiz." },
      { status: 500 }
    )
  }
}
