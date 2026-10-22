import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/lib/context/auth-context"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "LearnWise — AI-Powered Full-Stack Learning Platform",
  description:
    "Master Data Structures, Web Development, Cloud, and AI with personalized learning paths, diagnostic quizzes, and real-time progress tracking.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
