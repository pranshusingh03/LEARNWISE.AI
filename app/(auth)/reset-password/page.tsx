"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { toast } from "sonner"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!token) {
      setErrorMessage("Missing or invalid reset token. Please request a new link.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)
    try {
      await api.post("/api/auth/reset-password", { token, password })
      setSuccess(true)
      toast.success("Password reset successfully!")
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to reset password. Link may be expired.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border border-border/80 shadow-xl bg-card">
        <CardContent className="pt-8 pb-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Password Reset Complete!</h2>
          <p className="text-xs text-muted-foreground">
            Your new password has been verified and saved to the database.
          </p>
          <Link href="/login" className="block pt-2">
            <Button className="w-full gap-2">
              Sign In with New Password
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border/80 shadow-xl bg-card">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold font-display">Create New Password</CardTitle>
        <CardDescription>
          Enter your new password below to regain full access
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              New Password (min 6 characters)
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Confirm New Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-2" isLoading={isLoading}>
            Set New Password
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
          Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="text-center text-sm">Loading reset form...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  )
}
