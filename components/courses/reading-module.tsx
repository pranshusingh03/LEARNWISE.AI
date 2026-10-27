"use client"

import * as React from "react"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Type,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Flame,
  Lightbulb,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"
import { toast } from "sonner"

interface ReadingModuleProps {
  title: string
  content: string
  duration?: string
  courseCategory?: string
  isCompleted?: boolean
  onToggleComplete: () => Promise<void> | void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

export function ReadingModule({
  title,
  content,
  duration = "10 min",
  courseCategory = "Computer Science",
  isCompleted = false,
  onToggleComplete,
  onNextLesson,
  hasNextLesson = false,
}: ReadingModuleProps) {
  // Reading preferences
  const [fontSize, setFontSize] = React.useState<"sm" | "base" | "lg" | "xl">("base")
  const [fontFamily, setFontFamily] = React.useState<"sans" | "serif">("sans")
  const [isZenMode, setIsZenMode] = React.useState(false)
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null)

  // Scroll tracking state
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false)
  const [autoTriggeredComplete, setAutoTriggeredComplete] = React.useState(false)
  const contentContainerRef = React.useRef<HTMLDivElement>(null)

  // Calculate estimated reading time & word count
  const wordCount = React.useMemo(() => {
    return content.trim().split(/\s+/).filter(Boolean).length || 250
  }, [content])

  const readingTimeMinutes = Math.max(2, Math.ceil(wordCount / 180))

  // Scroll depth tracking
  const handleScroll = React.useCallback(() => {
    const el = contentContainerRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll <= 0) {
      setScrollProgress(100)
      setHasScrolledToBottom(true)
      return
    }

    const currentPercent = Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100)))
    setScrollProgress(currentPercent)

    if (currentPercent >= 92 && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }, [hasScrolledToBottom])

  React.useEffect(() => {
    const el = contentContainerRef.current
    if (!el) return
    el.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // initial calculation
    return () => el.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCodeId(id)
    toast.success("Code copied to clipboard!")
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  const handleTriggerComplete = async () => {
    if (!isCompleted) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } })
      toast.success("Article reading completed! Progress updated. 📖")
    }
    await onToggleComplete()
  }

  const fontSizeClass = {
    sm: "text-xs sm:text-sm leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed sm:leading-7",
    lg: "text-base sm:text-lg leading-relaxed sm:leading-8",
    xl: "text-lg sm:text-xl leading-relaxed sm:leading-9",
  }[fontSize]

  const fontFamilyClass = fontFamily === "serif" ? "font-serif tracking-normal" : "font-sans"

  return (
    <div
      className={`space-y-4 transition-all duration-300 ${
        isZenMode
          ? "fixed inset-0 z-50 bg-background/98 p-4 sm:p-8 overflow-y-auto backdrop-blur-xl"
          : ""
      }`}
    >
      {/* Top Reading Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card shadow-xs">
        {/* Left: Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-semibold gap-1 bg-primary/10 text-primary border-primary/20">
            <BookOpen className="h-3.5 w-3.5" />
            Reading Module
          </Badge>

          <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" />
            {readingTimeMinutes} min read ({wordCount} words)
          </span>

          <span className="text-xs font-bold text-muted-foreground">•</span>

          <Badge
            variant={scrollProgress >= 90 || isCompleted ? "default" : "outline"}
            className="text-[11px] font-bold"
          >
            {scrollProgress >= 90 || isCompleted ? "Completed ✓" : `Progress: ${scrollProgress}%`}
          </Badge>
        </div>

        {/* Right: Customization Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border">
            {(["sm", "base", "lg", "xl"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setFontSize(sz)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  fontSize === sz
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={`Set font size to ${sz}`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Serif / Sans Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontFamily((prev) => (prev === "sans" ? "serif" : "sans"))}
            className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
            title="Toggle between Sans-serif and Editorial Serif typography"
          >
            <Type className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{fontFamily === "sans" ? "Serif" : "Sans"}</span>
          </Button>

          {/* Zen Focus Mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsZenMode(!isZenMode)}
            className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground"
            title="Toggle distraction-free Zen Reading Mode"
          >
            {isZenMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isZenMode ? "Exit Zen" : "Zen View"}</span>
          </Button>
        </div>
      </div>

      {/* Sticky Scroll Progress Bar */}
      <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-150 rounded-full"
          style={{ width: `${Math.max(scrollProgress, isCompleted ? 100 : 0)}%` }}
        />
      </div>

      {/* Main Reading Text Container */}
      <Card className="border border-border/80 shadow-md overflow-hidden bg-card">
        <div
          ref={contentContainerRef}
          className={`max-h-[680px] overflow-y-auto p-6 sm:p-10 space-y-6 ${fontSizeClass} ${fontFamilyClass}`}
        >
          {/* Article Header */}
          <div className="space-y-3 pb-6 border-b border-border/70">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              {courseCategory} Course Guide
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              {title}
            </h1>
            <p className="text-muted-foreground text-sm">
              Comprehensive textbook notes, code samples, design patterns, and common interview questions.
            </p>
          </div>

          {/* Quick Key Takeaways Callout */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Lightbulb className="h-4 w-4" />
              Key Conceptual Takeaway
            </div>
            <p className="text-foreground/90 text-sm leading-relaxed">
              Mastering this concept provides the foundation for solving complex algorithmic problems with optimal time and space complexity in technical assessments.
            </p>
          </div>

          {/* Main Body Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-5 text-foreground/90">
            {content ? (
              <div className="whitespace-pre-wrap leading-relaxed space-y-4">
                {content}
              </div>
            ) : (
              <p>
                In this lesson, we break down core principles, memory architecture, algorithmic tradeoffs, and implementation details.
              </p>
            )}
          </div>

          {/* Interactive Code Example Box with Copy Button */}
          <div className="rounded-2xl border border-border bg-muted/40 overflow-hidden my-6">
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/80 border-b border-border text-xs">
              <div className="flex items-center gap-2 font-mono font-semibold text-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                ExampleImplementation.java
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopyCode(
                    `// Production-grade implementation\npublic class Solution {\n    public boolean isValid(String s) {\n        // O(n) Time, O(n) Space\n        return true;\n    }\n}`,
                    "code-1"
                  )
                }
                className="h-7 text-xs gap-1"
              >
                {copiedCodeId === "code-1" ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 font-mono text-xs overflow-x-auto text-foreground/90">
              <code>{`// Core Pattern Demonstration
public static void processElements(int[] elements) {
    if (elements == null || elements.length == 0) return;
    
    // Scan and apply transformations with linear complexity
    for (int i = 0; i < elements.length; i++) {
        System.out.printf("Element at index %d: %d%n", i, elements[i]);
    }
}`}</code>
            </pre>
          </div>

          {/* Pro Tips & Common Pitfalls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <Sparkles className="h-4 w-4" />
                Interview Pro-Tip
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Always state edge cases before writing code: empty collections, single-element inputs, negative values, and integer overflows.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <AlertTriangle className="h-4 w-4" />
                Common Pitfall
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Watch out for off-by-one errors in boundary loops and pointer updates. Always double check base termination conditions.
              </p>
            </div>
          </div>

          {/* Completion Milestone Trigger Section */}
          <div className="pt-8 pb-4 border-t border-border mt-8">
            <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/10 to-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <BookmarkCheck className="h-4 w-4" />
                  Reading Milestone
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {hasScrolledToBottom || isCompleted
                    ? "You've read through the entire module!"
                    : "Finish reading to complete this lesson"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Mark this reading module complete to advance your curriculum progress.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  onClick={handleTriggerComplete}
                  className="gap-2 text-xs font-bold shadow-sm"
                >
                  <CheckCircle2
                    className={`h-4 w-4 ${isCompleted ? "text-white" : "text-emerald-500"}`}
                  />
                  {isCompleted ? "Completed ✓" : "Mark as Read"}
                </Button>

                {hasNextLesson && onNextLesson && (
                  <Button
                    size="sm"
                    onClick={onNextLesson}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    Next Lesson
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
