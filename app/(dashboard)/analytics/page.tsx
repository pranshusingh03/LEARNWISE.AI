"use client"

import * as React from "react"
import {
  TrendingUp,
  Flame,
  Clock,
  BookCheck,
  Brain,
  Target,
  Calendar,
  Sparkles,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { api } from "@/lib/api-client"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true
    async function loadAnalytics() {
      try {
        const res = await api.get("/api/analytics")
        if (isMounted) setAnalytics(res)
      } catch (err) {
        console.error("Failed to load analytics:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadAnalytics()
    return () => {
      isMounted = false
    }
  }, [])

  const insights = [
    { icon: Flame, text: "Your current learning streak is 12 consecutive days.", tint: "text-amber-500" },
    { icon: TrendingUp, text: "Diagnostic quiz accuracy improved by 15% this month.", tint: "text-emerald-500" },
    { icon: Clock, text: "You maintain highest focus during evening study hours (6 PM - 9 PM).", tint: "text-cyan-500" },
    { icon: Target, text: "You are 72% closer to internship interview readiness.", tint: "text-primary" },
  ]

  const calendarDays = analytics?.streakCalendar || Array.from({ length: 17 }, () => Array(7).fill(0))

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            Learning Telemetry
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Persistent database analytics
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Learning Progress & Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your consistency, daily study hours, quiz accuracy growth, and course completions over time.
        </p>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: "Current Streak", value: "12 Days", tint: "text-amber-500 bg-amber-500/10" },
          { icon: Clock, label: "Total Study Time", value: "8.5 Hours", tint: "text-cyan-500 bg-cyan-500/10" },
          { icon: BookCheck, label: "Courses Completed", value: "6 Finished", tint: "text-emerald-500 bg-emerald-500/10" },
          { icon: Brain, label: "Composite Skill Index", value: "78 / 100", tint: "text-primary bg-primary/10" },
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
                  <p className="text-lg font-bold text-foreground mt-0.5">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* GitHub-style Contribution Heatmap */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              17-Week Consistency Heatmap
            </CardTitle>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Less</span>
              <div className="h-2.5 w-2.5 rounded-xs bg-muted" />
              <div className="h-2.5 w-2.5 rounded-xs bg-primary/30" />
              <div className="h-2.5 w-2.5 rounded-xs bg-primary/60" />
              <div className="h-2.5 w-2.5 rounded-xs bg-primary" />
              <span>More</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 overflow-x-auto">
          <div className="inline-flex gap-1.5 min-w-[650px]">
            {calendarDays.map((week: number[], wIdx: number) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((level: number, dIdx: number) => {
                  const colors = [
                    "bg-muted",
                    "bg-primary/20",
                    "bg-primary/50",
                    "bg-primary/80",
                    "bg-primary",
                  ]
                  return (
                    <div
                      key={dIdx}
                      className={`h-3 w-3 rounded-xs ${colors[level] || "bg-muted"} transition-all hover:scale-125`}
                      title={`Week ${wIdx + 1}, Day ${dIdx + 1}: Level ${level}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2 Columns: Course Completion Distribution + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Course Progress Breakdown */}
        <div className="lg:col-span-7">
          <Card className="border border-border/80 shadow-xs h-full">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold text-foreground">
                Course Progress Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              {[
                { name: "Advanced Java Collections", progress: 70 },
                { name: "Data Structures & Algorithms in Java", progress: 45 },
                { name: "React Complete Guide", progress: 25 },
                { name: "SQL for Developers", progress: 100 },
              ].map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-primary">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Performance Insights */}
        <div className="lg:col-span-5">
          <Card className="border border-border/80 shadow-xs h-full">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Learning Observations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              {insights.map((ins, i) => {
                const Icon = ins.icon
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
                  >
                    <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${ins.tint}`} />
                    <p className="text-foreground leading-relaxed">{ins.text}</p>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
