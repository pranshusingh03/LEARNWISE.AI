import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function runSeed() {
  console.log("Seeding LearnWise database...")

  // 1. Password Hashes
  const studentPasswordHash = await bcrypt.hash("password123", 10)
  const adminPasswordHash = await bcrypt.hash("admin123", 10)

  // 2. Demo Users
  const student = await prisma.user.upsert({
    where: { email: "student@learnwise.ai" },
    update: {
      name: "Arpita",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      goal: "Software Engineering Internship",
      avatar: "/student-avatar.png",
      skillLevel: "Intermediate",
      learningStyle: "Hands-on Practice",
      weeklyTime: "8–12 Hours",
      bio: "Aspiring software engineer passionate about algorithms and full-stack development.",
    },
    create: {
      id: "user-student-arpita",
      name: "Arpita",
      email: "student@learnwise.ai",
      passwordHash: studentPasswordHash,
      role: "STUDENT",
      goal: "Software Engineering Internship",
      avatar: "/student-avatar.png",
      skillLevel: "Intermediate",
      learningStyle: "Hands-on Practice",
      weeklyTime: "8–12 Hours",
      bio: "Aspiring software engineer passionate about algorithms and full-stack development.",
    },
  })

  const admin = await prisma.user.upsert({
    where: { email: "admin@learnwise.ai" },
    update: {
      name: "Platform Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      goal: "Platform Curriculum Management",
      avatar: "/placeholder-user.jpg",
      skillLevel: "Advanced",
      learningStyle: "System Architecture",
      weeklyTime: "20+ Hours",
      bio: "LearnWise Head of Curriculum & Platform Operations.",
    },
    create: {
      id: "user-admin",
      name: "Platform Administrator",
      email: "admin@learnwise.ai",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      goal: "Platform Curriculum Management",
      avatar: "/placeholder-user.jpg",
      skillLevel: "Advanced",
      learningStyle: "System Architecture",
      weeklyTime: "20+ Hours",
      bio: "LearnWise Head of Curriculum & Platform Operations.",
    },
  })

  console.log(`Users seeded: Student (${student.email}), Admin (${admin.email})`)

    // 3. Courses Data with Working Video URLs & Complete Modules
  const coursesData = [
    {
      id: "dsa-java",
      title: "Master Data Structures in Java",
      instructor: "Dr. Meera Nair",
      category: "Programming",
      difficulty: "Intermediate",
      duration: "24h 30m",
      rating: 4.9,
      students: 48210,
      lessons: 6,
      match: 94,
      description:
        "Go from arrays to advanced graph algorithms with hands-on problems designed for technical interviews. Build the problem-solving intuition top companies look for.",
      gradient: "from-indigo-500 to-violet-600",
      tags: JSON.stringify(["Arrays", "Trees", "Graphs", "DP"]),
      published: true,
      modules: [
        {
          title: "Module 1: Arrays and Strings",
          duration: "3h 20m",
          order: 1,
          lessons: [
            {
              title: "Array Fundamentals & Memory Layout",
              duration: "25 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
              content: `# Array Fundamentals & Memory Layout

Arrays are contiguous blocks of memory where each element can be accessed in O(1) time using its index.

## Key Properties:
- **Contiguous Memory**: Elements sit side-by-side in RAM, yielding excellent CPU cache locality.
- **Random Access**: Formula \`Address = BaseAddress + (Index * ElementSize)\` provides immediate lookups.
- **Amortized Append**: Dynamic arrays (like ArrayList) double in size when full, achieving amortized O(1) inserts.

\`\`\`java
int[] numbers = new int[]{10, 20, 30, 40, 50};
System.out.println("Element at index 2: " + numbers[2]); // O(1)
\`\`\`

## When to Use:
1. Fast lookups by index are needed.
2. The number of elements is known in advance or appends dominate.`,
            },
            {
              title: "Two-Pointer Technique & Sliding Window",
              duration: "35 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/BWL3W6bX_6U",
              content: `# Two-Pointer Technique & Sliding Window

The two-pointer technique solves array subarray and pair problems efficiently, reducing O(n^2) brute force to O(n) linear scans.

\`\`\`java
public boolean hasPairWithSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}
\`\`\``,
            },
          ],
        },
        {
          title: "Module 2: Linked Lists",
          duration: "2h 45m",
          order: 2,
          lessons: [
            {
              title: "Singly Linked Lists & Pointer Manipulation",
              duration: "30 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/F8AbOfQwl1c",
              content: `# Singly Linked Lists

Unlike arrays, linked lists store elements as disconnected nodes that point to the next node.

\`\`\`java
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
\`\`\``,
            },
          ],
        },
        {
          title: "Module 3: Stacks and Queues",
          duration: "2h 10m",
          order: 3,
          lessons: [
            {
              title: "LIFO vs FIFO Implementations",
              duration: "25 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/wjI1WNcIntg",
              content: `# Stacks (LIFO) and Queues (FIFO)

- **Stack**: Last-In-First-Out. Used in recursion, expression evaluation, and browser back history.
- **Queue**: First-In-First-Out. Used in BFS, task scheduling, and printer spoolers.`,
            },
          ],
        },
        {
          title: "Module 4: Trees & Binary Search Trees",
          duration: "4h 05m",
          order: 4,
          lessons: [
            {
              title: "BST Traversals: Pre, In, and Post Order",
              duration: "40 min",
              order: 5,
              videoUrl: "https://www.youtube.com/embed/fAAZixBzIAI",
              content: `# Binary Search Trees (BST)

In a valid BST, every left child is smaller than its parent, and every right child is greater.

An in-order traversal of a BST visits nodes in strictly ascending sorted order!`,
            },
          ],
        },
        {
          title: "Module 5: Graph Algorithms",
          duration: "3h 50m",
          order: 5,
          lessons: [
            {
              title: "Breadth-First Search (BFS) and Dijkstra",
              duration: "45 min",
              order: 6,
              videoUrl: "https://www.youtube.com/embed/tWVWeAqZ0WU",
              content: `# Graph Traversals: BFS & Dijkstra

BFS uses a Queue to find the shortest unweighted path layer by layer.
Dijkstra's algorithm uses a PriorityQueue (min-heap) to find the shortest path in weighted graphs with non-negative edges.`,
            },
          ],
        },
      ],
    },
    {
      id: "java-collections",
      title: "Advanced Java Collections",
      instructor: "Rahul Verma",
      category: "Programming",
      difficulty: "Intermediate",
      duration: "12h 10m",
      rating: 4.7,
      students: 31200,
      lessons: 4,
      match: 91,
      description:
        "Deep dive into Lists, Maps, Sets, and Queues. Learn when to use each collection and how they perform under the hood.",
      gradient: "from-violet-500 to-purple-600",
      tags: JSON.stringify(["Java", "Collections", "Generics"]),
      published: true,
      modules: [
        {
          title: "Module 1: Map Internals & HashMap Hash Collisions",
          duration: "3h",
          order: 1,
          lessons: [
            {
              title: "HashMap Internals: Buckets & Treeification",
              duration: "30 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/c3RVW3KGIIE",
              content: `# HashMap Under The Hood

Java 8 converts linked list buckets in HashMaps into Red-Black Trees when bucket length exceeds 8, improving worst-case search from O(n) to O(log n).`,
            },
            {
              title: "ConcurrentHashMap vs SynchronizedMap",
              duration: "35 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/viTHc_4XfCA",
              content: `# Thread-Safe Maps

ConcurrentHashMap uses segment/bucket-level locking and CAS (Compare-And-Swap) instructions for lock-free read concurrency.`,
            },
          ],
        },
        {
          title: "Module 2: Lists, Sets & Generics",
          duration: "2h 30m",
          order: 2,
          lessons: [
            {
              title: "ArrayList vs LinkedList Performance Benchmark",
              duration: "28 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/5dscMs22upM",
              content: `# ArrayList vs LinkedList

Modern hardware heavily favors ArrayList due to contiguous memory allocation and CPU cache spatial locality.`,
            },
            {
              title: "Generics, Wildcards, and Type Erasure",
              duration: "32 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/K1iu1kXkVoA",
              content: `# Java Generics & Type Erasure

Java compiler removes generic type parameters during compilation (Type Erasure) for backwards compatibility.`,
            },
          ],
        },
      ],
    },
    {
      id: "react-guide",
      title: "React Complete Guide",
      instructor: "Sophia Alvarez",
      category: "Web Development",
      difficulty: "Beginner",
      duration: "31h 45m",
      rating: 4.8,
      students: 92450,
      lessons: 4,
      match: 82,
      description:
        "Build modern, reactive user interfaces with hooks, context, and the latest React patterns. Ship real projects along the way.",
      gradient: "from-cyan-500 to-blue-600",
      tags: JSON.stringify(["React", "Hooks", "Frontend"]),
      published: true,
      modules: [
        {
          title: "Module 1: React 19 Essentials",
          duration: "4h",
          order: 1,
          lessons: [
            {
              title: "Component Architecture & JSX",
              duration: "35 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
              content: `# React 19 Architecture

React turns declarative JSX into fiber node trees and efficiently reconciles UI changes via Virtual DOM diffing.`,
            },
            {
              title: "State Management with useState and useReducer",
              duration: "40 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/TNhaISAUyvc",
              content: `# React State Architecture

Learn how state triggers re-renders and how to organize clean UI component trees with pure functions.`,
            },
          ],
        },
        {
          title: "Module 2: Modern Full-Stack React",
          duration: "3h 45m",
          order: 2,
          lessons: [
            {
              title: "Custom Hooks & Asynchronous Data Fetching",
              duration: "35 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
              content: `# Custom React Hooks

Extract reusable component logic into custom hooks starting with 'use' to share stateful operations cleanly.`,
            },
            {
              title: "Next.js App Router, SSR & Server Actions",
              duration: "45 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              content: `# Next.js App Router & Server Components

React Server Components execute entirely on the server, streaming lightweight HTML with zero client JavaScript bundle overhead.`,
            },
          ],
        },
      ],
    },
    {
      id: "ml-intro",
      title: "Introduction to Machine Learning",
      instructor: "Dr. Aditya Rao",
      category: "Artificial Intelligence",
      difficulty: "Intermediate",
      duration: "28h 00m",
      rating: 4.6,
      students: 40120,
      lessons: 4,
      match: 76,
      description:
        "Understand the math and intuition behind supervised and unsupervised learning, and train your first real models.",
      gradient: "from-fuchsia-500 to-pink-600",
      tags: JSON.stringify(["ML", "Python", "Models"]),
      published: true,
      modules: [
        {
          title: "Module 1: Machine Learning Foundations",
          duration: "3h",
          order: 1,
          lessons: [
            {
              title: "Supervised vs Unsupervised Learning",
              duration: "35 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/i_LwzRVP7bg",
              content: `# ML Paradigms: Supervised vs Unsupervised

- **Supervised Learning**: Models learn mapping from input features X to labeled targets Y.
- **Unsupervised Learning**: Discovering latent structures and clusters without pre-existing labels.`,
            },
            {
              title: "Linear Regression & Gradient Descent",
              duration: "40 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/PaFPbb66DxQ",
              content: `# Linear Regression & Optimization

Gradient Descent iteratively updates model weights by computing the partial derivatives of the Mean Squared Error (MSE) loss function.`,
            },
          ],
        },
        {
          title: "Module 2: Deep Learning & Neural Networks",
          duration: "3h 30m",
          order: 2,
          lessons: [
            {
              title: "Logistic Regression & Classification Boundaries",
              duration: "38 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/yIYKR4sgzI8",
              content: `# Classification with Sigmoid Function

The sigmoid function maps linear combinations of features into probability values bounded between 0 and 1.`,
            },
            {
              title: "Neural Networks Architecture & Backpropagation",
              duration: "45 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
              content: `# Neural Networks & Backpropagation

Backpropagation applies the calculus chain rule backwards from output loss to compute weight gradients across multiple hidden layers.`,
            },
          ],
        },
      ],
    },
    {
      id: "spring-boot",
      title: "Spring Boot Fundamentals",
      instructor: "Rahul Verma",
      category: "Web Development",
      difficulty: "Intermediate",
      duration: "18h 20m",
      rating: 4.7,
      students: 27800,
      lessons: 5,
      match: 88,
      description:
        "Build production-grade REST APIs with Spring Boot, JPA, and security. The backend skills placements expect.",
      gradient: "from-emerald-500 to-green-600",
      tags: JSON.stringify(["Spring", "Backend", "REST"]),
      published: true,
      modules: [
        {
          title: "Module 1: Spring Framework Foundation",
          duration: "3h",
          order: 1,
          lessons: [
            {
              title: "Inversion of Control & Dependency Injection",
              duration: "30 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/9SGDpanrc8U",
              content: `# Inversion of Control (IoC)

Spring IoC container manages application object lifecycles and injects dependencies via annotations like @Autowired and @Component.`,
            },
            {
              title: "Building RESTful Controllers with Spring MVC",
              duration: "35 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/31KTdfRH6nY",
              content: `# RESTful Endpoints with @RestController

Map HTTP verbs (@GetMapping, @PostMapping) to Java handler methods and serialize payloads using Jackson.`,
            },
          ],
        },
        {
          title: "Module 2: Persistence, Security & Production",
          duration: "4h",
          order: 2,
          lessons: [
            {
              title: "Spring Data JPA, Entities & PostgreSQL",
              duration: "40 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/mSZANF2GwdY",
              content: `# Spring Data JPA

Define repository interfaces extending JpaRepository to get automated CRUD, pagination, and derived SQL queries without boilerplate.`,
            },
            {
              title: "Spring Security 6 & JWT Token Authentication",
              duration: "42 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/BVdQ3iqwpQk",
              content: `# Spring Security Architecture

Configure SecurityFilterChain with stateless JWT authentication filters, disabling default session cookies.`,
            },
            {
              title: "Packaging Microservices with Docker",
              duration: "35 min",
              order: 5,
              videoUrl: "https://www.youtube.com/embed/7V-fs53r2ao",
              content: `# Containerizing Spring Boot

Build multi-stage Dockerfiles utilizing Eclipse Temurin JRE images for minimal production container footprints.`,
            },
          ],
        },
      ],
    },
    {
      id: "sql-dev",
      title: "SQL for Developers",
      instructor: "Nina Patel",
      category: "Data Science",
      difficulty: "Beginner",
      duration: "9h 40m",
      rating: 4.5,
      students: 55300,
      lessons: 3,
      match: 79,
      description:
        "Master querying, joins, indexing, and database design with practical exercises on real datasets.",
      gradient: "from-amber-500 to-orange-600",
      tags: JSON.stringify(["SQL", "Databases", "Queries"]),
      published: true,
      modules: [
        {
          title: "Module 1: Relational Foundations & Queries",
          duration: "2h 30m",
          order: 1,
          lessons: [
            {
              title: "Relational Schema Design & Normalization",
              duration: "30 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
              content: `# Relational Modeling & 3NF

Normalize entity relationships into 1NF, 2NF, and 3NF to eliminate duplicate data and prevent insertion/update anomalies.`,
            },
            {
              title: "Mastering Multi-Table Joins & Aggregates",
              duration: "40 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/7S_tz1z_5bA",
              content: `# SQL Joins: INNER, LEFT, and FULL

Understand join mechanics, GROUP BY aggregate pipelines, and window functions (ROW_NUMBER, RANK).`,
            },
          ],
        },
        {
          title: "Module 2: Query Optimization & Indexing",
          duration: "2h",
          order: 2,
          lessons: [
            {
              title: "B-Tree Indexes & Execution Plans",
              duration: "35 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/clhyw_z0YI0",
              content: `# Database Indexing Under The Hood

Analyze EXPLAIN ANALYZE execution trees and replace Seq Scans with Index Scans using composite B-Tree indexes.`,
            },
          ],
        },
      ],
    },
    {
      id: "system-design",
      title: "System Design Basics",
      instructor: "Dr. Meera Nair",
      category: "Programming",
      difficulty: "Advanced",
      duration: "16h 15m",
      rating: 4.8,
      students: 21400,
      lessons: 4,
      match: 71,
      description:
        "Learn to design scalable systems: load balancing, caching, databases, and the trade-offs behind real architectures.",
      gradient: "from-slate-500 to-indigo-600",
      tags: JSON.stringify(["Scalability", "Architecture"]),
      published: true,
      modules: [
        {
          title: "Module 1: Distributed Architecture Fundamentals",
          duration: "3h",
          order: 1,
          lessons: [
            {
              title: "Scalability, Latency vs Throughput & CAP Theorem",
              duration: "35 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/m8Icp_Cid5o",
              content: `# High Scale Fundamentals

Design systems considering the CAP theorem trade-offs between Consistency, Availability, and Partition Tolerance.`,
            },
            {
              title: "Load Balancers, Reverse Proxies & DNS Routing",
              duration: "30 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/K0Ta65OqQkY",
              content: `# Traffic Management

Distribute incoming traffic across server fleets using Layer 4 (TCP) and Layer 7 (HTTP) load balancing algorithms.`,
            },
          ],
        },
        {
          title: "Module 2: Scalable Data & Case Studies",
          duration: "3h 30m",
          order: 2,
          lessons: [
            {
              title: "Distributed Caching with Redis & Cache Invalidation",
              duration: "38 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/qYhRvH9tJKw",
              content: `# Caching Architectures

Implement Cache-Aside, Write-Through, and Write-Behind patterns while preventing Cache Stampedes and Thundering Herds.`,
            },
            {
              title: "System Design Interview Case Study: TinyURL",
              duration: "45 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/fMZMm_0ZhK4",
              content: `# Real World Case Study: URL Shortener

Estimate read/write QPS, design Base62 encoding schemes, partition database ranges, and utilize distributed unique IDs.`,
            },
          ],
        },
      ],
    },
    {
      id: "python-master",
      title: "Python Masterclass",
      instructor: "Dr. Aditya Rao",
      category: "Programming",
      difficulty: "Beginner",
      duration: "22h 05m",
      rating: 4.7,
      students: 78900,
      lessons: 5,
      match: 74,
      description:
        "From syntax to real projects — a complete Python journey covering automation, data handling, and clean code.",
      gradient: "from-blue-500 to-cyan-600",
      tags: JSON.stringify(["Python", "Automation"]),
      published: true,
      modules: [
        {
          title: "Module 1: Modern Python Foundations",
          duration: "3h",
          order: 1,
          lessons: [
            {
              title: "Python 3.12 Core Syntax & Data Structures",
              duration: "35 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
              content: `# Python 3.12 Foundations

Deep dive into lists, dictionaries, sets, tuples, and memory references with garbage collection.`,
            },
            {
              title: "Object-Oriented Design & Magic Dunder Methods",
              duration: "32 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/JeznW_7DlB0",
              content: `# Python OOP & Dunders

Master __init__, __repr__, __str__, and custom operator overloading for expressive domain modeling.`,
            },
          ],
        },
        {
          title: "Module 2: Advanced Python & Automation",
          duration: "3h 45m",
          order: 2,
          lessons: [
            {
              title: "Generators, Iterators, and Custom Decorators",
              duration: "36 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
              content: `# Advanced Python Constructs

Write memory-efficient generator pipelines using 'yield' and compose function behavior with decorators.`,
            },
            {
              title: "Asynchronous Programming with Asyncio & Coroutines",
              duration: "40 min",
              order: 4,
              videoUrl: "https://www.youtube.com/embed/t5Bo1Je9EmE",
              content: `# Asyncio Event Loop

Run hundreds of concurrent network I/O operations without thread blocking using async/await syntax.`,
            },
            {
              title: "Building Automation Scripts & Web Scrapers",
              duration: "34 min",
              order: 5,
              videoUrl: "https://www.youtube.com/embed/XVv6mJpFOb0",
              content: `# Automation & Web Scraping

Automate repetitive workflows, parse web data with BeautifulSoup, and generate structured CSV/JSON outputs.`,
            },
          ],
        },
      ],
    },
    {
      id: "cyber-intro",
      title: "Cybersecurity Essentials",
      instructor: "Marcus Lee",
      category: "Cybersecurity",
      difficulty: "Beginner",
      duration: "14h 30m",
      rating: 4.4,
      students: 18600,
      lessons: 3,
      match: 62,
      description:
        "Understand threats, encryption, network security, and how to think like both attacker and defender.",
      gradient: "from-red-500 to-rose-600",
      tags: JSON.stringify(["Security", "Networking"]),
      published: true,
      modules: [
        {
          title: "Module 1: Threat Landscape & Cryptography",
          duration: "2h 30m",
          order: 1,
          lessons: [
            {
              title: "Threat Vectors, Social Engineering & Phishing",
              duration: "30 min",
              order: 1,
              videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA",
              content: `# Security Fundamentals

Understand attacker mindsets, attack surfaces, malware categories, and social engineering mitigation.`,
            },
            {
              title: "Symmetric vs Asymmetric Encryption & PKI",
              duration: "36 min",
              order: 2,
              videoUrl: "https://www.youtube.com/embed/jhXCTbFnK8o",
              content: `# Modern Cryptography

How AES-256 and RSA-4096 work together in TLS handshakes to ensure end-to-end data secrecy and integrity.`,
            },
          ],
        },
        {
          title: "Module 2: Network & Cloud Defense",
          duration: "2h",
          order: 2,
          lessons: [
            {
              title: "Network Security, Firewalls & Zero Trust Architecture",
              duration: "40 min",
              order: 3,
              videoUrl: "https://www.youtube.com/embed/2_lswM1S264",
              content: `# Network Defense & Zero Trust

Shift security postures from perimeter-based firewalls to continuous identity verification under Zero Trust principles.`,
            },
          ],
        },
      ],
    },
  ]

  for (const c of coursesData) {
    const { modules, ...courseFields } = c
    const course = await prisma.course.upsert({
      where: { id: c.id },
      update: { ...courseFields },
      create: { ...courseFields },
    })

    // Delete existing modules to ensure clean, non-duplicated reload
    await prisma.module.deleteMany({
      where: { courseId: course.id },
    })

    if (modules && modules.length > 0) {
      for (const m of modules) {
        const { lessons, ...moduleFields } = m
        const mod = await prisma.module.create({
          data: {
            courseId: course.id,
            ...moduleFields,
          },
        })

        for (const l of lessons) {
          await prisma.lesson.create({
            data: {
              moduleId: mod.id,
              courseId: course.id,
              ...l,
            },
          })
        }
      }
    }
  }

  console.log("Courses and lessons seeded.")

  // 4. Enrollments & Progress for Demo Student
  const dsaEnrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: "dsa-java",
      },
    },
    update: { progress: 45, status: "IN_PROGRESS" },
    create: {
      userId: student.id,
      courseId: "dsa-java",
      progress: 45,
      status: "IN_PROGRESS",
    },
  })

  const javaCollectionsEnrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: "java-collections",
      },
    },
    update: { progress: 70, status: "IN_PROGRESS" },
    create: {
      userId: student.id,
      courseId: "java-collections",
      progress: 70,
      status: "IN_PROGRESS",
    },
  })

  const reactEnrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: "react-guide",
      },
    },
    update: { progress: 25, status: "IN_PROGRESS" },
    create: {
      userId: student.id,
      courseId: "react-guide",
      progress: 25,
      status: "IN_PROGRESS",
    },
  })

  // 5. Mark First Two Lessons of DSA as Completed for student
  const dsaLessons = await prisma.lesson.findMany({
    where: { courseId: "dsa-java" },
    take: 2,
  })

  for (const l of dsaLessons) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: student.id,
          lessonId: l.id,
        },
      },
      update: { completed: true },
      create: {
        userId: student.id,
        lessonId: l.id,
        courseId: "dsa-java",
        completed: true,
      },
    })
  }

  // 6. Quizzes
  const quiz = await prisma.quiz.upsert({
    where: { id: "dsa-assessment-1" },
    update: {
      title: "Data Structures Assessment",
      topic: "Data Structures & Algorithms",
      passingScore: 70,
    },
    create: {
      id: "dsa-assessment-1",
      title: "Data Structures Assessment",
      topic: "Data Structures & Algorithms",
      description: "Test your understanding of core data structures, Big-O complexities, trees, and graphs.",
      passingScore: 70,
    },
  })

  // Clear and add questions
  await prisma.quizQuestion.deleteMany({ where: { quizId: quiz.id } })

  const questions = [
    {
      topic: "Searching",
      question: "What is the time complexity of binary search on a sorted array?",
      options: JSON.stringify(["O(n)", "O(log n)", "O(n log n)", "O(1)"]),
      answer: 1,
      explanation: "Binary search cuts the search space in half each iteration, giving logarithmic time O(log n).",
    },
    {
      topic: "Arrays",
      question: "Which operation is O(1) amortized on a dynamic array (ArrayList)?",
      options: JSON.stringify(["Insert at beginning", "Append at end", "Delete at index", "Search by value"]),
      answer: 1,
      explanation: "Appending to the end is O(1) amortized because array resizing only occurs occasionally.",
    },
    {
      topic: "Linked Lists",
      question: "What is the main advantage of a linked list over an array?",
      options: JSON.stringify([
        "Constant time random access",
        "Better cache locality",
        "Efficient insertion and deletion without shifting elements",
        "Lower memory usage",
      ]),
      answer: 2,
      explanation: "Linked lists can insert or remove nodes by pointer mutation without shifting all subsequent items.",
    },
    {
      topic: "Stacks",
      question: "Which data structure follows the LIFO (Last-In First-Out) principle?",
      options: JSON.stringify(["Queue", "Stack", "Heap", "Tree"]),
      answer: 1,
      explanation: "Stacks strictly follow LIFO order: the last element pushed is the first one popped.",
    },
    {
      topic: "Trees",
      question: "In a binary search tree, an in-order traversal visits nodes in what order?",
      options: JSON.stringify(["Random order", "Descending order", "Ascending sorted order", "Level order"]),
      answer: 2,
      explanation: "In-order traversal visits (Left, Root, Right), which for any valid BST outputs items in sorted ascending order.",
    },
    {
      topic: "Trees",
      question: "What is the height of a balanced binary tree with n nodes?",
      options: JSON.stringify(["O(n)", "O(log n)", "O(n log n)", "O(1)"]),
      answer: 1,
      explanation: "A balanced binary tree partitions nodes evenly, maintaining height proportional to log2(n).",
    },
    {
      topic: "Graphs",
      question: "Which algorithm finds the shortest path in an unweighted graph?",
      options: JSON.stringify(["DFS", "BFS", "Prim's Algorithm", "Kruskal's Algorithm"]),
      answer: 1,
      explanation: "Breadth-First Search (BFS) explores nodes layer-by-layer, guaranteeing the fewest edge transitions.",
    },
    {
      topic: "Graphs",
      question: "What data structure does Dijkstra's algorithm typically use for minimum distance extraction?",
      options: JSON.stringify(["Stack", "Queue", "Priority Queue (Min-Heap)", "Hash Map"]),
      answer: 2,
      explanation: "A Priority Queue extracts the next minimum distance vertex in O(log V) time.",
    },
    {
      topic: "Hashing",
      question: "What is the average time complexity of a hash table lookup?",
      options: JSON.stringify(["O(1)", "O(log n)", "O(n)", "O(n log n)"]),
      answer: 0,
      explanation: "With a uniform hash function and minimal collisions, hash table lookups take constant O(1) time.",
    },
    {
      topic: "Sorting",
      question: "Which sorting algorithm achieves O(n log n) average-case time complexity?",
      options: JSON.stringify(["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"]),
      answer: 2,
      explanation: "Quick Sort partitions elements around pivots, achieving O(n log n) average performance.",
    },
  ]

  for (const q of questions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        ...q,
      },
    })
  }

  // Additional Quiz 2: React & Frontend Architecture
  const webQuiz = await prisma.quiz.upsert({
    where: { id: "web-dev-assessment-1" },
    update: {
      title: "React & Modern Web Architecture",
      topic: "Web Development",
      passingScore: 70,
    },
    create: {
      id: "web-dev-assessment-1",
      title: "React & Modern Web Architecture",
      topic: "Web Development",
      description: "Evaluate your proficiency in React 19, state management, reconciliation, and modern frontend design.",
      passingScore: 70,
    },
  })
  await prisma.quizQuestion.deleteMany({ where: { quizId: webQuiz.id } })

  const webQuestions = [
    {
      topic: "React Hooks",
      question: "Which React hook is designed to memoize the computed result of an expensive calculation?",
      options: JSON.stringify(["useEffect", "useMemo", "useCallback", "useRef"]),
      answer: 1,
      explanation: "useMemo caches the result of a computation between renders until its dependencies change.",
    },
    {
      topic: "Virtual DOM",
      question: "What is the primary role of the 'key' prop when rendering lists in React?",
      options: JSON.stringify(["Styling list elements", "Helping React reconcile which items were added, changed, or removed", "Assigning HTML IDs", "Binding click handlers"]),
      answer: 1,
      explanation: "Keys give elements a stable identity so React's diffing algorithm can accurately reuse existing DOM nodes.",
    },
    {
      topic: "Component Lifecycle",
      question: "When does the cleanup function returned from a useEffect hook execute?",
      options: JSON.stringify(["Only on initial mount", "Before the effect runs again and when the component unmounts", "Whenever props stay identical", "Never in production"]),
      answer: 1,
      explanation: "Cleanup functions execute before re-running the effect with new dependencies and when the component unmounts.",
    },
    {
      topic: "State Management",
      question: "What principle ensures state updates in React trigger predictable re-renders?",
      options: JSON.stringify(["Direct state mutation", "State immutability", "Synchronous DOM manipulation", "Global window assignment"]),
      answer: 1,
      explanation: "State in React must be treated as immutable; replacing state objects allows shallow comparison to detect changes.",
    },
    {
      topic: "Performance",
      question: "What technique delays loading non-critical JavaScript code until needed?",
      options: JSON.stringify(["Code Splitting & Lazy Loading", "Server Polling", "Inline CSS", "Recursive Rendering"]),
      answer: 0,
      explanation: "Code splitting with React.lazy and dynamic imports downloads JS bundles on-demand, speeding up initial page load.",
    },
  ]

  for (const q of webQuestions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: webQuiz.id,
        ...q,
      },
    })
  }

  // Additional Quiz 3: Java Collections & OOP
  const oopQuiz = await prisma.quiz.upsert({
    where: { id: "java-oop-assessment-1" },
    update: {
      title: "Java Collections & OOP Engineering",
      topic: "Object-Oriented Programming",
      passingScore: 70,
    },
    create: {
      id: "java-oop-assessment-1",
      title: "Java Collections & OOP Engineering",
      topic: "Object-Oriented Programming",
      description: "Master polymorphism, inheritance, generics, and Java collections framework internals.",
      passingScore: 70,
    },
  })
  await prisma.quizQuestion.deleteMany({ where: { quizId: oopQuiz.id } })

  const oopQuestions = [
    {
      topic: "OOP Principles",
      question: "Which OOP principle allows a subclass to provide a specific implementation of a method defined in its superclass?",
      options: JSON.stringify(["Encapsulation", "Polymorphism (Method Overriding)", "Abstraction", "Composition"]),
      answer: 1,
      explanation: "Polymorphism enables runtime dynamic dispatch so subclasses can override superclass behavior.",
    },
    {
      topic: "Collections",
      question: "Which Java collection preserves the insertion order of elements while preventing duplicate entries?",
      options: JSON.stringify(["HashSet", "LinkedHashSet", "TreeSet", "Vector"]),
      answer: 1,
      explanation: "LinkedHashSet maintains a doubly-linked list through all of its elements to ensure deterministic insertion order.",
    },
    {
      topic: "Memory & References",
      question: "Where are Java object instances allocated in the JVM memory layout?",
      options: JSON.stringify(["Call Stack", "Heap Memory", "Program Counter Register", "Native Method Stack"]),
      answer: 1,
      explanation: "All object instances in Java reside on the Heap and are managed by the Garbage Collector.",
    },
    {
      topic: "Concurrency",
      question: "Which thread-safe Map implementation uses bucket-level locking for superior write concurrency?",
      options: JSON.stringify(["Hashtable", "Collections.synchronizedMap", "ConcurrentHashMap", "TreeMap"]),
      answer: 2,
      explanation: "ConcurrentHashMap uses segmented lock-free reads and CAS bucket locks rather than synchronizing the entire table.",
    },
  ]

  for (const q of oopQuestions) {
    await prisma.quizQuestion.create({
      data: {
        quizId: oopQuiz.id,
        ...q,
      },
    })
  }

  // 7. Initial Quiz Attempt for Student
  await prisma.quizAttempt.create({
    data: {
      userId: student.id,
      quizId: quiz.id,
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      passed: true,
      answers: JSON.stringify({ "0": 1, "1": 1, "2": 2, "3": 1, "4": 2, "5": 1, "6": 1, "7": 2, "8": 0, "9": 0 }),
      topicScores: JSON.stringify([
        { topic: "Arrays", score: 90 },
        { topic: "Linked Lists", score: 85 },
        { topic: "Trees", score: 50 },
        { topic: "Graphs", score: 40 },
      ]),
      feedback: "Great performance in Arrays and Linked Lists. However, you should focus on Tree traversal and Graph algorithms before moving to advanced topics.",
    },
  })

  // 8. Study Tasks
  await prisma.studyTask.deleteMany({ where: { userId: student.id } })
  const tasks = [
    { day: "Monday", title: "Complete Java Collections Module", duration: "45 min", done: true },
    { day: "Monday", title: "Solve 3 Linked List Problems", duration: "30 min", done: false },
    { day: "Tuesday", title: "Learn Binary Trees", duration: "45 min", done: false },
    { day: "Tuesday", title: "Practice Tree Traversal", duration: "30 min", done: false },
    { day: "Wednesday", title: "Revision of Recursion", duration: "40 min", done: false },
    { day: "Wednesday", title: "Take Skill Quiz", duration: "20 min", done: false },
    { day: "Thursday", title: "Graph Algorithms Intro", duration: "50 min", done: false },
    { day: "Friday", title: "Solve 5 Array Problems", duration: "45 min", done: false },
    { day: "Saturday", title: "Spring Boot Basics", duration: "60 min", done: false },
    { day: "Sunday", title: "Weekly Review & Rest", duration: "30 min", done: false },
  ]

  for (const t of tasks) {
    await prisma.studyTask.create({
      data: {
        userId: student.id,
        ...t,
      },
    })
  }

  // 9. Bookmarks
  await prisma.bookmark.upsert({
    where: { userId_courseId: { userId: student.id, courseId: "dsa-java" } },
    update: {},
    create: { userId: student.id, courseId: "dsa-java" },
  })

  await prisma.bookmark.upsert({
    where: { userId_courseId: { userId: student.id, courseId: "system-design" } },
    update: {},
    create: { userId: student.id, courseId: "system-design" },
  })

  // 10. Notifications
  await prisma.notification.deleteMany({ where: { userId: student.id } })
  const notifications = [
    {
      title: "Welcome to LearnWise!",
      message: "Start by exploring your personalized learning path or take the Data Structures assessment.",
      type: "info",
      read: false,
    },
    {
      title: "12-Day Streak Achieved! 🔥",
      message: "You've been studying consistently for 12 days. You're in the top 5% of active learners!",
      type: "milestone",
      read: false,
    },
    {
      title: "New Quiz Available",
      message: "A new smart quiz on Trees & Graphs has been generated for your study plan.",
      type: "alert",
      read: true,
    },
  ]

  for (const n of notifications) {
    await prisma.notification.create({
      data: {
        userId: student.id,
        ...n,
      },
    })
  }

  // 11. Course Reviews
  await prisma.courseReview.deleteMany({ where: { courseId: "dsa-java" } })
  const reviews = [
    {
      userId: student.id,
      courseId: "dsa-java",
      rating: 5,
      comment: "Dr. Meera explains every pointer transition so clearly. Cracked my interview rounds thanks to this course!",
    },
  ]

  for (const r of reviews) {
    await prisma.courseReview.create({
      data: r,
    })
  }

  console.log("Database seeded successfully with realistic data!")
}

runSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
