import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LearnWise
        </Link>
        <ThemeToggle />
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground font-bold shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground font-display">
                LearnWise<span className="text-primary font-bold">.ai</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        © {new Date().getFullYear()} LearnWise Inc. Secure authentication & role-based isolation.
      </div>
    </div>
  )
}
