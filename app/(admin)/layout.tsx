"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShieldCheck,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Users,
  ArrowLeft,
  Sparkles,
  LogOut,
} from "lucide-react"
import { AppHeader } from "@/components/app/app-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAdmin, isLoading } = useAuth()

  // Guard: if user is loaded and not admin, show warning / redirect option
  if (!isLoading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
        <div className="max-w-md w-full rounded-2xl border border-destructive/30 bg-card p-8 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Administrator Access Required</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You are signed in as a Student (<strong>{user?.email}</strong>). To manage courses and platform curriculums, please log in with an administrator account (such as <code>admin@learnwise.ai</code> / <code>admin123</code>).
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login">
              <Button className="w-full text-xs font-bold">
                Log in as Demo Admin
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full text-xs">
                Return to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Courses", href: "/admin/courses", icon: BookOpen },
    { label: "Create Course", href: "/admin/courses/new", icon: PlusCircle },
  ]

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col justify-between">
        <div>
          <div className="p-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-sidebar-foreground font-display">
                  LearnWise<span className="text-purple-600 font-bold">.ai</span>
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          <div className="p-3 space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Curriculum Control
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-purple-600 text-white shadow-xs font-semibold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <Link href="/dashboard" className="block">
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              Student View
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <AppHeader />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
