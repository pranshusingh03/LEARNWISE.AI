import Link from "next/link"
import { ArrowRight, Sparkles, CheckCircle2, Play, Flame, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-20 pointer-events-none">
        <div className="h-[400px] w-[700px] rounded-full bg-gradient-to-tr from-primary via-secondary to-accent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Next-Gen Adaptive Learning Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-display leading-[1.15]">
              Master Tech Skills with{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                Personalized AI Guidance
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Accelerate your engineering journey. LearnWise generates tailored study plans, provides instant concept breakdowns, tracks your real progress, and prepares you for technical placement interviews.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-7 text-base gap-2 shadow-md hover:shadow-lg">
                  Start Learning Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="h-12 px-6 text-base gap-2">
                  Browse Courses
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="subtle" className="h-12 px-5 text-sm gap-2">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Try Demo Account
                </Button>
              </Link>
            </div>

            {/* Social Proof Badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-6 border-t border-border/60">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero fluff curriculum</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Hands-on practice & quizzes</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Persistent progress tracking</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Dashboard Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    DS
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">Data Structures & Algorithms</h2>
                    <p className="text-xs text-muted-foreground">Dr. Meera Nair • 24h 30m</p>
                  </div>
                </div>
                <Badge variant="success">94% Match</Badge>
              </div>

              {/* Progress & Stat */}
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-muted-foreground">Overall Completion</span>
                    <span className="font-semibold text-primary">70%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-[70%] rounded-full" />
                  </div>
                </div>

                {/* Current Active Lesson */}
                <div className="rounded-xl bg-muted/50 p-3.5 border border-border/50">
                  <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                    Next Recommended Lesson
                  </span>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    Binary Search Trees & Traversal Patterns
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strengthens your weakest area identified from your last quiz attempt.
                  </p>
                </div>

                {/* Live Streak & Skill Metric */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg border border-border/80 bg-background p-3 flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">12 Days</p>
                      <p className="text-[11px] text-muted-foreground">Study Streak</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-background p-3 flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-purple-500/10 text-purple-600">
                      <Star className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">78 / 100</p>
                      <p className="text-[11px] text-muted-foreground">Skill Index</p>
                    </div>
                  </div>
                </div>

                <Link href="/courses/dsa-java" className="block pt-2">
                  <Button className="w-full gap-2">
                    Resume Learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
