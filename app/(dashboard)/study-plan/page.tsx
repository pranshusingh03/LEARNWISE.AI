"use client"

import * as React from "react"
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import { StudyTask } from "@/lib/types"

export default function StudyPlanPage() {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]

  const [tasks, setTasks] = React.useState<StudyTask[]>([])
  const [selectedDay, setSelectedDay] = React.useState("Monday")
  const [newTitle, setNewTitle] = React.useState("")
  const [newDuration, setNewDuration] = React.useState("45 min")
  const [isAdding, setIsAdding] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadTasks = React.useCallback(async () => {
    try {
      const res = await api.get<{ tasks: StudyTask[] }>("/api/study-plan")
      if (res.tasks) {
        setTasks(res.tasks)
      }
    } catch (err) {
      console.error("Failed to load study plan:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleToggle = async (task: StudyTask) => {
    try {
      const nextDone = !task.done
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, done: nextDone } : t))
      )
      await api.patch("/api/study-plan", { id: task.id, done: nextDone })
      toast.success(nextDone ? "Task completed! 🎉" : "Task marked as pending.")
    } catch {
      toast.error("Failed to update task.")
    }
  }

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      await api.delete(`/api/study-plan?id=${taskId}`)
      toast.success("Task deleted.")
    } catch {
      toast.error("Failed to delete task.")
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setIsAdding(true)
    try {
      const res = await api.post<{ success: boolean; task: StudyTask }>("/api/study-plan", {
        day: selectedDay,
        title: newTitle.trim(),
        duration: newDuration,
      })

      setTasks((prev) => [...prev, res.task])
      setNewTitle("")
      toast.success(`Task added for ${selectedDay}!`)
    } catch (err: any) {
      toast.error(err.message || "Failed to add task.")
    } finally {
      setIsAdding(false)
    }
  }

  const dayTasks = tasks.filter((t) => t.day === selectedDay)
  const completedDayCount = dayTasks.filter((t) => t.done).length

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Weekly Routine
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            Persistent study scheduler
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          Study Plan & Schedule
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Maintain your learning streak by planning daily topics and checking off tasks as you finish them.
        </p>
      </div>

      {/* Weekday Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
        {weekdays.map((day) => {
          const isSelected = selectedDay === day
          const count = tasks.filter((t) => t.day === day).length
          const doneCount = tasks.filter((t) => t.day === day && t.done).length

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <span>{day}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-background text-foreground"
                }`}
              >
                {doneCount}/{count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Grid: Tasks List + Add Task Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tasks List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground font-display">
              {selectedDay} Tasks ({completedDayCount} of {dayTasks.length} done)
            </h2>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">
                Loading tasks...
              </div>
            ) : dayTasks.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <p className="text-sm text-muted-foreground">
                  No tasks planned for {selectedDay}. Add your first study goal on the right!
                </p>
              </Card>
            ) : (
              dayTasks.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => handleToggle(t)}
                  className={`border transition-all cursor-pointer ${
                    t.done
                      ? "bg-muted/30 border-transparent text-muted-foreground"
                      : "bg-card border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        className="shrink-0 focus:outline-none"
                        aria-label={t.done ? "Mark pending" : "Mark complete"}
                      >
                        {t.done ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="space-y-0.5">
                        <p
                          className={`text-sm font-semibold ${
                            t.done ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {t.title}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {t.duration}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(t.id, e)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Add Task Box */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Task for {selectedDay}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Task Title
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Solve 3 Binary Tree Problems"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Estimated Duration
                  </label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="20 min">20 min (Quick Review)</option>
                    <option value="30 min">30 min (Standard Problem)</option>
                    <option value="45 min">45 min (Deep Dive Module)</option>
                    <option value="60 min">60 min (Full Coding Session)</option>
                    <option value="90 min">90 min (System Architecture)</option>
                  </select>
                </div>

                <Button type="submit" className="w-full text-xs font-bold" isLoading={isAdding}>
                  Add to Schedule
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
