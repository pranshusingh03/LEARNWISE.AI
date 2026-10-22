import { Target, Compass, Sparkles, Trophy } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Target,
      title: "Set Your Target Goal",
      description:
        "Select whether you are preparing for placement interviews, targeting an internship, or mastering a brand new technology stack.",
    },
    {
      step: "02",
      icon: Compass,
      title: "Follow Your Structured Path",
      description:
        "Get a curated sequence of modules, complete with code walkthroughs, hands-on tasks, and bite-sized lessons.",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Verify Mastery With Smart Quizzes",
      description:
        "Take server-graded assessments. LearnWise analyzes your answer patterns and highlights exact topics needing reinforcement.",
    },
    {
      step: "04",
      icon: Trophy,
      title: "Achieve Milestones & Interview Ready",
      description:
        "Track your streak, master data structures and backend architecture, and finish with a portfolio-grade project.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Step-by-step roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-2 font-display">
            How LearnWise Powers Your Growth
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A proven methodology designed to transform beginners into confident software developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, index) => {
            const Icon = s.icon
            return (
              <div
                key={index}
                className="relative flex flex-col items-start bg-card rounded-2xl p-6 border border-border shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-muted-foreground/30 font-display">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
