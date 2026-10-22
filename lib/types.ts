export type Difficulty = "Beginner" | "Intermediate" | "Advanced"

export type ModuleStatus =
  | "Completed"
  | "In Progress"
  | "Recommended Next"
  | "Locked"
  | "Upcoming"
  | "Final Goal"

export interface User {
  id: string
  name: string
  role: "STUDENT" | "ADMIN"
  email: string
  goal?: string | null
  avatar?: string | null
  skillLevel?: Difficulty | string | null
  learningStyle?: string | null
  weeklyTime?: string | null
  bio?: string | null
  skills?: string[]
  interests?: string[]
}

export interface Course {
  id: string
  title: string
  instructor: string
  category: string
  difficulty: Difficulty
  duration: string
  rating: number
  students: number
  lessons: number
  match?: number
  description: string
  gradient: string
  tags: string[]
  published?: boolean
  isEnrolled?: boolean
  progress?: number
  isBookmarked?: boolean
  modules?: ModuleData[]
}

export interface ModuleData {
  id: string
  title: string
  order: number
  duration: string
  lessons: LessonData[]
}

export interface LessonData {
  id: string
  moduleId: string
  courseId: string
  title: string
  duration: string
  videoUrl?: string | null
  content: string
  order: number
  completed?: boolean
}

export interface CourseProgress {
  id: string
  title: string
  progress: number
  lastAccessed?: string
  totalLessons?: number
  completedLessons?: number
}

export interface PathModule {
  id: number | string
  title: string
  status: ModuleStatus
  progress: number
  difficulty: Difficulty
  duration: string
  description: string
  courseId?: string
}

export interface Recommendation {
  id: string
  title: string
  instructor: string
  duration: string
  difficulty: Difficulty
  rating: number
  match: number
  reason: string
  category?: string
}

export interface SkillGroup {
  category: string
  skills: { name: string; value: number }[]
}

export interface QuizQuestion {
  id: string | number
  topic: string
  question: string
  options: string[]
  answer?: number
  explanation?: string
}

export interface QuizAttemptResult {
  attemptId: string
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  feedback: string
  topicScores: { topic: string; score: number }[]
}

export interface StudyTask {
  id: string
  day?: string
  title: string
  duration: string
  done: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "info" | "success" | "milestone" | "alert"
  read: boolean
  createdAt: string
}

export interface CourseReviewItem {
  id: string
  userId: string
  userName: string
  userAvatar?: string | null
  courseId: string
  rating: number
  comment: string
  createdAt: string
}
