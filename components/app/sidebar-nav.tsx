"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  BarChart3,
  BookOpen,
  FileQuestion,
  CalendarDays,
  TrendingUp,
  Bot,
  User,
  Settings,
  Bookmark,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Code2,
  Laptop,
} from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SidebarNav() {
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Learning Path", href: "/learning-path", icon: Compass },
    { label: "AI Recommendations", href: "/recommendations", icon: Sparkles },
    { label: "Practice Problems", href: "/practice", icon: Code2 },
    { label: "Hands-on Projects", href: "/projects", icon: Laptop },
    { label: "Explore Courses", href: "/courses", icon: BookOpen },
    { label: "Smart Quiz", href: "/quiz", icon: FileQuestion },
    { label: "Skill Analysis", href: "/skill-analysis", icon: BarChart3 },
    { label: "Study Plan", href: "/study-plan", icon: CalendarDays },
    { label: "Progress Analytics", href: "/analytics", icon: TrendingUp },
    { label: "AI Assistant", href: "/assistant", icon: Bot },
    { label: "Saved Courses", href: "/bookmarks", icon: Bookmark },
  ]

  const bottomNavItems = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full flex-col justify-between border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground font-display">
              LearnWise<span className="text-primary font-bold">.ai</span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              Learning System
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Core Platform
        </div>
        {mainNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Administration Section */}
        <div className="pt-5 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Management
        </div>
        <Link
          href="/admin"
          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            pathname.startsWith("/admin")
              ? "bg-primary text-primary-foreground font-semibold"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-purple-500" />
            <span>Admin Portal</span>
          </div>
          {isAdmin && (
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
              Admin
            </Badge>
          )}
        </Link>

        {/* Account links */}
        <div className="pt-4 px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Preferences
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* User Card Footer */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg">
          <Link href="/profile" className="flex items-center gap-2.5 truncate flex-1 hover:opacity-80">
            <Avatar
              src={user?.avatar || "/student-avatar.png"}
              alt={user?.name || "Student"}
              className="h-8 w-8"
            />
            <div className="flex flex-col truncate text-left">
              <span className="text-xs font-semibold text-sidebar-foreground truncate">
                {user?.name || "Arpita"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user?.goal || "Software Engineering"}
              </span>
            </div>
          </Link>
          <button
            onClick={() => logout()}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
