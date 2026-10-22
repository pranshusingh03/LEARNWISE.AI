import {
  Compass,
  FileQuestion,
  TrendingUp,
  Bot,
  Layers,
  Award,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Compass,
      title: "Personalized Learning Paths",
      description:
        "Adaptive roadmaps that guide you step-by-step from beginner to placement ready. Never wonder what module to study next.",
      tint: "from-blue-500/10 to-indigo-500/10 text-indigo-600",
    },
    {
      icon: FileQuestion,
      title: "Server-Graded Smart Quizzes",
      description:
        "Diagnostic assessments with instant server evaluation, topic accuracy breakdowns, and targeted feedback on weak points.",
      tint: "from-purple-500/10 to-pink-500/10 text-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Deep Progress Analytics",
      description:
        "Monitor your daily streaks, weekly learning hours, completed tasks, and category mastery with interactive visual charts.",
      tint: "from-emerald-500/10 to-teal-500/10 text-emerald-600",
    },
    {
      icon: Bot,
      title: "Contextual AI Assistant",
      description:
        "Ask technical questions, get simplified analogies for complex algorithms, or generate a tailored 7-day revision schedule.",
      tint: "from-amber-500/10 to-orange-500/10 text-amber-600",
    },
    {
      icon: Layers,
      title: "Production-Grade Tech Stacks",
      description:
        "Master Java, Spring Boot, React, Python, Machine Learning, SQL, and System Design with battle-tested curriculums.",
      tint: "from-cyan-500/10 to-blue-500/10 text-cyan-600",
    },
    {
      icon: Award,
      title: "Milestone Badges & Bookmarks",
      description:
        "Earn achievement trophies as you finish courses, sustain long streaks, and bookmark your essential reference lessons.",
      tint: "from-rose-500/10 to-red-500/10 text-rose-600",
    },
  ]

  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
            Built For Serious Engineers
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
            Everything you need to level up your engineering career
          </p>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            LearnWise replaces chaotic YouTube tutorials and outdated textbooks with an intelligent, structured full-stack learning operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <Card
                key={i}
                className="group relative overflow-hidden border border-border/70 hover:border-primary/50 transition-all duration-300 hover:shadow-md"
              >
                <CardContent className="p-7">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.tint} mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
