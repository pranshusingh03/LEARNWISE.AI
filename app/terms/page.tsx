import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/final-cta"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-foreground font-display">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: October 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4 text-xs leading-relaxed">
          <p>
            By creating an account or accessing LearnWise, you agree to these Terms of Service. Please review them carefully.
          </p>

          <h2 className="text-sm font-bold text-foreground">1. User Accounts</h2>
          <p>
            You are responsible for safeguarding your credentials. Any activities that occur under your account remain your responsibility.
          </p>

          <h2 className="text-sm font-bold text-foreground">2. Code of Conduct</h2>
          <p>
            LearnWise is intended to be a constructive engineering environment. You agree not to manipulate automated grading assessments, scrape proprietary curriculums, or attempt unauthorized database modifications.
          </p>

          <h2 className="text-sm font-bold text-foreground">3. Intellectual Property</h2>
          <p>
            All course curriculums, diagnostic question pools, and interactive tools are protected by intellectual property laws.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
