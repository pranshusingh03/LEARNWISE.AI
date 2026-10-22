"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Settings,
  ShieldCheck,
  Bookmark,
  Check,
  Sparkles,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { api } from "@/lib/api-client"
import { NotificationItem } from "@/lib/types"

interface AppHeaderProps {
  onOpenMobileNav?: () => void
}

export function AppHeader({ onOpenMobileNav }: AppHeaderProps) {
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)

  // Fetch notifications
  React.useEffect(() => {
    let isMounted = true
    async function loadNotifications() {
      try {
        const data = await api.get<{ notifications: NotificationItem[] }>("/api/notifications")
        if (isMounted && data.notifications) {
          setNotifications(data.notifications)
          setUnreadCount(data.notifications.filter((n) => !n.read).length)
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadNotifications()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/notifications", { markAllRead: true })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch {
      // Ignored
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 md:px-8 backdrop-blur-sm">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search courses, skills, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </form>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 md:gap-3 ml-4">
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowUserMenu(false)
            }}
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card p-4 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No notifications right now.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border text-xs transition-colors ${
                        n.read
                          ? "border-transparent bg-muted/30 text-muted-foreground"
                          : "border-primary/20 bg-primary/5 text-foreground font-medium"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold">{n.title}</span>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-border mt-3 text-center">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2.5 p-1 rounded-full hover:ring-2 hover:ring-border transition-all focus:outline-none"
            aria-label="User menu"
          >
            <Avatar
              src={user?.avatar || "/student-avatar.png"}
              alt={user?.name || "Student"}
              className="h-8 w-8 cursor-pointer"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                {user?.name || "Arpita"}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize">
                {user?.role === "ADMIN" ? "Administrator" : "Student"}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-semibold text-foreground">{user?.name || "Arpita"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                {isAdmin && (
                  <Badge variant="secondary" className="mt-1 text-[10px] py-0 px-1.5 font-bold">
                    Admin
                  </Badge>
                )}
              </div>

              <div className="space-y-0.5 text-xs">
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  My Profile
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                  Saved Courses
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                  Account Settings
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-primary hover:bg-primary/10 font-medium transition-colors"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin Portal
                  </Link>
                )}

                <div className="pt-1 border-t border-border mt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
