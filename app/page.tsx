import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { PopularSkills } from "@/components/landing/popular-skills"
import { FinalCta, LandingFooter } from "@/components/landing/final-cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <PopularSkills />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
