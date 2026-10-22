"use client"

import * as React from "react"
import Link from "next/link"
import {
  User as UserIcon,
  Mail,
  Target,
  Clock,
  Sparkles,
  Trophy,
  Flame,
  Brain,
  Rocket,
  Medal,
  Lock,
  Edit3,
  BookOpen,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/context/auth-context"
import { toast } from "sonner"
import { Course } from "@/lib/types"
import { api } from "@/lib/api-client"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [name, setName] = React.useState(user?.name || "")
  const [goal, setGoal] = React.useState(user?.goal || "")
  const [weeklyTime, setWeeklyTime] = React.useState(user?.weeklyTime || "8–12 Hours")
  const [bio, setBio] = React.useState(user?.bio || "")
  const [isSaving, setIsSaving] = React.useState(false)
  const [enrolledCourses, setEnrolledCourses] = React.useState<Course[]>([])

  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setGoal(user.goal || "")
      setWeeklyTime(user.weeklyTime || "8–12 Hours")
      setBio(user.bio || "")
    }
  }, [user])

  React.useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.get<{ courses: Course[] }>("/api/courses")
        if (res.courses) {
          setEnrolledCourses(res.courses.filter((c) => c.isEnrolled))
        }
      } catch {
        // Fallback
      }
    }
    loadCourses()
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const res = await updateProfile({ name, goal, weeklyTime, bio })
    setIsSaving(false)

    if (res.success) {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } else {
      toast.error(res.error || "Failed to update profile.")
    }
  }

  const achievements = [
    {
      id: "a1",
      title: "First Course Completed",
      description: "Finished your very first course and passed the final module",
      icon: Trophy,
      unlocked: true,
      tint: "text-amber-500 bg-amber-500/10",
    },
    {
      id: "a2",
      title: "7 Day Streak",
      description: "Learned 7 consecutive days without missing a study task",
      icon: Flame,
      unlocked: true,
      tint: "text-orange-500 bg-orange-500/10",
    },
    {
      id: "a3",
      title: "Quiz Master",
      description: "Scored 80%+ on diagnostic technical assessments",
      icon: Brain,
      unlocked: true,
      tint: "text-purple-600 bg-purple-500/10",
    },
    {
      id: "a4",
      title: "Skill Explorer",
      description: "Practiced 10+ algorithms across arrays, linked lists, and trees",
      icon: Rocket,
      unlocked: true,
      tint: "text-blue-500 bg-blue-500/10",
    },
    {
      id: "a5",
      title: "Marathon Learner",
      description: "Sustain a 30-day streak with daily problem solving",
      icon: Medal,
      unlocked: false,
      tint: "text-muted-foreground bg-muted",
    },
    {
      id: "a6",
      title: "Path Finisher",
      description: "Complete the entire Placement Preparation roadmap",
      icon: Target,
      unlocked: false,
      tint: "text-muted-foreground bg-muted",
    },
  ]

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Profile Header Card */}
      <Card className="border border-border/80 shadow-md overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-secondary/30 to-background p-6" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src={user?.avatar || "/student-avatar.png"}
                alt={user?.name || "Student"}
                className="h-20 w-20 ring-4 ring-background border-2 border-border shadow-md"
              />
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-foreground font-display">
                    {user?.name || "Arpita"}
                  </h1>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {user?.role === "ADMIN" ? "Administrator" : "Student"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user?.email}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-1.5 text-xs font-semibold self-start sm:self-end"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-border space-y-4">
              <h3 className="text-sm font-bold text-foreground">Update Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Career Goal</label>
                  <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Weekly Study Commitment</label>
                  <Input value={weeklyTime} onChange={(e) => setWeeklyTime(e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Bio / About Me</label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Aspiring software engineer passionate about..." />
                </div>
              </div>
              <Button type="submit" size="sm" isLoading={isSaving} className="text-xs font-bold">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Current Goal</span>
                <span className="font-semibold text-foreground">{user?.goal || "Software Engineering Internship"}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Skill Tier</span>
                <span className="font-semibold text-foreground">{user?.skillLevel || "Intermediate"}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Weekly Commitment</span>
                <span className="font-semibold text-foreground">{user?.weeklyTime || "8–12 Hours"}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements & Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Achievements & Badges
            </h2>
            <p className="text-xs text-muted-foreground">
              Earn trophies as you sustain streaks and master technical topics.
            </p>
          </div>
          <Badge variant="secondary" className="text-xs font-bold">
            4 of 6 Unlocked
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon
            return (
              <Card
                key={ach.id}
                className={`border transition-all ${
                  ach.unlocked
                    ? "bg-card border-border/80 shadow-xs"
                    : "bg-muted/30 border-dashed border-border opacity-60"
                }`}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${ach.tint}`}>
                    {ach.unlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{ach.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {ach.description}
                    </p>
                    <span className="text-[10px] font-semibold text-primary block pt-1">
                      {ach.unlocked ? "✓ Unlocked" : "In Progress"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Enrolled Courses Summary */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Enrolled Courses ({enrolledCourses.length})
        </h2>

        <div className="space-y-3">
          {enrolledCourses.map((c) => (
            <Card key={c.id} className="border border-border/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">{c.instructor} • {c.progress || 0}% Complete</p>
                </div>
                <Link href={`/courses/${c.id}/learn`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    Resume
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
