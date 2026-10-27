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
  Code2,
  FileText,
  Share2,
  Trophy,
  Laptop,
  HelpCircle,
  Search,
  Filter,
  Check,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { VideoPlayer } from "@/components/courses/video-player"
import { ReadingModule } from "@/components/courses/reading-module"
import { PracticeProblem } from "@/components/courses/practice-problem"
import { ProjectWorkspace } from "@/components/courses/project-workspace"
import { LessonQuiz } from "@/components/courses/lesson-quiz"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Course, LessonData, ModuleData } from "@/lib/types"

type LearningMode = "video" | "reading" | "practice" | "projects" | "quiz"

function LearnCourseContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = params.id as string

  const requestedLessonId = searchParams.get("lesson")
  const requestedMode = (searchParams.get("mode") as LearningMode) || "video"

  const [course, setCourse] = React.useState<Course | null>(null)
  const [activeLesson, setActiveLesson] = React.useState<LessonData | null>(null)
  const [activeMode, setActiveMode] = React.useState<LearningMode>(requestedMode)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isTogglingComplete, setIsTogglingComplete] = React.useState(false)

  // Sidebar search & filter state
  const [syllabusSearch, setSyllabusSearch] = React.useState("")
  const [syllabusFilter, setSyllabusFilter] = React.useState<"all" | "completed" | "remaining">("all")

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

  // Sync active lesson and mode to URL
  const updateUrl = React.useCallback(
    (lessonId: string, mode: LearningMode) => {
      const url = `/courses/${courseId}/learn?lesson=${lessonId}&mode=${mode}`
      window.history.replaceState(null, "", url)
    },
    [courseId]
  )

  const handleSelectLesson = (lesson: LessonData) => {
    setActiveLesson(lesson)
    updateUrl(lesson.id, activeMode)
  }

  const handleSelectMode = (mode: LearningMode) => {
    setActiveMode(mode)
    if (activeLesson) {
      updateUrl(activeLesson.id, mode)
    }
  }

  const handleToggleComplete = async (explicitState?: boolean) => {
    if (!activeLesson) return

    setIsTogglingComplete(true)
    try {
      const payload = typeof explicitState === "boolean" ? { completed: explicitState } : {}
      const res = await api.post<{
        success: boolean
        completed: boolean
        courseProgress: number
        isFullyCompleted: boolean
      }>(`/api/lessons/${activeLesson.id}/complete`, payload)

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
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
        toast.success("Course 100% Completed! Outstanding achievement! 🏆")
      } else if (res.completed) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
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
        <div className="h-12 rounded-xl bg-card" />
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

  // Filtered sidebar modules
  const filteredModules = course.modules?.map((m) => {
    const matchedLessons = m.lessons.filter((l) => {
      const matchesSearch = l.title.toLowerCase().includes(syllabusSearch.toLowerCase())
      if (syllabusFilter === "completed") return matchesSearch && l.completed
      if (syllabusFilter === "remaining") return matchesSearch && !l.completed
      return matchesSearch
    })
    return { ...m, lessons: matchedLessons }
  })

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Course Progress Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link href={`/courses/${course.id}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="h-4 w-4" />
              Syllabus Overview
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="truncate">
            <h1 className="text-base font-bold text-foreground truncate max-w-md font-display">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground truncate">{activeLesson.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-muted-foreground">Course Progress:</span>
            <span className="text-primary font-bold">{course.progress || 0}%</span>
          </div>
          <div className="w-24 sm:w-32">
            <Progress value={course.progress || 0} />
          </div>
        </div>
      </div>

      {/* 5 Learning Modalities Selector Bar */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-muted/60 rounded-2xl border border-border overflow-x-auto text-xs font-semibold">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: "video", label: "Video Lesson", icon: Play },
            { id: "reading", label: "Reading Module", icon: BookOpen },
            { id: "practice", label: "Practice Problem", icon: Code2 },
            { id: "projects", label: "Hands-on Project", icon: Laptop },
            { id: "quiz", label: "Knowledge Check", icon: HelpCircle },
          ].map((mode) => {
            const Icon = mode.icon
            const isActive = activeMode === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleSelectMode(mode.id as LearningMode)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground font-bold shadow-xs ring-1 ring-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{mode.label}</span>
              </button>
            )
          })}
        </div>

        {/* Lesson Complete Button on Top Bar */}
        <Button
          variant={activeLesson.completed ? "default" : "outline"}
          size="sm"
          onClick={() => handleToggleComplete()}
          disabled={isTogglingComplete}
          className="h-8 gap-1.5 text-xs font-bold shrink-0 hidden sm:inline-flex"
        >
          <CheckCircle2
            className={`h-3.5 w-3.5 ${
              activeLesson.completed ? "text-primary-foreground" : "text-emerald-500"
            }`}
          />
          {activeLesson.completed ? "Lesson Completed" : "Mark Complete"}
        </Button>
      </div>

      {/* Main Learning Grid: Active Modality + Syllabus Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Lesson Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Modality 1: Video Learning */}
          {activeMode === "video" && (
            <VideoPlayer
              videoUrl={activeLesson.videoUrl}
              title={activeLesson.title}
              duration={activeLesson.duration}
              courseCategory={course.category}
              onComplete={() => handleToggleComplete(true)}
              onNextLesson={() => nextLesson && handleSelectLesson(nextLesson)}
              hasNextLesson={!!nextLesson}
              nextLessonTitle={nextLesson?.title}
            />
          )}

          {/* Modality 2: Reading Feature */}
          {activeMode === "reading" && (
            <ReadingModule
              title={activeLesson.title}
              content={activeLesson.content}
              duration={activeLesson.duration}
              courseCategory={course.category}
              isCompleted={activeLesson.completed}
              onToggleComplete={() => handleToggleComplete(true)}
              onNextLesson={() => nextLesson && handleSelectLesson(nextLesson)}
              hasNextLesson={!!nextLesson}
            />
          )}

          {/* Modality 3: Practice Problems */}
          {activeMode === "practice" && (
            <PracticeProblem
              lessonTitle={activeLesson.title}
              courseCategory={course.category}
              onComplete={() => handleToggleComplete(true)}
              onNextLesson={() => nextLesson && handleSelectLesson(nextLesson)}
              hasNextLesson={!!nextLesson}
            />
          )}

          {/* Modality 4: Hands-on Projects */}
          {activeMode === "projects" && (
            <ProjectWorkspace
              lessonTitle={activeLesson.title}
              courseCategory={course.category}
              onComplete={() => handleToggleComplete(true)}
              onNextLesson={() => nextLesson && handleSelectLesson(nextLesson)}
              hasNextLesson={!!nextLesson}
            />
          )}

          {/* Modality 5: Lesson Knowledge Quiz */}
          {activeMode === "quiz" && (
            <LessonQuiz
              lessonTitle={activeLesson.title}
              courseCategory={course.category}
              onComplete={() => handleToggleComplete(true)}
              onNextLesson={() => nextLesson && handleSelectLesson(nextLesson)}
              hasNextLesson={!!nextLesson}
            />
          )}

          {/* Action Row: Prev, Next, and Mark Complete */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-xs">
            <Button
              variant={activeLesson.completed ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleComplete()}
              disabled={isTogglingComplete}
              className="gap-2 text-xs font-semibold"
            >
              <CheckCircle2
                className={`h-4 w-4 ${
                  activeLesson.completed ? "text-primary-foreground" : "text-emerald-500"
                }`}
              />
              {activeLesson.completed ? "Completed ✓" : "Mark as Complete"}
            </Button>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectLesson(prevLesson)}
                  className="gap-1.5 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
              )}
              {nextLesson && (
                <Button
                  size="sm"
                  onClick={() => handleSelectLesson(nextLesson)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  Next Lesson
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Lesson Overview & Study Notes (when in video mode) */}
          {activeMode === "video" && (
            <Card className="border border-border/80 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-bold text-foreground">
                      Lesson Overview & Study Notes
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectMode("reading")}
                    className="text-xs text-primary gap-1"
                  >
                    Open in Full Reader
                    <ArrowRight className="h-3 w-3" />
                  </Button>
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
          )}
        </div>

        {/* Right Sidebar: Module Syllabus & Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <div className="p-4 border-b border-border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Course Syllabus
                </h3>
                <span className="text-xs text-muted-foreground font-semibold">
                  {allLessons.filter((l) => l.completed).length} / {allLessons.length} done
                </span>
              </div>

              {/* Search lessons input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter syllabus..."
                  value={syllabusSearch}
                  onChange={(e) => setSyllabusSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                />
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {(["all", "completed", "remaining"] as const).map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setSyllabusFilter(flt)}
                    className={`px-2 py-0.5 rounded capitalize transition-all ${
                      syllabusFilter === flt
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            <CardContent className="p-0 max-h-[580px] overflow-y-auto divide-y divide-border/40">
              {filteredModules?.map((m) => (
                <div key={m.id} className="p-3">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{m.duration}</span>
                  </div>

                  <div className="space-y-1">
                    {m.lessons.map((lesson) => {
                      const isCurrent = lesson.id === activeLesson.id
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => handleSelectLesson(lesson)}
                          className={`flex items-center justify-between w-full p-2.5 rounded-xl text-left text-xs transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary"
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
