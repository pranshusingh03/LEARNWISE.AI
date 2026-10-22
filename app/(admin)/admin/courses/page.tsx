"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  PlusCircle,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Users,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { Course } from "@/lib/types"

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadCourses = React.useCallback(async () => {
    try {
      const res = await api.get<{ courses: Course[] }>("/api/courses")
      if (res.courses) setCourses(res.courses)
    } catch (err) {
      console.error("Failed to fetch admin courses:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const handleTogglePublish = async (course: Course) => {
    const nextPublished = !course.published
    try {
      await api.put(`/api/courses/${course.id}`, { published: nextPublished })
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, published: nextPublished } : c))
      )
      toast.success(
        nextPublished ? "Course published successfully." : "Course unpublished (draft mode)."
      )
    } catch {
      toast.error("Failed to toggle publish status.")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action is permanent.")) {
      return
    }

    try {
      await api.delete(`/api/courses/${courseId}`)
      setCourses((prev) => prev.filter((c) => c.id !== courseId))
      toast.success("Course deleted successfully.")
    } catch {
      toast.error("Failed to delete course.")
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-purple-600 text-white text-xs font-semibold gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              Course Catalog Management
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
            Manage Courses & Curriculum
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, update, publish, or remove learning tracks across the platform.
          </p>
        </div>

        <Link href="/admin/courses/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs font-bold shrink-0">
            <PlusCircle className="h-4 w-4" />
            Add New Course
          </Button>
        </Link>
      </div>

      {/* Courses Table Card */}
      <Card className="border border-border/80 shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b border-border bg-muted/20">
          <CardTitle className="text-base font-bold text-foreground">
            All Courses ({courses.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">No courses found.</p>
              <Link href="/admin/courses/new">
                <Button size="sm">Create First Course</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Learners</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold">
                        <Link
                          href={`/courses/${course.id}`}
                          className="hover:text-primary transition-colors block"
                        >
                          {course.title}
                        </Link>
                        <span className="text-[11px] text-muted-foreground block font-normal">
                          {course.instructor}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {course.category}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px]">{course.difficulty}</span>
                      </td>

                      <td className="py-3.5 px-4 font-medium">
                        {course.students.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-semibold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            course.published !== false
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {course.published !== false ? (
                            <>
                              <CheckCircle className="h-3 w-3" /> Published
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
