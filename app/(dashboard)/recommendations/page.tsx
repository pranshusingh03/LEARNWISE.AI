"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles, Star, Clock, ArrowRight, CheckCircle2, Target, Brain } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Recommendation } from "@/lib/types"

export default function RecommendationsPage() {
  const topRec: Recommendation = {
    id: "dsa-java",
    title: "Data Structures & Algorithms in Java",
    instructor: "Dr. Meera Nair",
    duration: "24h 30m",
    difficulty: "Intermediate",
    rating: 4.9,
    match: 94,
    reason:
      "Your assessment indicates strong Java fundamentals, but improving your understanding of Trees and Graphs will significantly strengthen your interview preparation.",
    category: "Programming",
  }

  const recommendations: Recommendation[] = [
    {
      id: "java-collections",
      title: "Advanced Java Collections",
      instructor: "Rahul Verma",
      duration: "12h 10m",
      difficulty: "Intermediate",
      rating: 4.7,
      match: 91,
      reason: "Directly builds on your current Java Collections progress (70% complete).",
      category: "Programming",
    },
    {
      id: "spring-boot",
      title: "Spring Boot Fundamentals",
      instructor: "Rahul Verma",
      duration: "18h 20m",
      difficulty: "Intermediate",
      rating: 4.7,
      match: 88,
      reason: "Bridges your backend skill gap and prepares you for real-world internship projects.",
      category: "Web Development",
    },
    {
      id: "react-guide",
      title: "React Complete Guide",
      instructor: "Sophia Alvarez",
      duration: "31h 45m",
      difficulty: "Beginner",
      rating: 4.8,
      match: 82,
      reason: "Complements your Java skills to make you an attractive full-stack candidate.",
      category: "Web Development",
    },
    {
      id: "sql-dev",
      title: "SQL for Developers",
      instructor: "Nina Patel",
      duration: "9h 40m",
      difficulty: "Beginner",
      rating: 4.5,
      match: 79,
      reason: "High ROI skill for technical rounds — frequently tested alongside backend APIs.",
      category: "Data Science",
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Matched
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Based on your quiz results & internship goal
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          AI Course Recommendations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Courses algorithmically suggested to address your specific skill gaps and optimize study time.
        </p>
      </div>

      {/* Top Match Featured Card */}
      <Card className="border border-primary/30 bg-gradient-to-tr from-primary/10 via-card to-secondary/10 shadow-lg overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs font-bold">
                  {topRec.match}% Match • Highest Priority
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {topRec.difficulty}
                </Badge>
              </div>

              <h2 className="text-2xl font-extrabold text-foreground font-display">
                {topRec.title}
              </h2>

              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
                Why recommended: <span className="text-muted-foreground font-normal">{topRec.reason}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span>By {topRec.instructor}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {topRec.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {topRec.rating}
                </span>
              </div>
            </div>

            <Link href={`/courses/${topRec.id}`}>
              <Button size="lg" className="w-full lg:w-auto gap-2 text-sm font-bold shadow-md">
                Start Recommended Course
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Recommendations Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground font-display">
          Additional Tailored Tracks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="border border-border/80 hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                    {rec.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-bold text-primary">
                    {rec.match}% Match
                  </Badge>
                </div>

                <Link href={`/courses/${rec.id}`}>
                  <h4 className="text-base font-bold text-foreground hover:text-primary transition-colors">
                    {rec.title}
                  </h4>
                </Link>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Why it fits:</strong> {rec.reason}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <span>{rec.instructor}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {rec.duration}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" /> {rec.rating}
                  </span>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Link href={`/courses/${rec.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                    View Course Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
