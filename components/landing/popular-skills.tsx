import Link from "next/link"
import { ArrowRight, Code, Database, Brain, Globe, Shield, Server, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PopularSkills() {
  const skillCategories = [
    {
      name: "Data Structures & Algorithms",
      icon: Code,
      count: "86 Lessons",
      popular: "Arrays, Trees, Graphs, DP",
      gradient: "from-indigo-500 to-violet-600",
      href: "/courses?category=Programming",
    },
    {
      name: "Full Stack Web Development",
      icon: Globe,
      count: "120 Lessons",
      popular: "React 19, Next.js, REST APIs",
      gradient: "from-cyan-500 to-blue-600",
      href: "/courses?category=Web+Development",
    },
    {
      name: "Backend Architecture",
      icon: Server,
      count: "64 Lessons",
      popular: "Spring Boot, JPA, Microservices",
      gradient: "from-emerald-500 to-green-600",
      href: "/courses?category=Web+Development",
    },
    {
      name: "Artificial Intelligence & ML",
      icon: Brain,
      count: "78 Lessons",
      popular: "Python, Scikit-Learn, PyTorch",
      gradient: "from-fuchsia-500 to-pink-600",
      href: "/courses?category=Artificial+Intelligence",
    },
    {
      name: "Database Engineering",
      icon: Database,
      count: "40 Lessons",
      popular: "PostgreSQL, Indexing, Query Tuning",
      gradient: "from-amber-500 to-orange-600",
      href: "/courses?category=Data+Science",
    },
    {
      name: "Cybersecurity & Defenses",
      icon: Shield,
      count: "44 Lessons",
      popular: "Network Defense, Encryption",
      gradient: "from-rose-500 to-red-600",
      href: "/courses?category=Cybersecurity",
    },
  ]

  const quickPills = [
    "Java",
    "Data Structures",
    "Python",
    "React",
    "Machine Learning",
    "SQL",
    "System Design",
    "Spring Boot",
    "Dynamic Programming",
  ]

  return (
    <section className="py-20 bg-background border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Trending Topics
            </span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
              Popular Domains & Skill Tracks
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select any skill track to jump straight into tailored lessons and problem sets.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center text-sm font-semibold text-primary hover:underline mt-4 md:mt-0 gap-1"
          >
            Explore all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {quickPills.map((pill) => (
            <Link key={pill} href={`/courses?search=${encodeURIComponent(pill)}`}>
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-xs font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                {pill}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((c, i) => {
            const Icon = c.icon
            return (
              <Link key={i} href={c.href}>
                <Card className="h-full group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${c.gradient} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </h3>
                        <span className="text-xs text-muted-foreground font-medium">
                          {c.count}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate max-w-[200px]">
                        {c.popular}
                      </span>
                      <span className="font-semibold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Explore <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
