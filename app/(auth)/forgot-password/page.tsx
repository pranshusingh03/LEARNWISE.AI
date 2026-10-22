"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Mail, KeyRound, ExternalLink } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [resetLink, setResetLink] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await api.post<{ success: boolean; message: string; resetLink?: string }>(
        "/api/auth/forgot-password",
        { email }
      )
      setSubmitted(true)
      if (res.resetLink) {
        setResetLink(res.resetLink)
      }
      toast.success("Password reset request sent!")
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border/80 shadow-xl bg-card">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold font-display">Forgot Your Password?</CardTitle>
        <CardDescription>
          No worries. Enter your registered email to reset your credentials.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {submitted ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-800 dark:text-emerald-300">
              <p className="font-semibold mb-1">Check your inbox or development link:</p>
              <p>
                We have generated a secure password reset token for <strong>{email}</strong>.
              </p>
            </div>

            {resetLink && (
              <div className="rounded-xl bg-muted/60 p-3.5 border border-border">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Local Dev Reset Link:
                </span>
                <Link
                  href={resetLink}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 break-all"
                >
                  Click here to reset password directly
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setResetLink(null)
              }}
              className="w-full text-xs"
            >
              Try another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Registered Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full gap-2 mt-2" isLoading={isLoading}>
              Send Reset Link
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
