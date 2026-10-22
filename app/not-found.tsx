import Link from "next/link"
import { Sparkles, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-2xl">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-display">
          Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The curriculum or resource you are looking for doesn&apos;t exist, was moved, or requires higher access permissions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/dashboard">
            <Button size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Landing Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
