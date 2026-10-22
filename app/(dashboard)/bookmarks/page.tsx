"use client"

import * as React from "react"
import Link from "next/link"
import { Bookmark, BookOpen, ArrowRight } from "lucide-react"
import { CourseCard } from "@/components/courses/course-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { Course } from "@/lib/types"

export default function BookmarksPage() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadBookmarks = React.useCallback(async () => {
    try {
      const res = await api.get<{ courses: Course[] }>("/api/courses")
      if (res.courses) {
        setCourses(res.courses.filter((c) => c.isBookmarked))
      }
    } catch (err) {
      console.error("Failed to load bookmarks:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadBookmarks()
  }, [loadBookmarks])

  const handleBookmarkToggle = (courseId: string, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId))
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Bookmark className="h-3.5 w-3.5" />
            Saved Content
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Your personal reference list
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Bookmarked Courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quickly access your saved courses, revise tricky algorithms, and continue learning where you left off.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl bg-card border border-border" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-foreground">No saved courses yet</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any course card to save it here for quick access.
          </p>
          <Link href="/courses">
            <Button size="sm" className="mt-4 gap-1.5">
              Browse Courses
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
