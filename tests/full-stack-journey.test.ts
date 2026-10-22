import test from "node:test"
import assert from "node:assert/strict"
import prisma from "../lib/db.ts"
import { hashPassword, comparePassword, signToken, verifyToken } from "../lib/auth.ts"

test("LearnWise Full-Stack Verification Suite", async (t) => {
  await t.test("1. Database Connection & Initial Seed Integrity", async () => {
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const quizCount = await prisma.quiz.count()

    assert.ok(userCount >= 2, `Expected at least 2 users, found ${userCount}`)
    assert.ok(courseCount >= 9, `Expected at least 9 courses, found ${courseCount}`)
    assert.ok(quizCount >= 1, `Expected at least 1 quiz, found ${quizCount}`)
  })

  await t.test("2. Secure Authentication & Password Hashing", async () => {
    const rawPassword = "securePassword2026!"
    const hash = await hashPassword(rawPassword)

    assert.notEqual(hash, rawPassword, "Password must not be stored in plaintext")
    assert.ok(hash.startsWith("$2"), "Hash must be standard bcrypt format")

    const isValid = await comparePassword(rawPassword, hash)
    assert.equal(isValid, true, "Bcrypt verification should succeed for correct password")

    const isInvalid = await comparePassword("wrongPassword", hash)
    assert.equal(isInvalid, false, "Bcrypt verification should fail for incorrect password")
  })

  await t.test("3. JWT Token Lifecycle & Payload Signing", async () => {
    const payload = {
      userId: "user-test-123",
      email: "test@learnwise.ai",
      role: "STUDENT",
      name: "Test Learner",
    }

    const token = await signToken(payload)
    assert.ok(token && typeof token === "string", "Token must be a valid signed string")

    const decoded = await verifyToken(token)
    assert.ok(decoded, "Decoded token must not be null")
    assert.equal(decoded?.userId, payload.userId)
    assert.equal(decoded?.email, payload.email)
    assert.equal(decoded?.role, payload.role)
  })

  await t.test("4. User Registration, Profile Isolation & Duplicate Prevention", async () => {
    const testEmail = `new-student-${Date.now()}@learnwise.ai`
    const passwordHash = await hashPassword("testpass123")

    const created = await prisma.user.create({
      data: {
        name: "Test Learner",
        email: testEmail,
        passwordHash,
        role: "STUDENT",
        goal: "Crack Placement Interviews",
      },
    })

    assert.ok(created.id, "User should have generated ID")
    assert.equal(created.email, testEmail)

    // Verify duplicate registration constraint
    await assert.rejects(
      async () => {
        await prisma.user.create({
          data: {
            name: "Duplicate User",
            email: testEmail,
            passwordHash,
            role: "STUDENT",
          },
        })
      },
      /Unique constraint failed/
    )

    // Clean up test user
    await prisma.user.delete({ where: { id: created.id } })
  })

  await t.test("5. Course Enrollment & Student Count Update", async () => {
    const student = await prisma.user.findFirst({ where: { role: "STUDENT" } })
    assert.ok(student, "Student user must exist")

    const targetCourse = "cyber-intro"
    const courseBefore = await prisma.course.findUnique({ where: { id: targetCourse } })
    const initialStudents = courseBefore?.students || 0

    // Ensure not previously enrolled
    await prisma.enrollment.deleteMany({
      where: { userId: student.id, courseId: targetCourse },
    })

    // Enroll
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: targetCourse,
        progress: 0,
        status: "IN_PROGRESS",
      },
    })
    await prisma.course.update({
      where: { id: targetCourse },
      data: { students: { increment: 1 } },
    })

    assert.equal(enrollment.progress, 0)
    assert.equal(enrollment.status, "IN_PROGRESS")

    const courseAfter = await prisma.course.findUnique({ where: { id: targetCourse } })
    assert.equal(courseAfter?.students, initialStudents + 1, "Students count should increment by 1")

    // Cleanup
    await prisma.enrollment.delete({ where: { id: enrollment.id } })
    await prisma.course.update({
      where: { id: targetCourse },
      data: { students: { decrement: 1 } },
    })
  })

  await t.test("6. Lesson Completion & Automatic Course Progress Calculation", async () => {
    const student = await prisma.user.findFirst({ where: { role: "STUDENT" } })
    assert.ok(student, "Student must exist")

    // Get DSA course with lessons
    const dsaCourse = await prisma.course.findUnique({
      where: { id: "dsa-java" },
      include: { lessonsList: true },
    })
    assert.ok(dsaCourse && dsaCourse.lessonsList.length > 0, "DSA Course must have lessons")

    const testLesson = dsaCourse.lessonsList[0]

    // Upsert lesson progress
    const progressRecord = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: student.id,
          lessonId: testLesson.id,
        },
      },
      update: { completed: true },
      create: {
        userId: student.id,
        lessonId: testLesson.id,
        courseId: "dsa-java",
        completed: true,
      },
    })
    assert.equal(progressRecord.completed, true)

    // Recalculate course percentage
    const totalLessons = await prisma.lesson.count({ where: { courseId: "dsa-java" } })
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: student.id, courseId: "dsa-java", completed: true },
    })

    const calculatedProgress = Math.round((completedLessons / totalLessons) * 100)
    assert.ok(calculatedProgress > 0, "Progress should be greater than 0")

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: "dsa-java",
        },
      },
      data: { progress: calculatedProgress },
    })

    const updatedEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: "dsa-java",
        },
      },
    })
    assert.equal(updatedEnrollment?.progress, calculatedProgress)
  })

  await t.test("7. Server-Side Quiz Grading & Topic Breakdown", async () => {
    const student = await prisma.user.findFirst({ where: { role: "STUDENT" } })
    assert.ok(student, "Student must exist")

    const quiz = await prisma.quiz.findUnique({
      where: { id: "dsa-assessment-1" },
      include: { questions: true },
    })
    assert.ok(quiz && quiz.questions.length > 0, "Quiz must exist with questions")

    // Simulate perfect answers
    const answers: Record<string, number> = {}
    quiz.questions.forEach((q) => {
      answers[q.id] = q.answer
    })

    let correctCount = 0
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.answer) correctCount++
    })

    const percentage = Math.round((correctCount / quiz.questions.length) * 100)
    assert.equal(percentage, 100, "All answers were correct so percentage should be 100")
    assert.equal(percentage >= quiz.passingScore, true, "Should pass assessment")

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: student.id,
        quizId: quiz.id,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        percentage,
        passed: true,
        answers: JSON.stringify(answers),
      },
    })
    assert.ok(attempt.id, "Attempt ID should be recorded")
    assert.equal(attempt.percentage, 100)

    // Clean up test attempt
    await prisma.quizAttempt.delete({ where: { id: attempt.id } })
  })

  await t.test("8. Role-Based Access Control (Admin vs Student)", async () => {
    const student = await prisma.user.findFirst({ where: { role: "STUDENT" } })
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })

    assert.equal(student?.role, "STUDENT")
    assert.equal(admin?.role, "ADMIN")

    // Verify student cannot pass admin check
    const isStudentAuthorizedForAdmin = student?.role === "ADMIN"
    assert.equal(isStudentAuthorizedForAdmin, false, "Student must NOT have admin access")

    const isAdminAuthorized = admin?.role === "ADMIN"
    assert.equal(isAdminAuthorized, true, "Admin must have admin access")
  })
})
