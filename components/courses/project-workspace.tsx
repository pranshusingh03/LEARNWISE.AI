"use client"

import * as React from "react"
import {
  FolderGit2,
  FileText,
  CheckCircle2,
  Circle,
  ExternalLink,
  Download,
  Copy,
  Check,
  Sparkles,
  Trophy,
  Terminal,
  Play,
  ArrowRight,
  Code2,
  Layers,
  Laptop,
  GitBranch,
  Globe,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import confetti from "canvas-confetti"
import { toast } from "sonner"

interface ProjectWorkspaceProps {
  lessonTitle?: string
  courseCategory?: string
  onComplete?: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

interface Milestone {
  id: number
  title: string
  description: string
  codeSnippet?: string
  command?: string
  completed: boolean
}

export function ProjectWorkspace({
  lessonTitle = "Capstone Project",
  courseCategory = "Computer Science",
  onComplete,
  onNextLesson,
  hasNextLesson = false,
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState<"brief" | "instructions" | "resources" | "preview">("brief")
  const [copiedSnippetId, setCopiedSnippetId] = React.useState<string | null>(null)

  // Milestones interactive checklist
  const [milestones, setMilestones] = React.useState<Milestone[]>([
    {
      id: 1,
      title: "Initialize Project Structure & Tooling",
      description: "Set up the repository, configure package.json or pom.xml, and verify build scripts.",
      command: "git clone https://github.com/learnwise-ai/in-memory-cache-starter.git && cd in-memory-cache-starter && npm install",
      completed: true,
    },
    {
      id: 2,
      title: "Implement Doubly-Linked Node & Hash Index",
      description: "Create the Node data structure and combine it with a HashMap to achieve O(1) key lookups.",
      codeSnippet: `class CacheNode<K, V> {
  key: K;
  value: V;
  prev: CacheNode<K, V> | null = null;
  next: CacheNode<K, V> | null = null;
  expiresAt: number | null = null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}`,
      completed: true,
    },
    {
      id: 3,
      title: "Implement LRU Eviction & TTL Expiry Policy",
      description: "When cache exceeds max capacity, evict the least recently used node from tail. Handle expired keys automatically on read.",
      codeSnippet: `function evictLRU(): void {
  if (!tail.prev || tail.prev === head) return;
  const lruNode = tail.prev;
  removeNode(lruNode);
  map.delete(lruNode.key);
}`,
      completed: false,
    },
    {
      id: 4,
      title: "Expose REST API Endpoints with HTTP Server",
      description: "Build endpoints for GET /cache/:key, POST /cache/:key, and DELETE /cache/:key with JSON responses.",
      command: "npm test -- tests/cache.test.ts",
      completed: false,
    },
    {
      id: 5,
      title: "Dockerize & Measure Benchmark Throughput",
      description: "Write Dockerfile, run stress tests with 10,000 concurrent requests, and verify zero memory leaks.",
      command: "docker build -t learnwise-cache:latest . && docker run -p 8080:8080 learnwise-cache",
      completed: false,
    },
  ])

  // Submission Form State
  const [repoUrl, setRepoUrl] = React.useState("https://github.com/my-profile/in-memory-cache")
  const [demoUrl, setDemoUrl] = React.useState("https://cache-demo.learnwise.app")
  const [notes, setNotes] = React.useState("Implemented O(1) LRU eviction using a Doubly Linked List and HashMap with concurrent reader locks.")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submissionFeedback, setSubmissionFeedback] = React.useState<{
    score: number
    grade: string
    rubric: { category: string; score: number; max: number; note: string }[]
    summary: string
  } | null>(null)

  // Interactive Live Preview Terminal State
  const [terminalInput, setTerminalInput] = React.useState("SET user:101 '{\"name\":\"Arpita\",\"role\":\"Engineer\"}' 60")
  const [terminalHistory, setTerminalHistory] = React.useState<string[]>([
    "[System]: In-Memory Cache Service v2.4 initialized on port 8080.",
    "[Ready]: Type commands: SET <key> <val> [ttl], GET <key>, DEL <key>, KEYS",
    "> SET user:101 '{\"name\":\"Arpita\",\"role\":\"Engineer\"}' 60",
    "OK (Stored in 0.4ms with 60s TTL)",
    "> GET user:101",
    "{\"name\":\"Arpita\",\"role\":\"Engineer\"} (O(1) cache hit)",
  ])

  const completedMilestonesCount = milestones.filter((m) => m.completed).length
  const milestoneProgress = Math.round((completedMilestonesCount / milestones.length) * 100)

  const handleToggleMilestone = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    )
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippetId(id)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedSnippetId(null), 2000)
  }

  const handleRunTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!terminalInput.trim()) return

    const input = terminalInput.trim()
    let response = "OK"

    if (input.startsWith("GET")) {
      response = `{"status":"cached","payload":"Verified Cache Entry"}`
    } else if (input.startsWith("SET")) {
      response = "OK (Key updated with O(1) latency)"
    } else if (input.startsWith("DEL")) {
      response = "1 (Key removed from hash map & list)"
    } else if (input.startsWith("KEYS")) {
      response = `["user:101", "session:abc", "metrics:daily"] (3 active keys)`
    } else {
      response = `Command executed: ${input}`
    }

    setTerminalHistory((prev) => [...prev, `> ${input}`, response])
    setTerminalInput("")
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim()) {
      toast.error("Please provide a valid GitHub repository URL.")
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))

    const feedback = {
      score: 96,
      grade: "A+ Outstanding",
      rubric: [
        { category: "System Architecture", score: 25, max: 25, note: "Clean separation of hash index and eviction linked list." },
        { category: "Algorithmic Correctness", score: 25, max: 25, note: "Verified O(1) time complexity across GET, SET, and LRU eviction." },
        { category: "Code Quality & Types", score: 24, max: 25, note: "Strong TypeScript typing with generic keys and values." },
        { category: "Testing & Documentation", score: 22, max: 25, note: "Great test coverage. Consider adding high concurrency fuzz tests." },
      ],
      summary: "Exceptional submission! Your memory layout demonstrates high engineering maturity and production readiness.",
    }

    setSubmissionFeedback(feedback)
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    toast.success("Project evaluated and accepted with Grade A+! 🏆")
    if (onComplete) onComplete()
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Project Banner */}
      <div className="p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-background shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                Hands-on Portfolio Project
              </Badge>
              <Badge variant="outline" className="text-xs">
                {courseCategory}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">
                Est. Duration: 4–6 Hours
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-display">
              High-Throughput In-Memory Key-Value Store
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Design and ship a production-grade in-memory cache featuring O(1) reads/writes, LRU eviction policy, TTL expiration, and HTTP REST endpoints.
            </p>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-xs w-full md:w-64 shrink-0 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Milestones Completed</span>
              <span className="text-primary font-bold">{milestoneProgress}%</span>
            </div>
            <Progress value={milestoneProgress} />
            <p className="text-[11px] text-muted-foreground text-center">
              {completedMilestonesCount} of {milestones.length} milestones checked
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-xl border border-border max-w-xl text-xs font-semibold">
        {[
          { id: "brief", label: "Project Brief", icon: FileText },
          { id: "instructions", label: "Step-by-Step", icon: Layers },
          { id: "resources", label: "Resources & Starter", icon: FolderGit2 },
          { id: "preview", label: "Preview & Submission", icon: Laptop },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all flex-1 justify-center ${
                isActive
                  ? "bg-card text-foreground shadow-xs font-bold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab 1: Project Brief & System Architecture */}
      {activeTab === "brief" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base font-bold text-foreground">
                  System Architecture & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-sm leading-relaxed text-foreground">
                <p>
                  High-performance web services depend on sub-millisecond in-memory caching to avoid database bottlenecks. In this project, you will architect a Redis-like store from first principles.
                </p>

                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3 font-mono text-xs">
                  <span className="text-[11px] font-bold uppercase text-primary tracking-wider block font-sans">
                    Architecture Data Flow Diagram
                  </span>
                  <div className="bg-zinc-950 text-emerald-400 p-4 rounded-lg overflow-x-auto whitespace-pre leading-relaxed">
{`Client Request ────────> [REST API Server / Router]
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │ Cache Manager Service │
                     └───────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ HashMap Index ]            [ Doubly-Linked List ]
      (Key -> Node Pointer)         (MRU Head <-> LRU Tail)
                 │                               │
                 └───────────────┬───────────────┘
                                 ▼
                       [ TTL Expiration Timer ]`}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Core Engineering Deliverables
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <li className="p-3 rounded-lg border border-border bg-muted/20">
                      <strong>1. O(1) Get / Put:</strong> Direct pointer indexing with constant-time lookup.
                    </li>
                    <li className="p-3 rounded-lg border border-border bg-muted/20">
                      <strong>2. LRU Eviction:</strong> Least recently used node pruned when capacity fills.
                    </li>
                    <li className="p-3 rounded-lg border border-border bg-muted/20">
                      <strong>3. TTL Expiration:</strong> Passive + active expiry of timestamped cache records.
                    </li>
                    <li className="p-3 rounded-lg border border-border bg-muted/20">
                      <strong>4. Concurrent Safety:</strong> Thread/async safe access under heavy load.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <Card className="border border-border/80 shadow-xs">
              <CardHeader className="border-b border-border/60 pb-3">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tech Stack & Specs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Languages</span>
                  <span className="font-semibold">TypeScript / Java / Node.js</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline" className="text-[10px] text-amber-500">Advanced</Badge>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Testing Framework</span>
                  <span className="font-semibold">Jest / Vitest / JUnit 5</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Portfolio Value</span>
                  <span className="font-bold text-primary">Top 5% Resume Feature</span>
                </div>

                <Button
                  onClick={() => setActiveTab("instructions")}
                  className="w-full text-xs font-bold mt-2 gap-1.5"
                >
                  Start Building Step-by-Step
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Step-by-Step Instructions & Interactive Checklist */}
      {activeTab === "instructions" && (
        <Card className="border border-border/80 shadow-xs">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
              <span>Interactive Implementation Checklist</span>
              <span className="text-xs text-muted-foreground font-normal">
                Check off milestones as you build
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4 divide-y divide-border/60">
              {milestones.map((m) => (
                <div key={m.id} className="pt-4 first:pt-0 space-y-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        m.completed
                          ? "bg-primary border-primary text-primary-foreground shadow-xs"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {m.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <h4
                        className={`text-sm font-bold transition-all ${
                          m.completed ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        Step {m.id}: {m.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {m.description}
                      </p>

                      {/* Optional Command */}
                      {m.command && (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-200 mt-2">
                          <code className="truncate">$ {m.command}</code>
                          <button
                            type="button"
                            onClick={() => handleCopy(m.command!, `cmd-${m.id}`)}
                            className="p-1 hover:text-white text-zinc-400"
                            title="Copy command"
                          >
                            {copiedSnippetId === `cmd-${m.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Optional Code Snippet */}
                      {m.codeSnippet && (
                        <div className="rounded-lg border border-border bg-muted/40 overflow-hidden mt-2">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/80 text-[10px] font-mono text-muted-foreground border-b border-border">
                            <span>Implementation Reference</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(m.codeSnippet!, `code-${m.id}`)}
                              className="hover:text-foreground flex items-center gap-1"
                            >
                              {copiedSnippetId === `code-${m.id}` ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-500" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 text-[11px] font-mono overflow-x-auto text-foreground/90">
                            <code>{m.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                All milestones done? Head to the preview and submit your work.
              </span>
              <Button onClick={() => setActiveTab("preview")} className="text-xs font-bold gap-1.5">
                Proceed to Project Submission
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Resource List & Starters */}
      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="border-b border-border/60 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-primary" />
                Starter Repositories & Downloads
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <GitBranch className="h-4 w-4" />
                    TypeScript / Node.js Starter
                  </span>
                  <Badge variant="outline" className="text-[10px]">Official</Badge>
                </div>
                <p className="text-muted-foreground">
                  Pre-configured with TypeScript, Jest tests, and Dockerfile scaffolding.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy("git clone https://github.com/learnwise-ai/in-memory-cache-starter.git", "git-clone")}
                    className="h-7 text-xs gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Git Clone
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Download className="h-4 w-4" />
                    Boilerplate Package (.zip)
                  </span>
                  <Badge variant="outline" className="text-[10px]">Offline</Badge>
                </div>
                <p className="text-muted-foreground">
                  Direct archive containing starter tests, benchmark scripts, and sample client.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success("Starter boilerplate zip downloaded!")}
                  className="h-7 text-xs gap-1"
                >
                  <Download className="h-3 w-3" />
                  Download ZIP (1.2 MB)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="border-b border-border/60 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Documentation & Reference Links
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs">
              {[
                { title: "Redis Architecture & Design Specification", url: "https://redis.io/docs/about/" },
                { title: "LRU Cache LeetCode #146 Benchmark Solutions", url: "https://leetcode.com/problems/lru-cache/" },
                { title: "Node.js High-Throughput HTTP Server Best Practices", url: "https://nodejs.org/api/http.html" },
                { title: "Concurrency & Lock Stripping in Key-Value Stores", url: "https://en.wikipedia.org/wiki/Least_recently_used" },
              ].map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {res.title}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 4: Interactive Sandbox Preview & Final Submission */}
      {activeTab === "preview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Interactive Simulated Cache CLI */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border border-border/80 shadow-md bg-zinc-950 text-zinc-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
                <span className="font-mono text-zinc-400 flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  Live Cache Sandbox Simulator
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">PORT 8080 ONLINE</span>
              </div>

              <div className="p-4 font-mono text-xs max-h-[280px] overflow-y-auto space-y-1.5 text-zinc-300">
                {terminalHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={
                      item.startsWith(">")
                        ? "text-primary font-bold"
                        : item.includes("OK") || item.includes("hit")
                        ? "text-emerald-400"
                        : "text-zinc-400"
                    }
                  >
                    {item}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRunTerminalCommand} className="p-2.5 bg-zinc-900 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="e.g. GET user:101 or SET item:5 'value'"
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-primary"
                />
                <Button type="submit" size="sm" className="h-8 text-xs font-semibold bg-primary">
                  Execute
                </Button>
              </form>
            </Card>

            <div className="p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground space-y-1">
              <h5 className="font-bold text-foreground">💡 Test in Simulator:</h5>
              <p>Type <code>SET session:demo &apos;active&apos;</code> or <code>KEYS</code> to interact with the cache engine.</p>
            </div>
          </div>

          {/* Right: Submission Form & Automated AI Evaluation */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border border-border/80 shadow-md bg-card">
              <CardHeader className="border-b border-border/60 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Project Submission & AI Code Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                      GitHub Repository URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/in-memory-cache"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      Live Demo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://cache-demo.vercel.app"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground">
                      Implementation Reflection & Architecture Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Discuss trade-offs made, performance benchmarks, and eviction policy design..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-xs font-bold gap-2 shadow-md h-10"
                  >
                    <Trophy className="h-4 w-4" />
                    {isSubmitting ? "Running AI Code Evaluation..." : "Submit Project for AI Review"}
                  </Button>
                </form>

                {/* AI Review Result Modal / Card */}
                {submissionFeedback && (
                  <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <div>
                          <h4 className="font-bold text-sm text-foreground">
                            Evaluation Result: {submissionFeedback.grade}
                          </h4>
                          <span className="text-[11px] text-muted-foreground">
                            Score: {submissionFeedback.score} / 100
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white font-bold text-xs">
                        PASSED ✓
                      </Badge>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed">
                      {submissionFeedback.summary}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-emerald-500/20">
                      {submissionFeedback.rubric.map((r, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="font-medium text-foreground">{r.category}</span>
                          <span className="font-bold text-emerald-600">{r.score}/{r.max}</span>
                        </div>
                      ))}
                    </div>

                    {hasNextLesson && onNextLesson && (
                      <Button
                        onClick={onNextLesson}
                        className="w-full text-xs font-bold gap-1.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Next Milestone
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
