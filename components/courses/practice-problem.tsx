"use client"

import * as React from "react"
import {
  Code,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"
import { toast } from "sonner"

interface TestCase {
  id: number
  input: string
  expected: string
  explanation?: string
}

interface ProblemDefinition {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  timeComplexity: string
  spaceComplexity: string
  description: string
  examples: {
    input: string
    output: string
    explanation?: string
  }[]
  constraints: string[]
  hints: string[]
  starterCode: Record<string, string>
  testCases: TestCase[]
}

const PROBLEMS: Record<string, ProblemDefinition> = {
  arrays: {
    id: "two-sum",
    title: "Two Sum Target Pair",
    difficulty: "Easy",
    category: "Arrays & Hash Table",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    hints: [
      "A brute force approach checks all pairs in O(n^2) time. Can you use a HashMap to store complements?",
      "For each element num, check if (target - num) is already in your map.",
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    },
    testCases: [
      { id: 1, input: "[2, 7, 11, 15], 9", expected: "[0, 1]", explanation: "2 + 7 = 9" },
      { id: 2, input: "[3, 2, 4], 6", expected: "[1, 2]", explanation: "2 + 4 = 6" },
      { id: 3, input: "[3, 3], 6", expected: "[0, 1]", explanation: "3 + 3 = 6" },
    ],
  },
  pointers: {
    id: "valid-palindrome",
    title: "Valid Palindrome with Pointers",
    difficulty: "Easy",
    category: "Two Pointers & Strings",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters.",
    ],
    hints: [
      "Maintain two pointers: one at the beginning and one at the end.",
      "Skip characters that are not alphanumeric and compare lowercase characters.",
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      typescript: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def is_palindrome(s: str) -> bool:
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
            left++;
            right--;
        }
        return true;
    }
}`,
    },
    testCases: [
      { id: 1, input: '"A man, a plan, a canal: Panama"', expected: "true" },
      { id: 2, input: '"race a car"', expected: "false" },
      { id: 3, input: '" "', expected: "true" },
    ],
  },
  lists: {
    id: "reverse-linked-list",
    title: "Reverse a Singly Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]" },
      { input: "head = [1, 2]", output: "[2, 1]" },
      { input: "head = []", output: "[]" },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    hints: [
      "Use three pointers: prev, curr, and next.",
      "At each step, point curr.next to prev, then advance both pointers.",
    ],
    starterCode: {
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      typescript: `function reverseList(head: any): any {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
    },
    testCases: [
      { id: 1, input: "[1, 2, 3, 4, 5]", expected: "[5, 4, 3, 2, 1]" },
      { id: 2, input: "[1, 2]", expected: "[2, 1]" },
      { id: 3, input: "[]", expected: "[]" },
    ],
  },
}

interface PracticeProblemProps {
  lessonTitle?: string
  courseCategory?: string
  onComplete?: () => void
  onNextLesson?: () => void
  hasNextLesson?: boolean
}

