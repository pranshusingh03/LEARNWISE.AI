"use client"

import * as React from "react"
import Link from "next/link"
import {
  BarChart3,
  Dumbbell,
  Puzzle,
  Zap,
  Trees,
  Share2,
  Server,
  TrendingUp,
  ArrowRight,
  Brain,
  Sparkles,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function SkillAnalysisPage() {
  const radarCategories = [
    { category: "Programming", score: 85, target: 95 },
    { category: "Data Structures", score: 64, target: 90 },
    { category: "Web Development", score: 62, target: 80 },
    { category: "Databases & SQL", score: 58, target: 75 },
    { category: "Problem Solving", score: 74, target: 90 },
  ]

  const skillGroups = [
    {
      category: "Programming Languages",
      skills: [
        { name: "Java", value: 85 },
        { name: "Python", value: 60 },
        { name: "JavaScript / TypeScript", value: 55 },
      ],
    },
    {
      category: "Data Structures & Algorithms",
      skills: [
        { name: "Arrays & Strings", value: 90 },
        { name: "Linked Lists", value: 75 },
        { name: "Trees & BST", value: 50 },
        { name: "Graphs & Traversals", value: 40 },
      ],
    },
    {
      category: "Web & Backend Development",
      skills: [
        { name: "HTML / Tailwind CSS", value: 80 },
        { name: "React Components & State", value: 60 },
        { name: "Spring Boot / REST APIs", value: 45 },
      ],
    },
  ]

  const strengths = [
    { icon: Dumbbell, label: "Strong Java Fundamentals (85%)" },
    { icon: Puzzle, label: "Good Problem Solving Intuition (74%)" },
    { icon: Zap, label: "Mastery of Arrays & Two Pointers (90%)" },
  ]

  const areasToImprove = [
    { icon: Trees, label: "Binary Search Trees & Traversals (50%)" },
    { icon: Share2, label: "Graph BFS, DFS & Shortest Path (40%)" },
    { icon: Server, label: "Backend API & Security Architecture (45%)" },
  ]

  const growthMonths = [
    { month: "Jan", score: 42 },
    { month: "Feb", score: 48 },
    { month: "Mar", score: 55 },
    { month: "Apr", score: 61 },
    { month: "May", score: 68 },
    { month: "Jun", score: 72 },
    { month: "Jul", score: 78 },
  ]

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            Skill Intelligence
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Placement readiness index
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Skill Gap Analysis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed breakdown of your competencies, interview strengths, and high-impact areas to target next.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-border/80 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overall Skill Index
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-primary">78</span>
              <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Up from 42 in January. You are 78% of the way to qualifying for tier-1 engineering interviews.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <Badge variant="success" className="text-[11px] font-semibold">
              +15% Growth This Quarter
            </Badge>
          </div>
        </Card>

        {/* Strengths Card */}
        <Card className="border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Dumbbell className="h-4 w-4 text-emerald-600" />
            Top Strengths
          </h3>
          <div className="space-y-2.5">
            {strengths.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Icon className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{s.label}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Areas To Improve */}
        <Card className="border border-amber-500/20 bg-amber-500/5 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-amber-600" />
            High-Impact Growth Areas
          </h3>
          <div className="space-y-2.5">
            {areasToImprove.map((a, idx) => {
              const Icon = a.icon
              return (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <Icon className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{a.label}</span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Domain Proficiency Bars */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="pb-4 border-b border-border">
          <CardTitle className="text-base font-bold text-foreground">
            Domain Competency & Target Readiness
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {radarCategories.map((cat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">{cat.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">Target: {cat.target}%</span>
                  <span className="text-primary font-bold">{cat.score}%</span>
                </div>
              </div>
              <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deep-Dive Skill Groups */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground font-display">
          Granular Skill Proficiency
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((group, gIdx) => (
            <Card key={gIdx} className="border border-border/80 shadow-xs">
              <CardHeader className="bg-muted/30 py-3.5 px-5 border-b border-border/60">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {group.skills.map((s, sIdx) => (
                  <div key={sIdx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{s.name}</span>
                      <span className="font-semibold text-primary">{s.value}%</span>
                    </div>
                    <Progress value={s.value} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
