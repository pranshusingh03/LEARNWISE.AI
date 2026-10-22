"use client"

import * as React from "react"
import { Bell, Check, Sparkles, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { NotificationItem } from "@/lib/types"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const loadNotifications = React.useCallback(async () => {
    try {
      const res = await api.get<{ notifications: NotificationItem[] }>("/api/notifications")
      if (res.notifications) {
        setNotifications(res.notifications)
      }
    } catch (err) {
      console.error("Failed to load notifications:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleMarkAllRead = async () => {
    try {
      await api.patch("/api/notifications", { markAllRead: true })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      toast.success("All notifications marked as read.")
    } catch {
      toast.error("Failed to update notifications.")
    }
  }

  const handleMarkSingleRead = async (id: string) => {
    try {
      await api.patch("/api/notifications", { id })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch {
      // Ignored
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs font-semibold gap-1">
              <Bell className="h-3.5 w-3.5" />
              Notifications Center
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs font-bold text-primary">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
            Activity & Announcements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated on your course milestones, weekly study goals, and curriculum revisions.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2 text-xs font-semibold shrink-0"
          >
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-card border border-border" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-foreground">You&apos;re all caught up!</h3>
            <p className="text-xs text-muted-foreground mt-1">
              No new notifications right now.
            </p>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => !n.read && handleMarkSingleRead(n.id)}
              className={`border transition-all ${
                n.read
                  ? "bg-card/70 border-border/70 text-muted-foreground"
                  : "bg-primary/5 border-primary/30 text-foreground shadow-xs cursor-pointer"
              }`}
            >
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === "milestone"
                      ? "bg-purple-500/10 text-purple-600"
                      : n.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {n.type === "milestone" ? (
                    <Sparkles className="h-5 w-5" />
                  ) : n.type === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">{n.title}</h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">{n.message}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