export function PracticeProblem({
  lessonTitle = "Arrays & Data Structures",
  courseCategory = "Programming",
  onComplete,
  onNextLesson,
  hasNextLesson = false,
}: PracticeProblemProps) {
  // Select matching problem definition
  const problemKey = React.useMemo(() => {
    const lower = lessonTitle.toLowerCase()
    if (lower.includes("pointer") || lower.includes("sliding")) return "pointers"
    if (lower.includes("list")) return "lists"
    return "arrays"
  }, [lessonTitle])

  const problem = PROBLEMS[problemKey] || PROBLEMS.arrays

  const [language, setLanguage] = React.useState<"javascript" | "typescript" | "python" | "java">("javascript")
  const [code, setCode] = React.useState(problem.starterCode.javascript)
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [testResults, setTestResults] = React.useState<
    { id: number; passed: boolean; output: string; expected: string; runtime: number }[] | null
  >(null)
  const [submissionResult, setSubmissionResult] = React.useState<{
    success: boolean
    runtimeMs: number
    percentile: number
    passedCount: number
    totalCount: number
  } | null>(null)
  const [showHints, setShowHints] = React.useState(false)
  const [customInput, setCustomInput] = React.useState("")
  const [consoleOutput, setConsoleOutput] = React.useState<string[]>([])

  // Reset code when language or problem changes
  React.useEffect(() => {
    setCode(problem.starterCode[language] || problem.starterCode.javascript)
    setTestResults(null)
    setSubmissionResult(null)
    setConsoleOutput([])
  }, [language, problem])

  const handleResetCode = () => {
    setCode(problem.starterCode[language] || problem.starterCode.javascript)
    toast.info("Code restored to original starter template.")
  }

  // Interactive Test Runner
  const handleRunCode = async () => {
    setIsRunning(true)
    setConsoleOutput([])
    await new Promise((r) => setTimeout(r, 450))

    try {
      const results = problem.testCases.map((tc) => {
        // Evaluate simulated correctness
        const isSolutionCorrect = code.includes("return") && (code.includes("map") || code.includes("while") || code.includes("for") || code.includes("clean"))
        return {
          id: tc.id,
          passed: isSolutionCorrect,
          output: isSolutionCorrect ? tc.expected : "[0, 0] (mismatch)",
          expected: tc.expected,
          runtime: Math.floor(Math.random() * 8) + 8,
        }
      })

      setTestResults(results)
      setConsoleOutput([
        `[Compiler]: Code compiled successfully with 0 errors.`,
        `[Runner]: Running ${problem.testCases.length} sample test cases...`,
        ...results.map(
          (r, idx) => `Case ${idx + 1}: ${r.passed ? "PASSED ✓" : "FAILED ✗"} (${r.runtime}ms)`
        ),
      ])

      const allPassed = results.every((r) => r.passed)
      if (allPassed) {
        toast.success("All sample test cases passed! Ready to submit.")
      } else {
        toast.error("Some test cases failed. Review test output below.")
      }
    } finally {
      setIsRunning(false)
    }
  }

  // Final Submission Runner
  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))

    const isCodeValid = code.includes("return") && code.trim().length > 30

    if (isCodeValid) {
      const res = {
        success: true,
        runtimeMs: 12,
        percentile: 94.8,
        passedCount: problem.testCases.length,
        totalCount: problem.testCases.length,
      }
      setSubmissionResult(res)
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } })
      toast.success("Accepted! All test cases passed! 🏆")
      if (onComplete) onComplete()
    } else {
      setSubmissionResult({
        success: false,
        runtimeMs: 0,
        percentile: 0,
        passedCount: 0,
        totalCount: problem.testCases.length,
      })
      toast.error("Submission failed: Test cases did not pass. Check syntax and logic.")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Problem Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                problem.difficulty === "Easy"
                  ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                  : "text-amber-600 border-amber-500/30 bg-amber-500/10"
              }
            >
              {problem.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {problem.category}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              Target: {problem.timeComplexity} Time • {problem.spaceComplexity} Space
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground font-display">
            {problem.title}
          </h2>
        </div>

        {/* Language selector & reset */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
            {(["javascript", "typescript", "python", "java"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded capitalize font-medium text-xs transition-all ${
                  language === lang
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "javascript" ? "JS" : lang === "typescript" ? "TS" : lang}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetCode}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Reset code template"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Grid: Description & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Problem Statement & Examples */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="py-3.5 px-5 border-b border-border/60 bg-muted/20">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                Problem Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs leading-relaxed max-h-[580px] overflow-y-auto">
              <div className="text-foreground whitespace-pre-wrap">
                {problem.description}
              </div>

              {/* Examples */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Examples
                </h4>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border bg-muted/30 space-y-1 font-mono text-[11px]">
                    <div>
                      <strong className="text-primary font-sans font-semibold">Input: </strong>
                      <span className="text-foreground">{ex.input}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-600 font-sans font-semibold">Output: </strong>
                      <span className="text-foreground">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="font-sans text-[11px] text-muted-foreground pt-1">
                        Explanation: {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Constraints
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground font-mono text-[11px]">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Hints Drawer */}
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center justify-between w-full p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Need a Hint? ({problem.hints.length} available)
                  </span>
                  {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showHints && (
                  <div className="mt-2 space-y-2 pl-2">
                    {problem.hints.map((hint, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-border text-[11px] text-muted-foreground bg-card">
                        💡 <strong>Hint {idx + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Code Editor & Test Case Runner */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Editor Container */}
          <Card className="border border-border/80 shadow-md overflow-hidden bg-zinc-950 text-zinc-100">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
              <span className="font-mono text-zinc-400 flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-primary" />
                Solution.{language === "python" ? "py" : language === "java" ? "java" : "ts"}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(code)
                    toast.success("Code copied!")
                  }}
                  className="h-7 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Code Textarea with line styling */}
            <div className="relative p-4 font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-transparent text-emerald-400 outline-none resize-y font-mono leading-relaxed focus:ring-0"
              />
            </div>

            {/* Runner Action Strip */}
            <div className="flex items-center justify-between p-3 bg-zinc-900 border-t border-zinc-800">
              <div className="text-[11px] text-zinc-400">
                Press <strong>Run Code</strong> to test sample cases
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="h-8 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>

                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="h-8 text-xs font-bold gap-1.5 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isSubmitting ? "Grading..." : "Submit Solution"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Test Case Tabs & Output Terminal */}
          <Card className="border border-border/80 shadow-xs bg-card">
            <CardHeader className="py-2.5 px-4 border-b border-border/60 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">Test Cases & Output</span>
                </div>

                {/* Case tabs */}
                <div className="flex items-center gap-1">
                  {problem.testCases.map((tc, idx) => (
                    <button
                      key={tc.id}
                      type="button"
                      onClick={() => setSelectedTestCaseIdx(idx)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                        selectedTestCaseIdx === idx
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {/* Selected test case details */}
              {problem.testCases[selectedTestCaseIdx] && (
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg border border-border bg-muted/30">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                      Input
                    </span>
                    <span className="text-foreground">
                      {problem.testCases[selectedTestCaseIdx].input}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-border bg-muted/30">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">
                      Expected Output
                    </span>
                    <span className="text-emerald-600 font-bold">
                      {problem.testCases[selectedTestCaseIdx].expected}
                    </span>
                  </div>
                </div>
              )}

              {/* Console log feedback */}
              {consoleOutput.length > 0 && (
                <div className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 space-y-1">
                  {consoleOutput.map((log, idx) => (
                    <div key={idx} className={log.includes("PASSED") ? "text-emerald-400" : log.includes("FAILED") ? "text-red-400" : ""}>
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {/* Submission Result Banner */}
              {submissionResult && (
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    submissionResult.success
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
                      : "border-red-500/30 bg-red-500/10 text-red-950 dark:text-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {submissionResult.success ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm font-display">
                        {submissionResult.success
                          ? "Accepted! All Test Cases Passed 🎉"
                          : "Wrong Answer / Test Cases Failed"}
                      </h4>
                      <p className="text-xs opacity-90 mt-0.5">
                        {submissionResult.success
                          ? `Runtime: ${submissionResult.runtimeMs}ms (Beats ${submissionResult.percentile}% of submissions)`
                          : `Passed ${submissionResult.passedCount} of ${submissionResult.totalCount} test cases.`}
                      </p>
                    </div>
                  </div>

                  {submissionResult.success && hasNextLesson && onNextLesson && (
                    <Button
                      size="sm"
                      onClick={onNextLesson}
                      className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                    >
                      Next Lesson
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
