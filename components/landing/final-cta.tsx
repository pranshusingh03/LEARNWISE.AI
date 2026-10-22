import Link from "next/link"
import { ArrowRight, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-tr from-primary/10 via-background to-secondary/10 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Join thousands of placement-ready developers</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight font-display">
          Start Your Guided Tech Learning Journey Today
        </h2>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Free to get started. Personalized AI study plans, interactive quizzes, and curriculum designed for top engineering roles.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg hover:shadow-xl">
              Create Your Free Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-7 text-base">
              Student / Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-bold">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground font-display">
                LearnWise<span className="text-primary font-bold">.ai</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm">
              The intelligent full-stack learning platform. Adaptive curriculums, real-time analytics, and diagnostic assessments for aspiring software engineers.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="/learning-path" className="hover:text-primary transition-colors">
                  Learning Path
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-primary transition-colors">
                  Smart Quiz
                </Link>
              </li>
              <li>
                <Link href="/skill-analysis" className="hover:text-primary transition-colors">
                  Skill Analysis
                </Link>
              </li>
              <li>
                <Link href="/study-plan" className="hover:text-primary transition-colors">
                  Study Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">
              Legal & Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted-foreground/80 block mt-2">
                  Built with Next.js, Prisma, Tailwind CSS, & TypeScript.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} LearnWise Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-muted-foreground">
            Crafted for developers worldwide <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
