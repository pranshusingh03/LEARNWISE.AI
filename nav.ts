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
  Code2,
  Laptop,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
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
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
]
