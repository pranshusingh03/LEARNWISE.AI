"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, SlidersHorizontal, BookOpen } from "lucide-react"
import { CourseCard } from "@/components/courses/course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { Course } from "@/lib/types"

function CoursesList() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const initialCategory = searchParams.get("category") || ""

  const [search, setSearch] = React.useState(initialSearch)
  const [category, setCategory] = React.useState(initialCategory)
  const [difficulty, setDifficulty] = React.useState("")
  const [sort, setSort] = React.useState("popular")
  const [courses, setCourses] = React.useState<Course[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const categories = [
    "All",
    "Programming",
    "Web Development",
    "Artificial Intelligence",
    "Data Science",
    "Cybersecurity",
  ]

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

  React.useEffect(() => {
    let isMounted = true
    async function fetchCourses() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (search.trim()) params.set("search", search.trim())
        if (category && category !== "All") params.set("category", category)
        if (difficulty && difficulty !== "All") params.set("difficulty", difficulty)
        if (sort) params.set("sort", sort)

        const res = await api.get<{ courses: Course[] }>(`/api/courses?${params.toString()}`)
        if (isMounted && res.courses) {
          setCourses(res.courses)
        }
      } catch (err) {
        console.error("Courses fetch error:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchCourses, 200)
    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [search, category, difficulty, sort])

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Curated Catalog
        </span>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Explore Courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find structured curriculums designed to help you prepare for technical interviews and engineering roles.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by course title, skill, or instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sort:
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-auto"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs text-muted-foreground font-semibold mr-1">Category:</span>
          {categories.map((cat) => {
            const isSelected = (category === "" && cat === "All") || category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? "" : cat)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Difficulty Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground font-semibold mr-1">Difficulty:</span>
          {difficulties.map((diff) => {
            const isSelected = (difficulty === "" && diff === "All") || difficulty === diff
            return (
              <button
                key={diff}
                onClick={() => setDifficulty(diff === "All" ? "" : diff)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                  isSelected
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {diff}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count & Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{courses.length}</strong> courses
          </span>
          {(search || category || difficulty) && (
            <button
              onClick={() => {
                setSearch("")
                setCategory("")
                setDifficulty("")
              }}
              className="text-primary hover:underline font-medium"
            >
              Reset filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl border border-border bg-card/60 animate-pulse"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-foreground">No courses found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any courses matching your filters. Try clearing your search or filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                setCategory("")
                setDifficulty("")
              }}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-sm">Loading course catalog...</div>}>
      <CoursesList />
    </React.Suspense>
  )
}
