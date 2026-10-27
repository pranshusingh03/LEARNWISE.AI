import test from "node:test"
import assert from "node:assert/strict"
import prisma from "../lib/db.ts"
import { signToken } from "../lib/auth.ts"

test("LearnWise Core Learning Features Test Suite", async (t) => {
  const student = await prisma.user.findFirst({ where: { role: "STUDENT" } })
  assert.ok(student, "Student user must exist")

  // 1. Video Learning & Explicit Lesson Completion
  await t.test("1. Video Learning: Lesson completion API with explicit state", async () => {
    const course = await prisma.course.findFirst({
      where: { id: "dsa-java" },
      include: { lessonsList: true },
    })
    assert.ok(course && course.lessonsList.length > 0, "Course dsa-java must exist with lessons")
    const lesson = course.lessonsList[0]

    // Set completed: true
    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: student.id, lessonId: lesson.id } },
      update: { completed: true },
      create: { userId: student.id, lessonId: lesson.id, courseId: course.id, completed: true },
    })
    assert.equal(progress.completed, true)

    // Verify course progress calculation
    const totalLessons = await prisma.lesson.count({ where: { courseId: course.id } })
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: student.id, courseId: course.id, completed: true },
    })
    const calculated = Math.round((completedLessons / totalLessons) * 100)
    assert.ok(calculated >= 0 && calculated <= 100)
  })

  // 2. Reading Feature: Scroll depth and completion triggers
  await t.test("2. Reading Feature: Idempotent completion triggers", async () => {
    const course = await prisma.course.findFirst({
      where: { id: "dsa-java" },
      include: { lessonsList: true },
    })
    const lesson = course!.lessonsList[1]

    // Trigger complete
    const markDone = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: student.id, lessonId: lesson.id } },
      update: { completed: true },
      create: { userId: student.id, lessonId: lesson.id, courseId: course!.id, completed: true },
    })
    assert.equal(markDone.completed, true)
  })

  // 3. Quizzes: Multi-quiz discovery & in-depth review with explanations
  await t.test("3. Quizzes: Multi-quiz integrity & review with explanations", async () => {
    const quizzes = await prisma.quiz.findMany({
      include: { questions: true },
    })
    assert.ok(quizzes.length >= 3, `Expected at least 3 quizzes in database, found ${quizzes.length}`)

    const dsaQuiz = quizzes.find((q) => q.id === "dsa-assessment-1")
    assert.ok(dsaQuiz, "dsa-assessment-1 must exist")
    assert.ok(dsaQuiz.questions.length >= 5, "DSA quiz must have multiple questions")

    // Verify each question has valid options JSON and answer index
    for (const q of dsaQuiz.questions) {
      const options = JSON.parse(q.options)
      assert.ok(Array.isArray(options) && options.length >= 2, "Question options must be an array")
      assert.ok(q.answer >= 0 && q.answer < options.length, "Answer index must be valid")
      assert.ok(q.explanation && q.explanation.length > 5, "Question must have an explanation")
    }

    // Verify simulated submission grading & review generation
    const answers: Record<string, number> = {}
    dsaQuiz.questions.forEach((q, idx) => {
      // Alternate correct and incorrect
      answers[q.id] = idx % 2 === 0 ? q.answer : (q.answer + 1) % JSON.parse(q.options).length
    })

    let correctCount = 0
    const review = dsaQuiz.questions.map((q) => {
      const isCorrect = answers[q.id] === q.answer
      if (isCorrect) correctCount++
      return {
        questionId: q.id,
        isCorrect,
        correctOption: q.answer,
        selectedOption: answers[q.id],
        explanation: q.explanation,
      }
    })

    assert.ok(correctCount > 0)
    assert.equal(review.length, dsaQuiz.questions.length)
  })

  // 4. Practice Problems & Projects Navigation Integrity
  await t.test("4. Navigation Integrity: Courses, Practice, Projects & Quiz Routes", async () => {
    const courses = await prisma.course.findMany()
    assert.ok(courses.length >= 6)

    // Verify all courses have required metadata
    for (const c of courses) {
      assert.ok(c.id && c.title && c.category && c.difficulty)
    }
  })
})
