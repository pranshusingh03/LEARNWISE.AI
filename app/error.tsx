"use client"

import * as React from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Runtime error captured:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          An unexpected error occurred while processing this page. Our telemetry has logged the incident.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} size="sm" className="gap-2 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Home className="h-3.5 w-3.5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
