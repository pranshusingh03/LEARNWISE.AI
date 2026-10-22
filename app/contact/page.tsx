"use client"

import * as React from "react"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/final-cta"
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function ContactPage() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    toast.success("Message received! Our team will respond shortly.")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <LandingNav />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
            Contact Support & Curriculum Team
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Have questions about coursework, enterprise university coaching, or platform features? We&apos;d love to help.
          </p>
        </div>

        <Card className="border border-border/80 shadow-md">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Message Sent!</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Thank you for reaching out. A curriculum specialist will reply to <strong>{email}</strong> within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false)
                    setName("")
                    setEmail("")
                    setMessage("")
                  }}
                  className="mt-4"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subject</label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Question about DSA course curriculum" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="How can we assist you today?"
                    className="w-full rounded-lg border border-input bg-background p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Button type="submit" className="gap-2 text-xs font-bold">
                  Send Message
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <LandingFooter />
    </div>
  )
}
