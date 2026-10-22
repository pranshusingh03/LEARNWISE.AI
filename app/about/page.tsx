import Link from "next/link"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/final-cta"
import { Sparkles, Target, Users, BookOpen, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Our Mission
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight font-display">
            Empowering the Next Generation of Software Engineers
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            LearnWise was built to bridge the gap between academic theory and high-bar technical interviews with personalized curriculums and diagnostic skill evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border/80 p-6 text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-primary font-display">48,000+</h3>
            <p className="text-xs text-muted-foreground font-medium">Students empowered worldwide</p>
          </Card>
          <Card className="border border-border/80 p-6 text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-purple-600 font-display">94%</h3>
            <p className="text-xs text-muted-foreground font-medium">Interview clearance rate</p>
          </Card>
          <Card className="border border-border/80 p-6 text-center space-y-2">
            <h3 className="text-3xl font-extrabold text-emerald-600 font-display">4.9 / 5</h3>
            <p className="text-xs text-muted-foreground font-medium">Average learner satisfaction</p>
          </Card>
        </div>

        <Card className="border border-border/80 p-8 space-y-4">
          <h2 className="text-xl font-bold text-foreground font-display">Why LearnWise?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standard video tutorials teach passive watching. LearnWise forces active coding recall with sequential learning paths, diagnostic multiple-choice assessments with server-side grading, and personalized recommendations that adapt whenever you finish a lesson or take a quiz.
          </p>
          <div className="pt-4">
            <Link href="/courses">
              <Button>Browse Curriculum</Button>
            </Link>
          </div>
        </Card>
      </main>
      <LandingFooter />
    </div>
  )
}
