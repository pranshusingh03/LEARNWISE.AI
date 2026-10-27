"use client"

import * as React from "react"
import Link from "next/link"
import {
  Code2,
  CheckCircle2,
  Play,
  Sparkles,
  Trophy,
  Filter,
  Search,
  ArrowRight,
  Flame,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PracticeProblem } from "@/components/courses/practice-problem"

interface CatalogProblem {
  id: string
  title: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  solved: boolean
  acceptance: string
  lessonTitle: string
}

const CATALOG_PROBLEMS: CatalogProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum Target Pair",
    category: "Arrays & Hash Table",
    difficulty: "Easy",
    solved: true,
    acceptance: "94.2%",
    lessonTitle: "Array Fundamentals & Memory Layout",
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome with Two Pointers",
    category: "Two Pointers & Strings",
    difficulty: "Easy",
    solved: false,
    acceptance: "88.6%",
    lessonTitle: "Two-Pointer Technique & Sliding Window",
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Singly Linked List",
    category: "Linked Lists",
    difficulty: "Easy",
    solved: false,
    acceptance: "91.0%",
    lessonTitle: "Singly Linked Lists & Pointer Manipulation",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses Matching",
    category: "Stacks & Queues",
    difficulty: "Easy",
    solved: true,
    acceptance: "89.4%",
    lessonTitle: "LIFO vs FIFO Implementations",
  },
  {
    id: "binary-tree-inorder",
    title: "Binary Tree In-Order Traversal",
    category: "Trees",
    difficulty: "Medium",
    solved: false,
    acceptance: "78.2%",
    lessonTitle: "BST Traversals: Pre, In, and Post Order",
  },
  {
    id: "bfs-shortest-path",
    title: "Breadth-First Search Shortest Path",
    category: "Graphs",
    difficulty: "Medium",
    solved: false,
    acceptance: "68.5%",
    lessonTitle: "Breadth-First Search (BFS) and Dijkstra",
  },
]

export default function PracticePage() {
  const [selectedProblem, setSelectedProblem] = React.useState<CatalogProblem>(CATALOG_PROBLEMS[0])
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [solvedState, setSolvedState] = React.useState<Record<string, boolean>>({
    "two-sum": true,
    "valid-parentheses": true,
  })

  const categories = ["All", "Arrays & Hash Table", "Two Pointers & Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs"]

  const filteredProblems = CATALOG_PROBLEMS.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const solvedCount = Object.values(solvedState).filter(Boolean).length

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-background border border-primary/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                Interactive Coding Sandbox
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Placement Interview Problem Sets
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              Algorithmic Practice & Test Case Runner
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Solve curated technical interview problems in the browser. Run live test cases, inspect outputs, and submit solutions for automated verification.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xs shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Problems Solved
              </span>
              <div className="text-xl font-extrabold text-foreground font-display">
                {solvedCount} / {CATALOG_PROBLEMS.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Problem Directory Sidebar + Active Problem Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Problem Catalog List */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="p-4 border-b border-border space-y-3 bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Problem Directory</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {filteredProblems.length} available
                </span>
              </CardTitle>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs outline-none focus:border-primary"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-semibold">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-1 rounded-md whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5 max-h-[640px] overflow-y-auto">
              {filteredProblems.map((prob) => {
                const isSelected = selectedProblem.id === prob.id
                const isSolved = solvedState[prob.id]

                return (
                  <button
                    key={prob.id}
                    onClick={() => setSelectedProblem(prob)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold shadow-xs ring-1 ring-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      {isSolved ? (
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${
                            isSelected ? "text-primary-foreground" : "text-emerald-500"
                          }`}
                        />
                      ) : (
                        <Code2
                          className={`h-4 w-4 shrink-0 ${
                            isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        />
                      )}
                      <div className="truncate">
                        <div className="truncate">{prob.title}</div>
                        <div
                          className={`text-[10px] font-normal ${
                            isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {prob.category}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 font-medium ${
                        isSelected
                          ? "border-primary-foreground/30 text-primary-foreground"
                          : prob.difficulty === "Easy"
                          ? "text-emerald-600 border-emerald-500/20"
                          : "text-amber-600 border-amber-500/20"
                      }`}
                    >
                      {prob.difficulty}
                    </Badge>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Interactive Practice Sandbox */}
        <div className="lg:col-span-8 space-y-6">
          <PracticeProblem
            lessonTitle={selectedProblem.lessonTitle}
            courseCategory="Algorithms"
            onComplete={() => {
              setSolvedState((prev) => ({ ...prev, [selectedProblem.id]: true }))
            }}
          />
        </div>
      </div>
    </div>
  )
}
