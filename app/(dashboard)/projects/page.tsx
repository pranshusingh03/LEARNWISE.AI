"use client"

import * as React from "react"
import Link from "next/link"
import {
  FolderGit2,
  CheckCircle2,
  Laptop,
  Sparkles,
  Trophy,
  ArrowRight,
  ExternalLink,
  Layers,
  Code2,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ProjectWorkspace } from "@/components/courses/project-workspace"

interface CatalogProject {
  id: string
  title: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedHours: string
  completed: boolean
  description: string
  tags: string[]
}

const CATALOG_PROJECTS: CatalogProject[] = [
  {
    id: "in-memory-cache",
    title: "High-Throughput In-Memory Key-Value Store",
    category: "System Architecture & DSA",
    difficulty: "Advanced",
    estimatedHours: "4–6 Hours",
    completed: false,
    description: "Design a Redis-like memory cache with O(1) hash indexing, LRU eviction, TTL expiry, and REST API.",
    tags: ["TypeScript", "Data Structures", "REST", "Docker"],
  },
  {
    id: "collab-canvas",
    title: "Real-Time Collaborative Canvas Platform",
    category: "Frontend & WebSockets",
    difficulty: "Intermediate",
    estimatedHours: "6–8 Hours",
    completed: true,
    description: "Build an interactive vector whiteboard with multiplayer cursors, operational transformation, and undo/redo.",
    tags: ["React 19", "WebSockets", "HTML5 Canvas", "Tailwind"],
  },
  {
    id: "microservices-gateway",
    title: "E-Commerce Microservices & API Gateway",
    category: "Backend & Cloud",
    difficulty: "Advanced",
    estimatedHours: "8–10 Hours",
    completed: false,
    description: "Architect a resilient microservice mesh with JWT security, distributed tracing, and PostgreSQL persistence.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "JWT"],
  },
]

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = React.useState<CatalogProject>(CATALOG_PROJECTS[0])

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-background border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                Hands-on Portfolio Capstones
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Resume-Ready Real World Systems
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Project Workspaces & AI Code Review
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Step beyond theoretical exercises by shipping full end-to-end applications. Track implementation milestones, test with live sandboxes, and submit for automated AI code evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/courses">
              <Button variant="outline" size="sm" className="text-xs">
                Browse Courses
              </Button>
            </Link>
            <Link href="/practice">
              <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
                <Code2 className="h-3.5 w-3.5" />
                Practice Problems
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Project Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATALOG_PROJECTS.map((proj) => {
          const isSelected = selectedProject.id === proj.id
          return (
            <Card
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-primary shadow-md ring-2 ring-primary/20 bg-card"
                  : "border-border/80 hover:border-primary/50 bg-card/60"
              }`}
            >
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px]">
                    {proj.category}
                  </Badge>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {proj.estimatedHours}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-foreground line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Active Project Workspace */}
      <ProjectWorkspace
        lessonTitle={selectedProject.title}
        courseCategory={selectedProject.category}
        onComplete={() => {
          setSelectedProject((prev) => ({ ...prev, completed: true }))
        }}
      />
    </div>
  )
}
