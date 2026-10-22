import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"

const knowledgeBase: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["next", "learn next", "what should", "recommend"],
    answer:
      "Based on your current learning profile and your latest quiz diagnostics, I recommend focusing on Trees and Graphs next. These represent your biggest skill gap (currently 40-50% accuracy on quiz attempts) and are high-frequency topics in technical interviews. Start with binary tree depth-first traversals, then move to Breadth-First Search (BFS) on unweighted graphs.",
  },
  {
    keywords: ["linked list", "linked lists", "pointers"],
    answer:
      "Think of a linked list as a scavenger hunt: each node holds a data value and a pointer (the clue) to the address of the next node. Unlike contiguous arrays, linked lists can insert or remove nodes in O(1) time without shifting all following elements, but indexing takes O(n) linear time because you must follow the pointer chain.",
  },
  {
    keywords: ["7-day", "7 day", "study plan", "schedule", "routine"],
    answer:
      "Here is your targeted 7-Day Interview Prep Study Plan:\n\n• Day 1–2: Binary Tree Traversals (Pre-order, In-order, Post-order) + Invert Tree\n• Day 3: Binary Search Tree validation & Lowest Common Ancestor (LCA)\n• Day 4: Heaps & Priority Queues (Top K Frequent Elements)\n• Day 5: Graph Representation (Adjacency List) & BFS Shortest Path\n• Day 6: DFS Cycle Detection & Topological Sort\n• Day 7: Mixed LeetCode medium problems + LearnWise Diagnostic Quiz.\n\nDedicate ~1.5 hours daily with 2-3 focused coding problems.",
  },
  {
    keywords: ["why", "recommended this course", "dsa-java"],
    answer:
      "The 'Master Data Structures in Java' course was recommended because it aligns with your primary career goal (Software Engineering Internship, 94% match), directly bridges your gaps in graph traversals, and matches your hands-on coding preference.",
  },
  {
    keywords: ["dsa", "improve", "algorithm", "practice"],
    answer:
      "To systematically level up your DSA intuition:\n1. Solve by pattern rather than random difficulty (Two Pointers, Sliding Window, Monotonic Stack, Backtracking, Fast & Slow Pointers).\n2. Implement core data structures from scratch in Java once (Custom LinkedList, MinHeap, BST).\n3. Review your LearnWise assessment scores: you are strongest in Arrays (90%) and need active practice in Graphs (40%). Consistency beats cramming!",
  },
  {
    keywords: ["spring", "spring boot", "backend", "api"],
    answer:
      "Spring Boot is the premier Java backend framework for enterprise engineering. Key concepts to master:\n1. Dependency Injection (IoC Container)\n2. Spring MVC Controller routing (@RestController, @GetMapping, @PostMapping)\n3. Spring Data JPA for database queries with Hibernate ORM\n4. Spring Security for JWT authentication and role-based access control.",
  },
]

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 })
    }

    const lower = message.toLowerCase()
    const matched = knowledgeBase.find((k) =>
      k.keywords.some((kw) => lower.includes(kw))
    )

    let reply = ""
    if (matched) {
      reply = matched.answer
    } else {
      reply = `That is an excellent engineering question! Based on your profile (${user?.name || "Student"} • ${user?.goal || "Software Engineering"}), I recommend reviewing our Data Structures module on Trees & Graphs, or checking your personalized Study Plan for today. Would you like me to generate a specific code example or quiz problem on this topic?`
    }

    return NextResponse.json({
      success: true,
      reply,
    })
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 })
  }
}
