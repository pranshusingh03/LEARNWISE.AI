"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, UserCheck, Shield, Lock, Mail } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    const res = await login(email, password)
    setIsLoading(false)

    if (res.success) {
      toast.success("Welcome back to LearnWise!")
      router.push("/dashboard")
      router.refresh()
    } else {
      setErrorMessage(res.error || "Invalid email or password.")
      toast.error(res.error || "Login failed")
    }
  }

  // Quick 1-click Demo logins
  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setIsLoading(true)
    setErrorMessage("")

    const res = await login(demoEmail, demoPass)
    setIsLoading(false)

    if (res.success) {
      toast.success(`Logged in as ${demoEmail.includes("admin") ? "Administrator" : "Student"}!`)
      router.push(demoEmail.includes("admin") ? "/admin" : "/dashboard")
      router.refresh()
    } else {
      setErrorMessage(res.error || "Demo login failed.")
    }
  }

  return (
    <Card className="border border-border/80 shadow-xl bg-card">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold font-display">Sign In to Your Account</CardTitle>
        <CardDescription>
          Enter your credentials or try our one-click demo accounts below
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        {/* Demo Account Pills */}
        <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2 text-center">
            Instant 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo("student@learnwise.ai", "password123")}
              className="text-xs gap-1.5 h-8 bg-background"
            >
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              Demo Student
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo("admin@learnwise.ai", "admin123")}
              className="text-xs gap-1.5 h-8 bg-background"
            >
              <Shield className="h-3.5 w-3.5 text-purple-600" />
              Demo Admin
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2 mt-2" isLoading={isLoading}>
            Sign In
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
