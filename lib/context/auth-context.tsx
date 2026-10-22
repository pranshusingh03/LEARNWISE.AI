"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { SafeUser } from "@/lib/auth"

interface AuthContextType {
  user: SafeUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string; goal?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (data: Partial<SafeUser>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.get<{ user: SafeUser | null }>("/api/auth/me")
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ user: SafeUser }>("/api/auth/login", { email, password })
      setUser(res.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed" }
    }
  }

  const register = async (data: { name: string; email: string; password: string; goal?: string }) => {
    try {
      const res = await api.post<{ user: SafeUser }>("/api/auth/register", data)
      setUser(res.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || "Registration failed" }
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
    } catch {
      // Continue cleanup anyway
    } finally {
      setUser(null)
      router.push("/login")
      router.refresh()
    }
  }

  const updateProfile = async (data: Partial<SafeUser>) => {
    try {
      const res = await api.put<{ user: SafeUser }>("/api/auth/me", data)
      setUser(res.user)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || "Update failed" }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
