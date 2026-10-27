"use client"

import * as React from "react"
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import confetti from "canvas-confetti"
import { toast } from "sonner"

interface LessonQuizProps {
  lessonTitle: string
  courseCategory?: string
  onComplete?: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

interface Question {
  id: number
  question: string
  options: string[]
  answer: number
  explanation: string
}

export function LessonQuiz({
  lessonTitle,
  courseCategory = "Programming",
  onComplete,
  onNextLesson,
  hasNextLesson = false,
}: LessonQuizProps) {
  // Generate questions appropriate for the current lesson
  const questions: Question[] = React.useMemo(() => {
    const lower = lessonTitle.toLowerCase()
    if (lower.includes("pointer") || lower.includes("sliding")) {
      return [
        {
          id: 1,
          question: "When is the two-pointer technique most effective on an array?",
          options: [
            "When the array is completely unordered with random access",
            "When the array is sorted, or when searching for pairs/subarrays from both ends",
            "Only when the array has fewer than 10 elements",
            "When using tree-based recursion",
          ],
          answer: 1,
          explanation: "Two pointers leverage sorting or boundary properties to eliminate candidate pairs in O(n) linear scans.",
        },
        {
          id: 2,
          question: "What is the primary advantage of the sliding window technique over a nested loop?",
          options: [
            "It reduces time complexity from O(n^2) to O(n) by reusing overlapping window results",
            "It saves stack memory by avoiding recursion",
            "It automatically sorts elements inside the window",
            "It guarantees constant O(1) time complexity regardless of array size",
          ],
          answer: 0,
          explanation: "Sliding window slides a boundary forward by adding new elements and dropping trailing elements in O(1) amortized time.",
        },
        {
          id: 3,
          question: "In the fast & slow pointer (Floyd's Cycle) technique, if slow advances 1 step, how many steps does fast take?",
          options: ["1 step", "2 steps", "Half a step", "Log(n) steps"],
          answer: 1,
          explanation: "Advancing fast by 2 steps and slow by 1 step guarantees they will meet if a cycle exists in the list.",
        },
      ]
    }

    if (lower.includes("list")) {
      return [
        {
          id: 1,
          question: "What is the time complexity to insert a new node at the head of a singly linked list?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
          answer: 0,
          explanation: "Inserting at the head requires simply pointing the new node's next pointer to the current head: O(1) constant time.",
        },
        {
          id: 2,
          question: "Why does an array generally achieve better cache performance than a linked list?",
          options: [
            "Arrays have smaller pointers",
            "Array elements are stored in contiguous memory addresses, maximizing CPU cache locality",
            "Linked lists require garbage collection during traversal",
            "Arrays do not consume heap memory",
          ],
          answer: 1,
          explanation: "Spatial locality allows CPU hardware prefetchers to load entire contiguous blocks of an array into cache lines.",
        },
        {
          id: 3,
          question: "To reverse a linked list iteratively, how many auxiliary pointer variables are typically required?",
          options: ["0 pointers", "3 pointers (prev, curr, next)", "One pointer for each node", "2 stacks"],
          answer: 1,
          explanation: "Standard iterative reversal maintains prev, curr, and a temporary next reference to re-wire links in O(1) space.",
        },
      ]
    }

    // Default general DSA questions
    return [
      {
        id: 1,
        question: "What is the time complexity of looking up an element by index in a standard array?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        answer: 0,
        explanation: "Because memory addresses are computed as BaseAddress + (index * elementSize), index access is immediate O(1).",
      },
      {
        id: 2,
        question: "Which data structure operates on a Last-In First-Out (LIFO) basis?",
        options: ["Queue", "Stack", "Binary Search Tree", "Min-Heap"],
        answer: 1,
        explanation: "Stacks strictly follow LIFO order: elements pushed last are the first to be popped.",
      },
      {
        id: 3,
        question: "What is the amortized cost of appending an element to an ArrayList when it occasionally resizes?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        answer: 0,
        explanation: "Although resizing takes O(n), it occurs geometrically infrequently, yielding amortized O(1) per append.",
      },
    ]
  }, [lessonTitle])

  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentIdx].id]: optionIdx,
    }))
  }

  const handleGrade = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("Please answer all questions before checking answers.")
      return
    }

    setIsSubmitted(true)
    let correct = 0
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) correct++
    })

    const pct = Math.round((correct / questions.length) * 100)
    if (pct >= 66) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })
      toast.success(`Great job! You passed the lesson check with ${pct}%! 🎉`)
      if (onComplete) onComplete()
    } else {
      toast.info(`You scored ${pct}%. Review explanations and retry!`)
    }
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setIsSubmitted(false)
    setCurrentIdx(0)
  }

  const currentQ = questions[currentIdx]
  const answeredCount = Object.keys(selectedAnswers).length
  const currentAnswer = selectedAnswers[currentQ?.id]

  let correctCount = 0
  if (isSubmitted) {
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) correctCount++
    })
  }
  const scorePercent = Math.round((correctCount / questions.length) * 100)

  return (
    <div className="space-y-6">
      {/* Quiz Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-semibold gap-1 bg-primary/10 text-primary border-primary/20">
              <FileQuestion className="h-3.5 w-3.5" />
              Lesson Knowledge Check
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              3 Quick Assessment Questions
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground font-display">
            Check Your Understanding: {lessonTitle}
          </h2>
        </div>

        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>•</span>
          <span className="text-primary">{answeredCount} answered</span>
        </div>
      </div>

      {/* Main Question Box */}
      <Card className="border border-border/80 shadow-md">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <Badge variant="outline" className="font-semibold text-[10px]">
              Question {currentIdx + 1}
            </Badge>
            {isSubmitted && (
              <span
                className={`font-bold ${
                  currentAnswer === currentQ.answer ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {currentAnswer === currentQ.answer ? "Correct ✓" : "Incorrect ✗"}
              </span>
            )}
          </div>
          <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
            {currentQ.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = currentAnswer === optIdx
            const isCorrectOption = currentQ.answer === optIdx

            let optionStyle = "border-border bg-card hover:bg-muted text-foreground"
            if (isSubmitted) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500"
              } else if (isSelected) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-300 ring-1 ring-red-500"
              }
            } else if (isSelected) {
              optionStyle = "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary"
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelect(optIdx)}
                className={`flex items-center justify-between w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${optionStyle}`}
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
                  <span>{opt}</span>
                </div>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
              </button>
            )
          })}

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-foreground space-y-1">
              <span className="font-bold text-primary uppercase text-[10px] tracking-wider block">
                Explanation:
              </span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="text-xs"
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {currentIdx < questions.length - 1 ? (
              <Button
                size="sm"
                onClick={() => setCurrentIdx((p) => p + 1)}
                className="text-xs font-semibold"
              >
                Next
              </Button>
            ) : isSubmitted ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                className="text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry Quiz
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGrade}
                className="text-xs font-bold gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Grade Answers
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Results Banner if Submitted */}
      {isSubmitted && (
        <Card className="border border-border/80 p-5 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">
                Score: {correctCount} of {questions.length} ({scorePercent}%)
              </h4>
              <p className="text-xs text-muted-foreground">
                {scorePercent >= 66
                  ? "Lesson knowledge check passed! Keep up the momentum."
                  : "Consider reviewing the reading notes or video before moving on."}
              </p>
            </div>
          </div>

          {hasNextLesson && onNextLesson && (
            <Button
              size="sm"
              onClick={onNextLesson}
              className="gap-1.5 text-xs font-bold shrink-0"
            >
              Continue to Next Lesson
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
