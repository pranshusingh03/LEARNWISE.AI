"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, PlusCircle, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

export default function NewCoursePage() {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [instructor, setInstructor] = React.useState("")
  const [category, setCategory] = React.useState("Programming")
  const [difficulty, setDifficulty] = React.useState("Intermediate")
  const [duration, setDuration] = React.useState("20h")
  const [description, setDescription] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("DSA, Java, Algorithms")
  const [gradient, setGradient] = React.useState("from-indigo-500 to-violet-600")
  const [isLoading, setIsLoading] = React.useState(false)

  const gradientOptions = [
    { label: "Indigo to Violet", value: "from-indigo-500 to-violet-600" },
    { label: "Cyan to Blue", value: "from-cyan-500 to-blue-600" },
    { label: "Emerald to Green", value: "from-emerald-500 to-green-600" },
    { label: "Fuchsia to Pink", value: "from-fuchsia-500 to-pink-600" },
    { label: "Amber to Orange", value: "from-amber-500 to-orange-600" },
    { label: "Red to Rose", value: "from-red-500 to-rose-600" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      await api.post("/api/courses", {
        title,
        instructor,
        category,
        difficulty,
        duration,
        description,
        gradient,
        tags,
      })

      toast.success("Course created successfully!")
      router.push("/admin/courses")
    } catch (err: any) {
      toast.error(err.message || "Failed to create course.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-16 max-w-3xl">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      <Card className="border border-border/80 shadow-md">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-xl font-bold font-display">Create New Course</CardTitle>
          <CardDescription>
            Add a new curriculum track to the LearnWise platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Course Title</label>
              <Input
                placeholder="e.g. Master Distributed Systems with Go"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Instructor</label>
                <Input
                  placeholder="e.g. Dr. Meera Nair"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Estimated Duration</label>
                <Input
                  placeholder="e.g. 24h 30m"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Description & Overview</label>
              <textarea
                rows={3}
                placeholder="Write an engaging summary of what students will master..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tags (comma separated)
              </label>
              <Input
                placeholder="Java, Collections, Concurrency"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            {/* Gradient Thumbnail selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Card Gradient Theme
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {gradientOptions.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGradient(g.value)}
                    className={`h-12 rounded-xl bg-gradient-to-tr ${
                      g.value
                    } transition-all relative flex items-center justify-center ${
                      gradient === g.value ? "ring-2 ring-primary ring-offset-2 scale-105" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {gradient === g.value && (
                      <Check className="h-4 w-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
              <Link href="/admin/courses">
                <Button variant="outline" type="button" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="sm" isLoading={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Publish Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
