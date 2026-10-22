"use client"

import * as React from "react"
import Link from "next/link"
import {
  Flame,
  Clock,
  BookCheck,
  Brain,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
  Play,
  Calendar,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/context/auth-context"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { Course, StudyTask } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = React.useState<any[]>([
    { icon: Flame, label: "Learning Streak", value: "12", unit: "Days", tint: "text-amber-500 bg-amber-500/10" },
    { icon: Clock, label: "Learning Time", value: "8.5", unit: "Hours", tint: "text-cyan-500 bg-cyan-500/10" },
    { icon: BookCheck, label: "Courses Completed", value: "6", unit: "", tint: "text-emerald-500 bg-emerald-500/10" },
    { icon: Brain, label: "Skill Score", value: "78", unit: "/100", tint: "text-primary bg-primary/10" },
  ])

  const [enrolledCourses, setEnrolledCourses] = React.useState<Course[]>([])
  const [tasks, setTasks] = React.useState<StudyTask[]>([])
  const [weeklyActivity, setWeeklyActivity] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        const [analyticsRes, coursesRes, tasksRes] = await Promise.all([
          api.get("/api/analytics"),
          api.get<{ courses: Course[] }>("/api/courses"),
          api.get<{ tasks: StudyTask[] }>("/api/study-plan"),
        ])

        if (isMounted) {
          if (analyticsRes.stats) {
            const icons = [Flame, Clock, BookCheck, Brain]
            const mapped = analyticsRes.stats.map((s: any, idx: number) => ({
              ...s,
              icon: icons[idx] || Brain,
              tint:
                idx === 0
                  ? "text-amber-500 bg-amber-500/10"
                  : idx === 1
                  ? "text-cyan-500 bg-cyan-500/10"
                  : idx === 2
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-primary bg-primary/10",
            }))
            setStats(mapped)
          }

          if (analyticsRes.weeklyActivity) {
            setWeeklyActivity(analyticsRes.weeklyActivity)
          }

          if (coursesRes.courses) {
            setEnrolledCourses(coursesRes.courses.filter((c) => c.isEnrolled))
          }

          if (tasksRes.tasks) {
            setTasks(tasksRes.tasks.slice(0, 3))
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadDashboardData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleTask = async (taskId: string, currentDone: boolean) => {
    try {
      const nextDone = !currentDone
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, done: nextDone } : t))
      )
      await api.patch("/api/study-plan", { id: taskId, done: nextDone })
      toast.success(nextDone ? "Task completed! 🎉" : "Task marked as pending.")
    } catch {
      toast.error("Failed to update task status.")
    }
  }

  const topCourse = enrolledCourses[0]

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-background p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="text-xs font-semibold gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Adaptive Learning Active
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Goal: {user?.goal || "Software Engineering Internship"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight font-display">
              Welcome back, {user?.name || "Arpita"}! 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              You are on a 12-day streak. Complete today&apos;s tasks to stay in the top 5% of active engineering candidates!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/quiz">
              <Button variant="default" size="sm" className="gap-2 shadow-xs">
                <Brain className="h-4 w-4" />
                Take Quick Quiz
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="sm">
                Explore More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border border-border/80 shadow-xs">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                      {stat.unit}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid: Continue Learning + Today Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Continue Learning */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground font-display">
              Continue Learning
            </h2>
            <Link
              href="/courses"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              All Courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t enrolled in any courses yet.
                </p>
                <Link href="/courses">
                  <Button size="sm">Browse Course Catalog</Button>
                </Link>
              </Card>
            ) : (
              enrolledCourses.map((c) => (
                <Card
                  key={c.id}
                  className="overflow-hidden border border-border/80 transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${c.gradient} flex items-center justify-center text-white font-bold shrink-0 shadow-xs`}
                        >
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-[10px] uppercase mb-1">
                            {c.category}
                          </Badge>
                          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                            <Link href={`/courses/${c.id}`}>{c.title}</Link>
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {c.instructor} • {c.difficulty}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {c.progress || 0}% Complete
                        </span>
                        <Link href={`/courses/${c.id}/learn`}>
                          <Button size="sm" className="gap-1.5 h-8">
                            Resume
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      <Progress value={c.progress || 0} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Weekly Learning Activity */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Weekly Learning Time
                </CardTitle>
                <span className="text-xs text-muted-foreground font-medium">Last 7 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 pt-4 items-end h-36">
                {(weeklyActivity.length > 0
                  ? weeklyActivity
                  : [
                      { day: "Mon", hours: 1.5 },
                      { day: "Tue", hours: 2.2 },
                      { day: "Wed", hours: 0.8 },
                      { day: "Thu", hours: 2.6 },
                      { day: "Fri", hours: 1.9 },
                      { day: "Sat", hours: 3.4 },
                      { day: "Sun", hours: 2.1 },
                    ]
                ).map((d, index) => {
                  const maxHours = 4
                  const heightPercent = Math.min(100, Math.round((d.hours / maxHours) * 100))
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {d.hours}h
                      </span>
                      <div className="w-full max-w-[28px] rounded-t-lg bg-primary/20 hover:bg-primary transition-colors relative flex flex-col justify-end h-24">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-primary to-purple-500 transition-all duration-500"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{d.day}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Today's Tasks & AI Recommendation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Today's Tasks Card */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Today&apos;s Study Plan
                </CardTitle>
                <Link
                  href="/study-plan"
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {tasks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No tasks scheduled for today.
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.done)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      task.done
                        ? "bg-muted/40 border-transparent text-muted-foreground"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <button
                      className="mt-0.5 shrink-0 focus:outline-none"
                      aria-label={task.done ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-xs font-semibold ${
                          task.done ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {task.duration}
                      </span>
                    </div>
                  </div>
                ))
              )}

              <Link href="/study-plan" className="block pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  + Add or edit study tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Recommendation Highlight */}
          <Card className="border border-purple-500/30 bg-gradient-to-br from-purple-500/5 via-card to-background shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Recommended Next
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  94% Match
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-foreground mt-1">
                Data Structures & Algorithms in Java
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your diagnostic assessment indicates strong Java fundamentals, but improving Trees & Graphs will strengthen interview rounds.
              </p>
              <div className="pt-2">
                <Link href="/courses/dsa-java">
                  <Button className="w-full gap-2 text-xs font-semibold" size="sm">
                    Start Recommended Module
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
