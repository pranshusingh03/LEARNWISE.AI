"use client"

import * as React from "react"
import Link from "next/link"
import {
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Clock,
  Play,
  Trophy,
  Layers,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PathModule } from "@/lib/types"

export default function LearningPathPage() {
  const modules: PathModule[] = [
    {
      id: 1,
      title: "Java Fundamentals",
      status: "Completed",
      progress: 100,
      difficulty: "Beginner",
      duration: "8h",
      description: "Variables, control flow, methods, and the core building blocks of Java.",
      courseId: "dsa-java",
    },
    {
      id: 2,
      title: "Object-Oriented Programming",
      status: "Completed",
      progress: 100,
      difficulty: "Beginner",
      duration: "10h",
      description: "Classes, inheritance, polymorphism, and clean OOP design.",
      courseId: "dsa-java",
    },
    {
      id: 3,
      title: "Java Collections",
      status: "In Progress",
      progress: 70,
      difficulty: "Intermediate",
      duration: "12h",
      description: "Lists, Maps, Sets, and choosing the right data structure for production workloads.",
      courseId: "java-collections",
    },
    {
      id: 4,
      title: "Data Structures (Arrays, Stacks, Queues)",
      status: "Recommended Next",
      progress: 45,
      difficulty: "Intermediate",
      duration: "24h",
      description: "Arrays, linked lists, stacks, and queues from the ground up.",
      courseId: "dsa-java",
    },
    {
      id: 5,
      title: "Trees and Graphs",
      status: "Locked",
      progress: 0,
      difficulty: "Advanced",
      duration: "16h",
      description: "Traversals, BST, heaps, and essential graph algorithms (BFS, Dijkstra).",
      courseId: "dsa-java",
    },
    {
      id: 6,
      title: "Dynamic Programming",
      status: "Locked",
      progress: 0,
      difficulty: "Advanced",
      duration: "14h",
      description: "Memoization, tabulation, and classic DP interview patterns.",
      courseId: "dsa-java",
    },
    {
      id: 7,
      title: "Spring Boot Microservices",
      status: "Upcoming",
      progress: 0,
      difficulty: "Intermediate",
      duration: "18h",
      description: "Build robust REST APIs, JPA entity mapping, and JWT security.",
      courseId: "spring-boot",
    },
    {
      id: 8,
      title: "Full Stack Capstone Application",
      status: "Final Goal",
      progress: 0,
      difficulty: "Advanced",
      duration: "30h",
      description: "Ship a production-ready full stack portfolio application end-to-end.",
      courseId: "react-guide",
    },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Compass className="h-3.5 w-3.5" />
            Sequential Learning Path
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Placement Readiness Track
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Your Adaptive Learning Roadmap
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A milestone-driven curriculum mapped directly to top software engineering interview rubrics.
        </p>
      </div>

      {/* Top Banner Recommendation */}
      <Card className="border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-background shadow-xs">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Active Focus Module
              </span>
              <h2 className="text-xl font-bold text-foreground">
                Data Structures (Module 4)
              </h2>
              <p className="text-xs text-muted-foreground max-w-xl">
                45% finished. Completing this module unlocks advanced Graph Algorithms and brings you 72% closer to your internship goal.
              </p>
            </div>
            <Link href="/courses/dsa-java/learn">
              <Button className="gap-2 shrink-0">
                <Play className="h-4 w-4 fill-current" />
                Resume Module
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
        {modules.map((mod, index) => {
          const isCompleted = mod.status === "Completed"
          const isInProgress = mod.status === "In Progress"
          const isRecommended = mod.status === "Recommended Next"
          const isLocked = mod.status === "Locked" || mod.status === "Upcoming"
          const isFinal = mod.status === "Final Goal"

          return (
            <div key={mod.id} className="relative">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[27px] top-4.5 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isInProgress
                    ? "border-primary bg-primary text-primary-foreground animate-pulse"
                    : isRecommended
                    ? "border-purple-600 bg-purple-600 text-white"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : isLocked ? (
                  <Lock className="h-3 w-3" />
                ) : isFinal ? (
                  <Trophy className="h-3 w-3" />
                ) : (
                  <span className="text-[10px] font-bold">{index + 1}</span>
                )}
              </div>

              {/* Card */}
              <Card
                className={`transition-all ${
                  isRecommended
                    ? "border-primary/50 shadow-md ring-1 ring-primary/20"
                    : "border-border/80 shadow-xs"
                }`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            isCompleted
                              ? "success"
                              : isInProgress
                              ? "default"
                              : isRecommended
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] font-semibold uppercase"
                        >
                          {mod.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {mod.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {mod.duration}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      {(isCompleted || isInProgress || isRecommended) && (
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary">{mod.progress}%</span>
                          </div>
                          <Progress value={mod.progress} />
                        </div>
                      )}

                      <Link href={mod.courseId ? `/courses/${mod.courseId}/learn` : "/courses"}>
                        <Button
                          size="sm"
                          variant={isCompleted ? "outline" : isLocked ? "ghost" : "default"}
                          disabled={isLocked && !isCompleted}
                          className="gap-1.5 text-xs font-semibold"
                        >
                          {isCompleted ? (
                            "Review Lessons"
                          ) : isLocked ? (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              Locked
                            </>
                          ) : (
                            <>
                              Jump In
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
