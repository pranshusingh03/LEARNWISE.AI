"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Clock,
  Star,
  Users,
  CheckCircle2,
  Bookmark,
  Play,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  Lock,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "sonner"
import { Course } from "@/lib/types"

export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const courseId = params.id as string

  const [course, setCourse] = React.useState<Course | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEnrolling, setIsEnrolling] = React.useState(false)
  const [isBookmarked, setIsBookmarked] = React.useState(false)

  // Review form state
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState("")
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false)

  const loadCourse = React.useCallback(async () => {
    try {
      const res = await api.get<{ course: Course }>(`/api/courses/${courseId}`)
      setCourse(res.course)
      setIsBookmarked(res.course.isBookmarked ?? false)
    } catch (err) {
      console.error("Failed to load course details:", err)
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  React.useEffect(() => {
    loadCourse()
  }, [loadCourse])

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please sign in to enroll in this course.")
      router.push("/login")
      return
    }

    setIsEnrolling(true)
    try {
      await api.post(`/api/courses/${courseId}/enroll`)
      toast.success("Enrolled successfully! Let's start learning.")
      await loadCourse()
      router.push(`/courses/${courseId}/learn`)
    } catch (err: any) {
      toast.error(err.message || "Failed to enroll.")
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error("Please sign in to save bookmarks.")
      return
    }

    try {
      const res = await api.post<{ bookmarked: boolean }>(`/api/courses/${courseId}/bookmark`)
      setIsBookmarked(res.bookmarked)
      toast.success(res.bookmarked ? "Course bookmarked!" : "Bookmark removed.")
    } catch {
      toast.error("Failed to toggle bookmark.")
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmittingReview(true)
    try {
      await api.post(`/api/courses/${courseId}/reviews`, { rating, comment })
      toast.success("Thank you for your feedback!")
      setComment("")
      await loadCourse()
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-2xl bg-card" />
        <div className="h-64 rounded-2xl bg-card" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Course not found</h2>
        <Link href="/courses">
          <Button className="mt-4">Back to Courses</Button>
        </Link>
      </div>
    )
  }

  const isEnrolled = course.isEnrolled

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Course Header */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-tr ${
          course.gradient || "from-indigo-500 to-violet-600"
        } p-6 sm:p-10 text-white shadow-xl`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white backdrop-blur-md border-transparent text-xs">
                {course.category}
              </Badge>
              <Badge className="bg-black/20 text-white backdrop-blur-md border-transparent text-xs">
                {course.difficulty}
              </Badge>
              {course.match && (
                <Badge className="bg-white text-primary font-bold text-xs">
                  {course.match}% Match For You
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display leading-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-medium text-white/80">
              <span>Instructor: <strong className="text-white">{course.instructor}</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                {course.rating.toFixed(1)} rating
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.students.toLocaleString()} students
              </span>
            </div>
          </div>

          {/* Action Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col items-center gap-3 w-full md:w-72 shrink-0">
            {isEnrolled ? (
              <div className="w-full space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Your Progress</span>
                  <span>{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} className="bg-white/20" />
                <Link href={`/courses/${course.id}/learn`} className="block w-full">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    Resume Learning
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-white text-primary hover:bg-white/90 font-bold gap-2 text-sm h-11 shadow-lg"
              >
                {isEnrolling ? "Enrolling..." : "Enroll in Course"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmarkToggle}
              className="text-white hover:bg-white/20 w-full gap-2 text-xs"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-white" : ""}`} />
              {isBookmarked ? "Saved in Bookmarks" : "Save to Bookmarks"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Syllabus + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Modules & Lessons Syllabus */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Curriculum & Syllabus
            </h2>
            <span className="text-xs text-muted-foreground font-medium">
              {course.modules?.length || 0} Modules • {course.lessons || 6} Lessons
            </span>
          </div>

          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((mod, mIdx) => (
                <Card key={mod.id} className="border border-border/80 overflow-hidden">
                  <CardHeader className="bg-muted/30 py-3.5 px-5 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {mod.title}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {mod.duration}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/40">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Play className="h-4 w-4 text-primary shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {lesson.title}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={
                              isEnrolled
                                ? `/courses/${course.id}/learn?lesson=${lesson.id}`
                                : "#"
                            }
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!isEnrolled}
                              className="text-xs gap-1"
                            >
                              {isEnrolled ? (
                                <>
                                  Open
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3.5 w-3.5" />
                                  Enroll to unlock
                                </>
                              )}
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No syllabus modules created yet. Check back soon!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Reviews & Rating */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Student Reviews ({course.reviews?.length || 0})
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {/* Write Review Form */}
              {isEnrolled && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="rounded-xl bg-muted/40 p-3.5 border border-border/60 space-y-3"
                >
                  <span className="text-xs font-bold text-foreground block">
                    Write a Review
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground font-semibold ml-2">
                      {rating} Stars
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Share your thoughts on this course..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full rounded-lg border border-input bg-background p-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <Button
                    type="submit"
                    size="sm"
                    className="w-full text-xs"
                    isLoading={isSubmittingReview}
                  >
                    Submit Review
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {course.reviews && course.reviews.length > 0 ? (
                  course.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-border p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={r.userAvatar || "/student-avatar.png"}
                            alt={r.userName}
                            className="h-6 w-6"
                          />
                          <span className="font-semibold text-foreground">
                            {r.userName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Be the first student to review this course!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
