"use client"

import * as React from "react"
import Link from "next/link"
import confetti from "canvas-confetti"
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Flag,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { QuizQuestion, QuizAttemptResult, QuizReviewItem } from "@/lib/types"

export default function QuizPage() {
  const [quizzes, setQuizzes] = React.useState<any[]>([])
  const [selectedQuizId, setSelectedQuizId] = React.useState<string>("dsa-assessment-1")
  const [quizDetails, setQuizDetails] = React.useState<any>(null)
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<string, number>>({})
  const [flaggedQuestions, setFlaggedQuestions] = React.useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [quizResult, setQuizResult] = React.useState<QuizAttemptResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [reviewFilter, setReviewFilter] = React.useState<"all" | "correct" | "incorrect">("all")

  // Timer
  const [secondsElapsed, setSecondsElapsed] = React.useState(0)
  const [isTimerRunning, setIsTimerRunning] = React.useState(true)

  // Timer ticker
  React.useEffect(() => {
    let interval: any = null
    if (isTimerRunning && !quizResult) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, quizResult])

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Load quiz list
  React.useEffect(() => {
    let isMounted = true

    async function loadQuizzes() {
      setIsLoading(true)
      try {
        const listRes = await api.get<{ quizzes: any[] }>("/api/quizzes")
        if (isMounted && listRes.quizzes && listRes.quizzes.length > 0) {
          setQuizzes(listRes.quizzes)
          const initialId = listRes.quizzes[0].id
          setSelectedQuizId(initialId)
          await loadQuizDetails(initialId)
        }
      } catch (err) {
        console.error("Failed to load quiz list:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadQuizzes()
    return () => {
      isMounted = false
    }
  }, [])

  // Load individual quiz details
  const loadQuizDetails = async (id: string) => {
    try {
      setIsLoading(true)
      const qRes = await api.get<{ quiz: any }>(`/api/quizzes/${id}`)
      if (qRes.quiz) {
        setQuizDetails(qRes.quiz)
        setQuestions(qRes.quiz.questions || [])
        setCurrentQuestionIndex(0)
        setUserAnswers({})
        setFlaggedQuestions({})
        setQuizResult(null)
        setSecondsElapsed(0)
        setIsTimerRunning(true)
      }
    } catch (err) {
      console.error("Failed to load quiz questions:", err)
      toast.error("Failed to load questions for this assessment.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchQuiz = async (quizId: string) => {
    if (quizId === selectedQuizId) return
    setSelectedQuizId(quizId)
    await loadQuizDetails(quizId)
  }

  const handleSelectOption = (questionId: string | number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionIndex,
    }))
  }

  const handleToggleFlag = (questionId: string | number) => {
    const qKey = String(questionId)
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qKey]: !prev[qKey],
    }))
  }

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(userAnswers).length
    if (answeredCount === 0) {
      toast.error("Please answer at least one question before submitting.")
      return
    }

    if (answeredCount < questions.length) {
      const remaining = questions.length - answeredCount
      const confirmSubmit = window.confirm(
        `You have ${remaining} unanswered question${remaining > 1 ? "s" : ""}. Do you want to submit your assessment anyway?`
      )
      if (!confirmSubmit) return
    }

    setIsSubmitting(true)
    setIsTimerRunning(false)

    try {
      const res = await api.post<{ success: boolean; result: QuizAttemptResult }>(
        "/api/quizzes/submit",
        {
          quizId: selectedQuizId,
          answers: userAnswers,
        }
      )

      setQuizResult(res.result)

      if (res.result.passed) {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 },
        })
        toast.success(`Congratulations! You passed with ${res.result.percentage}%! 🏆`)
      } else {
        toast.info(`Assessment completed. Your score: ${res.result.percentage}%`)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to grade quiz.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetake = () => {
    setUserAnswers({})
    setFlaggedQuestions({})
    setQuizResult(null)
    setCurrentQuestionIndex(0)
    setSecondsElapsed(0)
    setIsTimerRunning(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 rounded-2xl bg-card" />
        <div className="h-96 rounded-2xl bg-card" />
      </div>
    )
  }

  const currentQ = questions[currentQuestionIndex]
  const answeredCount = Object.keys(userAnswers).length
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  // Filtered review items for results screen
  const filteredReview = quizResult?.review?.filter((item) => {
    if (reviewFilter === "correct") return item.isCorrect
    if (reviewFilter === "incorrect") return !item.isCorrect
    return true
  })

  return (
    <div className="space-y-8 pb-16">
      {/* Quiz Category & Assessment Switcher Strip */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs font-semibold gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive Diagnostics
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Passing Score: {quizDetails?.passingScore || 70}%
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
              {quizDetails?.title || "Technical Skill Assessment"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              {quizDetails?.description ||
                "Test your algorithmic intuition, core CS concepts, and technical interview readiness."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-xl border border-border text-xs font-mono shrink-0">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Time:</span>
            <span className="font-bold text-foreground">{formatTimer(secondsElapsed)}</span>
          </div>
        </div>

        {/* Quiz Selector Pills */}
        {quizzes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              Select Assessment:
            </span>
            {quizzes.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSwitchQuiz(q.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedQuizId === q.id
                    ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
              >
                {q.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View 1: Quiz Result Summary & In-Depth Review */}
      {quizResult ? (
        <Card className="border border-border/80 shadow-lg bg-card overflow-hidden">
          {/* Header Banner */}
          <div
            className={`p-6 sm:p-8 text-white text-center ${
              quizResult.passed
                ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                : "bg-gradient-to-r from-amber-600 to-orange-600"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md mb-3 shadow-inner">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              {quizResult.passed ? "Assessment Passed! 🎉" : "Assessment Completed"}
            </h2>
            <p className="text-sm text-white/90 mt-1">
              You scored {quizResult.score} out of {quizResult.totalQuestions} (
              <strong>{quizResult.percentage}%</strong>) in {formatTimer(secondsElapsed)}
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-8">
            {/* AI Diagnostic Feedback */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-1.5">
              <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Diagnostic Assessment
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {quizResult.feedback}
              </p>
            </div>

            {/* Topic Accuracy Breakdown */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 font-display">
                Topic-by-Topic Accuracy Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quizResult.topicScores.map((ts, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2"
                  >
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="truncate">{ts.topic}</span>
                      <span
                        className={
                          ts.score >= 70 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"
                        }
                      >
                        {ts.score}%
                      </span>
                    </div>
                    <Progress value={ts.score} />
                  </div>
                ))}
              </div>
            </div>

            {/* In-Depth Question-by-Question Review with Explanations */}
            {quizResult.review && quizResult.review.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground font-display">
                      Question Review & Detailed Explanations
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Inspect your chosen options versus correct answers with comprehensive rationales.
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs font-semibold">
                    {[
                      { id: "all", label: `All (${quizResult.review.length})` },
                      {
                        id: "correct",
                        label: `Correct (${quizResult.review.filter((r) => r.isCorrect).length})`,
                      },
                      {
                        id: "incorrect",
                        label: `Incorrect (${quizResult.review.filter((r) => !r.isCorrect).length})`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setReviewFilter(tab.id as any)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                          reviewFilter === tab.id
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredReview?.map((rev, qIdx) => (
                    <div
                      key={rev.questionId}
                      className={`p-5 rounded-2xl border transition-all ${
                        rev.isCorrect
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-semibold">
                              {rev.topic}
                            </Badge>
                            <span
                              className={`text-xs font-bold flex items-center gap-1 ${
                                rev.isCorrect ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {rev.isCorrect ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3.5 w-3.5" /> Incorrect
                                </>
                              )}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground leading-snug">
                            {rev.question}
                          </h4>
                        </div>
                      </div>

                      {/* Options breakdown */}
                      <div className="space-y-2 text-xs">
                        {rev.options.map((opt, optIdx) => {
                          const isUserPick = rev.selectedOption === optIdx
                          const isCorrectPick = rev.correctOption === optIdx

                          let optClass = "border-border bg-card text-foreground"
                          if (isCorrectPick) {
                            optClass = "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500"
                          } else if (isUserPick) {
                            optClass = "border-red-500 bg-red-500/15 text-red-800 dark:text-red-300 ring-1 ring-red-500"
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center justify-between p-3 rounded-xl border ${optClass}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-[11px] opacity-75">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <span>{opt}</span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {isCorrectPick && (
                                  <Badge className="bg-emerald-600 text-white text-[10px]">
                                    Correct Answer
                                  </Badge>
                                )}
                                {isUserPick && !isCorrectPick && (
                                  <Badge variant="destructive" className="text-[10px]">
                                    Your Choice
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation rationale */}
                      <div className="mt-3 p-3 rounded-xl border border-border bg-card/60 text-xs text-muted-foreground space-y-1">
                        <strong className="text-foreground font-semibold">Explanation:</strong>
                        <p className="leading-relaxed">{rev.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-border">
              <Button onClick={handleRetake} className="gap-2 text-xs font-semibold">
                <RotateCcw className="h-4 w-4" />
                Retake Assessment
              </Button>

              <div className="flex items-center gap-2">
                <Link href="/courses/dsa-java">
                  <Button variant="outline" className="gap-2 text-xs">
                    Strengthen Weak Topics in Course
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* View 2: Active Quiz Taking Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question View Box */}
          <div className="lg:col-span-8 space-y-6">
            {currentQ && (
              <Card className="border border-border/80 shadow-md">
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <Badge variant="outline" className="font-semibold text-[10px]">
                      Topic: {currentQ.topic}
                    </Badge>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleFlag(currentQ.id)}
                        className={`flex items-center gap-1 font-semibold text-xs transition-colors ${
                          flaggedQuestions[String(currentQ.id)]
                            ? "text-amber-500 font-bold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Flag this question to review later"
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span>{flaggedQuestions[String(currentQ.id)] ? "Flagged" : "Flag"}</span>
                      </button>

                      <span className="font-semibold">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>
                  </div>

                  <CardTitle className="text-lg font-bold text-foreground leading-relaxed">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-3">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[String(currentQ.id)] === optIdx
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`flex items-center justify-between w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary shadow-xs"
                            : "border-border bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="gap-1.5 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous
                  </Button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="gap-1.5 text-xs font-semibold"
                    >
                      Next Question
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting}
                      className="gap-1.5 text-xs font-bold shadow-md bg-primary"
                    >
                      {isSubmitting ? "Grading..." : "Submit Assessment"}
                      <Trophy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </div>

          {/* Right Column: Question Navigator */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Questions Navigator</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {answeredCount} / {questions.length} answered
                  </span>
                </CardTitle>
                <div className="pt-2">
                  <Progress value={progressPercent} />
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[String(q.id)] !== undefined
                    const isCurrent = idx === currentQuestionIndex
                    const isFlagged = flaggedQuestions[String(q.id)]

                    let btnStyle = "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    if (isCurrent) {
                      btnStyle = "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 font-extrabold"
                    } else if (isAnswered) {
                      btnStyle = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`relative h-9 rounded-xl text-xs font-bold transition-all ${btnStyle}`}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-emerald-500/30 border border-emerald-500/50" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-primary" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Flagged</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60">
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || answeredCount === 0}
                    className="w-full text-xs font-bold shadow-sm"
                  >
                    {isSubmitting ? "Grading..." : "Finish & Grade Assessment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
