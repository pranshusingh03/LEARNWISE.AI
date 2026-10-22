import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/final-cta"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-foreground font-display">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: October 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4 text-xs leading-relaxed">
          <p>
            At LearnWise, we take your privacy and personal data seriously. This Privacy Policy outlines how we collect, use, and protect your information when you access our full-stack educational platform.
          </p>

          <h2 className="text-sm font-bold text-foreground">1. Data We Collect</h2>
          <p>
            We collect account credentials (name, email address, password hash) and educational interaction data (course enrollments, quiz attempt scores, completed study tasks, and user preferences).
          </p>

          <h2 className="text-sm font-bold text-foreground">2. Use of Information</h2>
          <p>
            Your information is used solely to provide personalized curriculum recommendations, record module progress, calculate skill indexes, and secure your session tokens. We never sell student data to third parties.
          </p>

          <h2 className="text-sm font-bold text-foreground">3. Security</h2>
          <p>
            Passwords are hashed using salted bcrypt algorithms. Authentication sessions are secured with signed HTTP-only cookies and cryptographic tokens to prevent unauthorized interception.
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
