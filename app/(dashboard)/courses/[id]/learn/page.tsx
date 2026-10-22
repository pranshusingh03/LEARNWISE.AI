"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import {
  CheckCircle2,
  Circle,
  Play,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  FileText,
  Share2,
  Trophy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { VideoPlayer } from "@/components/courses/video-player"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Course, LessonData, ModuleData } from "@/lib/types"

function LearnCourseContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = params.id as string
  const requestedLessonId = searchParams.get("lesson")

  const [course, setCourse] = React.useState<Course | null>(null)
  const [activeLesson, setActiveLesson] = React.useState<LessonData | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isTogglingComplete, setIsTogglingComplete] = React.useState(false)

  // Load course details
  const loadCourse = React.useCallback(async () => {
    try {
      const res = await api.get<{ course: Course }>(`/api/courses/${courseId}`)
      setCourse(res.course)

      // Find all lessons flattened
      const allLessons: LessonData[] = []
      res.course.modules?.forEach((m) => {
        m.lessons.forEach((l) => allLessons.push(l))
      })

      if (allLessons.length > 0) {
        if (requestedLessonId) {
          const matched = allLessons.find((l) => l.id === requestedLessonId)
          setActiveLesson(matched || allLessons[0])
        } else {
          // Default to first incomplete lesson, or first lesson
          const firstIncomplete = allLessons.find((l) => !l.completed)
          setActiveLesson(firstIncomplete || allLessons[0])
        }
      }
    } catch (err) {
      console.error("Failed to load course lessons:", err)
    } finally {
      setIsLoading(false)
    }
  }, [courseId, requestedLessonId])

  React.useEffect(() => {
    loadCourse()
  }, [loadCourse])

  const handleToggleComplete = async () => {
    if (!activeLesson) return

    setIsTogglingComplete(true)
    try {
      const res = await api.post<{
        success: boolean
        completed: boolean
        courseProgress: number
        isFullyCompleted: boolean
      }>(`/api/lessons/${activeLesson.id}/complete`)

      // Update active lesson state
      setActiveLesson((prev) => (prev ? { ...prev, completed: res.completed } : prev))

      // Update course progress state
      setCourse((prev) =>
        prev
          ? {
              ...prev,
              progress: res.courseProgress,
              modules: prev.modules?.map((m) => ({
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === activeLesson.id ? { ...l, completed: res.completed } : l
                ),
              })),
            }
          : prev
      )

      if (res.isFullyCompleted) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        toast.success("Course 100% Completed! Outstanding achievement! 🏆")
      } else if (res.completed) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } })
        toast.success("Lesson marked as complete! Keep going!")
      } else {
        toast.info("Lesson marked as incomplete.")
      }
    } catch {
      toast.error("Failed to update progress.")
    } finally {
      setIsTogglingComplete(false)
    }
  }

  // Flattened lessons list for next / prev
  const allLessons: LessonData[] = React.useMemo(() => {
    const list: LessonData[] = []
    course?.modules?.forEach((m) => {
      m.lessons.forEach((l) => list.push(l))
    })
    return list
  }, [course])

  const currentIndex = allLessons.findIndex((l) => l.id === activeLesson?.id)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-xl bg-card" />
        <div className="h-96 rounded-2xl bg-card" />
      </div>
    )
  }

  if (!course || !activeLesson) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">No lessons found</h2>
        <Link href={`/courses/${courseId}`}>
          <Button className="mt-4">Back to Course Details</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" />
              Course Syllabus
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div>
            <h1 className="text-base font-bold text-foreground truncate max-w-md">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground">{activeLesson.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-muted-foreground">Course Progress:</span>
            <span className="text-primary">{course.progress || 0}%</span>
          </div>
          <div className="w-24">
            <Progress value={course.progress || 0} />
          </div>
        </div>
      </div>

      {/* Main Learning Grid: Player + Syllabus Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lesson View Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Fully Functional Video Player */}
          <VideoPlayer
            videoUrl={activeLesson.videoUrl}
            title={activeLesson.title}
            duration={activeLesson.duration}
            courseCategory={course.category}
            onComplete={handleToggleComplete}
            onNextLesson={() => nextLesson && setActiveLesson(nextLesson)}
            hasNextLesson={!!nextLesson}
          />

          {/* Action Row */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center gap-2">
              <Button
                variant={activeLesson.completed ? "default" : "outline"}
                size="sm"
                onClick={handleToggleComplete}
                disabled={isTogglingComplete}
                className="gap-2 text-xs font-semibold"
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    activeLesson.completed ? "text-white" : "text-emerald-500"
                  }`}
                />
                {activeLesson.completed ? "Completed" : "Mark as Complete"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveLesson(prevLesson)}
                  className="gap-1.5 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
              )}
              {nextLesson && (
                <Button
                  size="sm"
                  onClick={() => setActiveLesson(nextLesson)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Lesson Content & Study Notes */}
          <Card className="border border-border/80 shadow-xs">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-base font-bold text-foreground">Lesson Overview & Study Notes</h3>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {activeLesson.content || (
                  <p>
                    Follow along with this lesson by reviewing the code implementation and taking notes in your study plan.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Lesson List */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Course Modules
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {allLessons.filter((l) => l.completed).length} of {allLessons.length} lessons finished
              </p>
            </div>

            <CardContent className="p-0 max-h-[600px] overflow-y-auto divide-y divide-border/40">
              {course.modules?.map((m) => (
                <div key={m.id} className="p-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-2">
                    {m.title}
                  </span>
                  <div className="space-y-1">
                    {m.lessons.map((lesson) => {
                      const isCurrent = lesson.id === activeLesson.id
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex items-center justify-between w-full p-2.5 rounded-lg text-left text-xs transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate mr-2">
                            {lesson.completed ? (
                              <CheckCircle2
                                className={`h-4 w-4 shrink-0 ${
                                  isCurrent ? "text-primary-foreground" : "text-emerald-500"
                                }`}
                              />
                            ) : (
                              <Circle
                                className={`h-4 w-4 shrink-0 ${
                                  isCurrent ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span
                            className={`text-[10px] shrink-0 ${
                              isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            {lesson.duration}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function LearnCoursePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading course interface...</div>}>
      <LearnCourseContent />
    </React.Suspense>
  )
}
