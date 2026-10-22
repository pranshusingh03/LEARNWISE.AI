"use client"

import * as React from "react"
import { Bot, User, Send, Sparkles, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api-client"
import { useAuth } from "@/lib/context/auth-context"

interface ChatMessage {
  id: string
  role: "assistant" | "user"
  content: string
}

export default function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      content: `Hi ${
        user?.name || "Arpita"
      }! I'm your LearnWise AI Assistant. I can help guide your curriculum, clarify tough data structure concepts with simple analogies, or build targeted study plans. What would you like to explore today?`,
    },
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const suggestedQuestions = [
    "What should I learn next?",
    "Explain Linked Lists simply",
    "Create a 7-day study plan",
    "Why was this course recommended?",
    "Help me improve my DSA skills",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput("")
    setIsLoading(true)

    try {
      const res = await api.post<{ success: boolean; reply: string }>("/api/assistant", {
        message: text.trim(),
      })

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: res.reply,
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content:
          "I had trouble connecting to the knowledge service. Please try asking again in a moment.",
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-semibold gap-1">
            <Bot className="h-3.5 w-3.5" />
            AI Learning Tutor
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">
            24/7 technical concept assistance
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mt-1 font-display">
          AI Technical Mentor
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask questions about algorithm implementations, get analogies for complex computer science topics, or generate personalized schedules.
        </p>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Area Card */}
      <Card className="border border-border/80 shadow-md flex flex-col h-[560px]">
        {/* Messages List */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user"
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                      : "bg-muted/50 border border-border text-foreground rounded-tl-xs"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-2xl mr-auto">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl p-4 text-xs bg-muted/50 border border-border flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Bar */}
        <CardFooter className="p-3 sm:p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2 w-full"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Explain binary tree vs BST' or 'How do I optimize BFS?')..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl border border-input bg-muted/30 px-4 text-xs sm:text-sm placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
