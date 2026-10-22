"use client"

import * as React from "react"
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
  History,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { QuizQuestion, QuizAttemptResult } from "@/lib/types"

export default function QuizPage() {
  const [quizzes, setQuizzes] = React.useState<any[]>([])
  const [selectedQuizId, setSelectedQuizId] = React.useState<string>("dsa-assessment-1")
  const [quizDetails, setQuizDetails] = React.useState<any>(null)
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [userAnswers, setUserAnswers] = React.useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [quizResult, setQuizResult] = React.useState<QuizAttemptResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Load quizzes and current quiz questions
  React.useEffect(() => {
    let isMounted = true

    async function loadQuizzes() {
      setIsLoading(true)
      try {
        const listRes = await api.get<{ quizzes: any[] }>("/api/quizzes")
        if (isMounted && listRes.quizzes) {
          setQuizzes(listRes.quizzes)
          const targetQuizId = listRes.quizzes[0]?.id || "dsa-assessment-1"
          setSelectedQuizId(targetQuizId)

          const qRes = await api.get<{ quiz: any }>(`/api/quizzes/${targetQuizId}`)
          if (isMounted && qRes.quiz) {
            setQuizDetails(qRes.quiz)
            setQuestions(qRes.quiz.questions)
          }
        }
      } catch (err) {
        console.error("Failed to load quiz data:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadQuizzes()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSelectOption = (questionId: string | number, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionIndex,
    }))
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length === 0) {
      toast.error("Please answer at least one question before submitting.")
      return
    }

    setIsSubmitting(true)
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
          spread: 70,
          origin: { y: 0.6 },
        })
        toast.success(`Congratulations! You passed with ${res.result.percentage}%!`)
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
    setQuizResult(null)
    setCurrentQuestionIndex(0)
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 rounded-2xl bg-card" />
        <div className="h-80 rounded-2xl bg-card" />
      </div>
    )
  }

  const currentQ = questions[currentQuestionIndex]
  const answeredCount = Object.keys(userAnswers).length
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Diagnostic Grading
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Passing threshold: {quizDetails?.passingScore || 70}%
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          {quizDetails?.title || "Data Structures Assessment"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer the questions below to evaluate your conceptual foundation and receive personalized curriculum recommendations.
        </p>
      </div>

      {/* Result Display Modal / View */}
      {quizResult ? (
        <Card className="border border-border/80 shadow-lg bg-card overflow-hidden">
          <div
            className={`p-6 text-white text-center ${
              quizResult.passed
                ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                : "bg-gradient-to-r from-amber-600 to-orange-600"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md mb-3">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold font-display">
              {quizResult.passed ? "Assessment Passed! 🎉" : "Assessment Completed"}
            </h2>
            <p className="text-sm text-white/90 mt-1">
              You scored {quizResult.score} out of {quizResult.totalQuestions} (
              <strong>{quizResult.percentage}%</strong>)
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* AI Feedback */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                AI Diagnostic Feedback
              </span>
              <p className="text-sm text-foreground leading-relaxed">
                {quizResult.feedback}
              </p>
            </div>

            {/* Topic Accuracy Breakdown */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">
                Topic-by-Topic Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quizResult.topicScores.map((ts, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2"
                  >
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{ts.topic}</span>
                      <span
                        className={
                          ts.score >= 70 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"
                        }
                      >
                        {ts.score}% Accuracy
                      </span>
                    </div>
                    <Progress value={ts.score} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
              <Button onClick={handleRetake} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Retake Assessment
              </Button>
              <Link href="/courses/dsa-java">
                <Button variant="outline" className="gap-2">
                  Review Weak Areas in Course
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Active Quiz Question Box */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {currentQ && (
              <Card className="border border-border/80 shadow-md">
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <Badge variant="outline" className="font-semibold text-[10px]">
                      Topic: {currentQ.topic}
                    </Badge>
                    <span className="font-semibold">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
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
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`flex items-center justify-between w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
                            : "border-border bg-card hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
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
                      isLoading={isSubmitting}
                      className="gap-1.5 text-xs font-bold shadow-md"
                    >
                      Submit Assessment
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

              <CardContent className="pt-4">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isAnswered = userAnswers[String(q.id)] !== undefined
                    const isCurrent = idx === currentQuestionIndex
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                            : isAnswered
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-border/60">
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting || answeredCount === 0}
                    className="w-full text-xs font-bold"
                  >
                    Finish & Grade Quiz
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
