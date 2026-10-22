# LearnWise.ai — Intelligent Full-Stack Learning Platform

LearnWise is a modern, production-grade learning operating system built for aspiring software engineers, placement candidates, and technical professionals. It pairs sequential, milestone-driven curriculums with diagnostic multiple-choice assessments, real-time analytics, and personalized AI mentoring.

Live Reference: [https://learnwise-liard.vercel.app/](https://learnwise-liard.vercel.app/)

---

## 🌟 Key Features

### 1. Student Experience
- **Interactive Landing & Discovery**: Hero value propositions, popular engineering domains, step-by-step roadmap, and testimonials.
- **Adaptive Dashboard**: Live metrics tracking current study streak, estimated hours, completed courses, and composite skill index.
- **Curated Course Catalog**: Real-time filtering by category (Programming, Web Dev, AI, Data Science, Cybersecurity), difficulty tier (Beginner, Intermediate, Advanced), and keyword search.
- **Course Syllabus & Reviews**: Detailed module and lesson breakdowns, student ratings, and interactive review submission.
- **Interactive Course Learning Player**: Complete lesson reader and video interface with instant lesson progress tracking that updates course completion percentage in real time.
- **Diagnostic Smart Quiz**: Server-side grading, topic-by-topic accuracy analysis, personalized AI feedback, and celebratory confetti upon passing.
- **Weekly Study Planner**: Persistent day-by-day study schedule with interactive task completion toggles.
- **Learning Telemetry & Analytics**: 17-week GitHub-style contribution heatmap, weekly learning hours bar charts, and domain proficiency ratings.
- **AI Technical Mentor**: 24/7 conversational mentor that provides DSA problem-solving tips, conceptual analogies (e.g. linked lists), and tailored 7-day study plans.
- **Saved Bookmarks & Notifications**: Bookmark courses for rapid reference and receive real-time milestone alerts.

### 2. Administrator Portal
- **Administrative Telemetry**: Aggregate student counts, course numbers, total enrollments, and platform completion rates.
- **Course Management Table**: Real-time course catalog overview with one-click publish/unpublish toggling and deletion.
- **Course Creator**: Comprehensive course authoring form with gradient thumbnail selectors, difficulty tiers, and tag management.
- **Role-Based Protection**: Backend and UI checks ensuring student accounts cannot access or manipulate administrative records.

### 3. Authentication & Security
- **Role-Based Access Control**: `STUDENT` and `ADMIN` permission models.
- **Secure Password Hashing**: Salted `bcryptjs` hashing (zero plaintext storage).
- **Session Tokens**: Stateless `jose` JWTs stored in secure, `httpOnly` cookies.
- **Password Reset**: Expiring cryptographic reset tokens with email simulation for local testing.
- **One-Click Demo Logins**: Preconfigured buttons on the login screen for instant testing as both Student and Administrator.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.7 |
| **Database & ORM** | Prisma ORM with SQLite (local default) / PostgreSQL (production) |
| **Authentication** | JWT (`jose`) & `bcryptjs` password hashing |
| **UI Components** | Radix / Tailwind CSS, Lucide Icons, Sonner toasts |
| **Visualizations** | SVG / CSS responsive progress bars & heatmap charts |
| **Package Manager** | pnpm v12 (Node 24 compliant) |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- pnpm `v9+` or `v12+` (enable with `corepack enable`)

### 2. Clone and Install Dependencies
```bash
# Clone the repository
cd learnwise-ai-main

# Install dependencies
pnpm install
```

### 3. Database Initialization & Seed
```bash
# Push database schema to local SQLite database (prisma/dev.db)
pnpm prisma db push

# Seed realistic courses, lessons, questions, and demo accounts
pnpm seed
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Student** | `student@learnwise.ai` | `password123` | Dashboard, Courses, Learn, Quiz, Study Plan |
| **Admin** | `admin@learnwise.ai` | `admin123` | Full Administrative Portal, Course CRUD |

*You can also click the "Demo Student" or "Demo Admin" buttons directly on `/login` to sign in instantly.*

---

## 🧪 Automated Testing

A comprehensive verification suite tests database connectivity, password hashing, JWT signing, user isolation, course enrollment, lesson progress calculation, server-side quiz grading, and role-based permissions:

```bash
# Run automated full-stack tests
pnpm test
```

### Build Verification
```bash
# Build production bundle
pnpm build
```

---

## 🌐 Production Deployment (Vercel & PostgreSQL)

### Step 1: Database Setup
For production deployment, use a managed PostgreSQL service such as **Neon**, **Supabase**, or **AWS RDS**:
1. Create a PostgreSQL database instance.
2. Copy the connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-sample-123.region.aws.neon.tech/learnwise?sslmode=require"
   ```
3. Update `provider = "postgresql"` in `prisma/schema.prisma` if targeting PostgreSQL.

### Step 2: Environment Variables
Configure the following in your Vercel Project Settings:
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="generate-a-random-secure-32-char-secret"
NEXT_PUBLIC_APP_URL="https://your-learnwise-domain.vercel.app"
```

### Step 3: Deploy to Vercel
```bash
# Deploy with Vercel CLI
vercel --prod
```
During the build phase, Vercel will run `prisma generate` and `next build --webpack`.

---

## 📁 Project Architecture

```
learnwise-ai-main/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── courses/
│   │   │   │   ├── new/page.tsx       # Course creation form
│   │   │   │   └── page.tsx           # Course management table
│   │   │   └── page.tsx               # Admin analytics dashboard
│   │   └── layout.tsx                 # Protected admin shell
│   ├── (auth)/
│   │   ├── login/page.tsx             # Login + 1-click demo buttons
│   │   ├── signup/page.tsx            # Student registration form
│   │   ├── forgot-password/page.tsx   # Token-based password recovery
│   │   ├── reset-password/page.tsx    # Password reset verification
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── analytics/page.tsx         # 17-week heatmap & telemetry
│   │   ├── assistant/page.tsx         # AI Mentor chat interface
│   │   ├── bookmarks/page.tsx         # Saved reference courses
│   │   ├── courses/
│   │   │   ├── [id]/
│   │   │   │   ├── learn/page.tsx     # Active lesson learning player
│   │   │   │   └── page.tsx           # Course syllabus & reviews
│   │   │   └── page.tsx               # Searchable course catalog
│   │   ├── dashboard/page.tsx         # Student dashboard & streak
│   │   ├── learning-path/page.tsx     # Adaptive roadmap timeline
│   │   ├── notifications/page.tsx     # User activity notifications
│   │   ├── profile/page.tsx           # User profile & trophies
│   │   ├── quiz/page.tsx              # Diagnostic assessment system
│   │   ├── recommendations/page.tsx   # AI course recommendations
│   │   ├── settings/page.tsx          # Account & learning preferences
│   │   ├── study-plan/page.tsx        # Day-by-day task scheduler
│   │   └── layout.tsx                 # App layout with Sidebar & Header
│   ├── api/
│   │   ├── admin/                     # Platform analytics & user APIs
│   │   ├── analytics/                 # Student performance telemetry
│   │   ├── assistant/                 # AI Mentor knowledge base endpoint
│   │   ├── auth/                      # Register, login, logout, me, reset
│   │   ├── courses/                   # Course catalog, details, enroll, bookmark, review
│   │   ├── lessons/                   # Complete lesson & progress recalculation
│   │   ├── notifications/             # Notification endpoints
│   │   ├── quizzes/                   # Quiz fetching & server-side grading
│   │   ├── seed/                      # Safe database seed trigger
│   │   └── study-plan/                # Task CRUD endpoints
│   ├── about/                         # Company mission & milestones
│   │   └── page.tsx
│   ├── contact/                       # Contact & feedback form
│   │   └── page.tsx
│   ├── help/                          # FAQ & Support Center
│   │   └── page.tsx
│   ├── privacy/                       # Privacy policy
│   │   └── page.tsx
│   ├── terms/                         # Terms of service
│   │   └── page.tsx
│   ├── error.tsx                      # Runtime error boundary
│   ├── not-found.tsx                  # Custom 404 page
│   ├── globals.css                    # Tailwind CSS v4 design tokens
│   ├── layout.tsx                     # Root HTML shell & ThemeProvider
│   └── page.tsx                       # High-converting landing page
├── components/
│   ├── app/                           # AppHeader, SidebarNav
│   ├── courses/                       # CourseCard, filters
│   ├── landing/                       # Hero, Features, HowItWorks, PopularSkills, FinalCta
│   └── ui/                            # Button, Card, Badge, Input, Progress, Avatar, ThemeToggle
├── lib/
│   ├── api-client.ts                  # Typed client for REST endpoints
│   ├── auth.ts                        # JWT and bcrypt helpers
│   ├── db.ts                          # Prisma singleton
│   ├── types.ts                       # Shared TypeScript models
│   ├── utils.ts                       # Classnames and utility helpers
│   └── context/
│       └── auth-context.tsx           # React Context for client auth state
├── prisma/
│   ├── schema.prisma                  # SQLite / Postgres schema definition
│   └── seed.ts                        # Realistic seed database script
├── tests/
│   └── full-stack-journey.test.ts     # Automated verification suite
├── .env.example                       # Documented environment template
└── package.json
```
