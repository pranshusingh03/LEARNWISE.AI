"use client"

import * as React from "react"
import Link from "next/link"
import { Star, Clock, Users, Bookmark, ArrowRight, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Course } from "@/lib/types"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

interface CourseCardProps {
  course: Course
  onBookmarkToggle?: (courseId: string, isBookmarked: boolean) => void
}

export function CourseCard({ course, onBookmarkToggle }: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = React.useState(course.isBookmarked ?? false)
  const [isTogglingBookmark, setIsTogglingBookmark] = React.useState(false)

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsTogglingBookmark(true)
    try {
      const res = await api.post<{ bookmarked: boolean }>(`/api/courses/${course.id}/bookmark`)
      setIsBookmarked(res.bookmarked)
      onBookmarkToggle?.(course.id, res.bookmarked)
      toast.success(res.bookmarked ? "Course saved to bookmarks!" : "Course removed from bookmarks.")
    } catch {
      toast.error("Please sign in to bookmark courses.")
    } finally {
      setIsTogglingBookmark(false)
    }
  }

  const isEnrolled = course.isEnrolled || (course.progress !== undefined && course.progress > 0)

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border border-border/80 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      <div>
        {/* Course Banner Gradient */}
        <div
          className={`relative h-36 w-full bg-gradient-to-tr ${
            course.gradient || "from-indigo-500 to-violet-600"
          } p-4 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white backdrop-blur-md border-transparent text-[11px] font-semibold"
            >
              {course.category}
            </Badge>

            <button
              onClick={handleBookmark}
              disabled={isTogglingBookmark}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isBookmarked
                  ? "bg-white text-primary shadow-sm"
                  : "bg-black/20 text-white hover:bg-white/30"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark course"}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="flex items-center justify-between text-white text-xs font-medium">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 opacity-80" />
              {course.duration}
            </span>
            {course.match && (
              <span className="rounded-md bg-white/20 px-2 py-0.5 font-bold backdrop-blur-md">
                {course.match}% Match
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <Badge variant="outline" className="text-[10px] uppercase font-semibold">
              {course.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({course.students.toLocaleString()})</span>
            </div>
          </div>

          <Link href={`/courses/${course.id}`}>
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground mb-2">By {course.instructor}</p>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>

          {/* Progress bar if enrolled */}
          {isEnrolled && (
            <div className="space-y-1 mb-4 pt-1 border-t border-border/50">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground font-medium">Progress</span>
                <span className="font-semibold text-primary">{course.progress || 0}%</span>
              </div>
              <Progress value={course.progress || 0} />
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 pt-0">
        <Link href={isEnrolled ? `/courses/${course.id}/learn` : `/courses/${course.id}`}>
          <Button
            className="w-full gap-2 text-xs font-semibold"
            variant={isEnrolled ? "default" : "outline"}
          >
            {isEnrolled ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resume Learning
              </>
            ) : (
              <>
                View Curriculum
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
