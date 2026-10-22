"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  FileQuestion,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<any>(null)
  const [recentUsers, setRecentUsers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function loadStats() {
      try {
        const res = await api.get("/api/admin/stats")
        if (isMounted) {
          setStats(res.stats)
          setRecentUsers(res.recentUsers || [])
        }
      } catch (err) {
        console.error("Admin stats fetch error:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadStats()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-purple-600 text-white text-xs font-semibold gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrative Overview
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">
              Platform metrics & curriculum control
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor real-time platform enrollments, manage active courses, and inspect student milestones.
          </p>
        </div>

        <Link href="/admin/courses/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs font-bold shrink-0 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: "Total Registered Students",
            value: stats?.totalUsers || 2,
            tint: "text-blue-500 bg-blue-500/10",
          },
          {
            icon: BookOpen,
            label: "Curated Courses",
            value: stats?.totalCourses || 9,
            tint: "text-purple-600 bg-purple-500/10",
          },
          {
            icon: GraduationCap,
            label: "Total Enrollments",
            value: stats?.totalEnrollments || 3,
            tint: "text-emerald-500 bg-emerald-500/10",
          },
          {
            icon: FileQuestion,
            label: "Evaluated Quiz Submissions",
            value: stats?.totalQuizAttempts || 1,
            tint: "text-amber-500 bg-amber-500/10",
          },
        ].map((m, i) => {
          const Icon = m.icon
          return (
            <Card key={i} className="border border-border/80 shadow-xs">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${m.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 2 Columns: Quick Actions + Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Curriculum Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Link href="/admin/courses/new" className="block">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
                      <PlusCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Create Course</p>
                      <p className="text-[11px] text-muted-foreground">Draft a new module with video and syllabus</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/admin/courses" className="block">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Manage Courses</p>
                      <p className="text-[11px] text-muted-foreground">Publish, unpublish, edit or delete courses</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>

              <Link href="/quiz" className="block">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <FileQuestion className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Inspect Assessments</p>
                      <p className="text-[11px] text-muted-foreground">View questions and test grading accuracy</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Students Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                <span>Recent Registrations</span>
                <span className="text-xs text-muted-foreground font-normal">Active learner accounts</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-border/60">
                {recentUsers.length === 0 ? (
                  <p className="p-6 text-center text-xs text-muted-foreground">
                    No users recorded yet.
                  </p>
                ) : (
                  recentUsers.map((u) => (
                    <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{u.name}</span>
                          <Badge
                            variant={u.role === "ADMIN" ? "secondary" : "outline"}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {u.role}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{u.email}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-muted-foreground block">
                          Goal: {u.goal || "Software Engineering"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
