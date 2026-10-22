"use client"

import * as React from "react"
import Link from "next/link"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/final-cta"
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0)

  const faqs = [
    {
      q: "How does the AI Learning Path work?",
      a: "When you register and specify your target goal (such as Software Engineering Internship), LearnWise maps out a sequential curriculum. As you take smart quizzes and mark lessons as complete, our recommendation algorithm recalibrates your weakest competencies and re-prioritizes your study queue.",
    },
    {
      q: "Are the quiz evaluations graded on the server?",
      a: "Yes. All assessment submissions are evaluated securely on the backend server. Answers and score computations are never entrusted to client-side code, guaranteeing accurate skill analytics.",
    },
    {
      q: "How do I maintain my study streak?",
      a: "Complete at least one scheduled study task or finish a lesson each calendar day. Your streak counter updates automatically in your student dashboard and reflects on the 17-week contribution heatmap.",
    },
    {
      q: "Can I access courses without paying?",
      a: "Yes! All courses on the platform, including Data Structures in Java and React Complete Guide, are fully accessible with free student accounts.",
    },
    {
      q: "How can I switch to the Admin Portal?",
      a: "If your account has the 'ADMIN' role (such as our demo account admin@learnwise.ai / admin123), you will see an 'Admin Portal' link in the sidebar and profile dropdown to manage courses and view aggregate platform metrics.",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about navigating LearnWise and accelerating your engineering goals.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <Card
                key={idx}
                className="border border-border/80 overflow-hidden cursor-pointer transition-colors hover:border-primary/40"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                    <p className="mt-3">{faq.a}</p>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="text-center pt-6 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">Still have questions?</p>
          <Link href="/contact">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
