import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import type { NextRequest, NextResponse } from "next/server"
import prisma from "./db.ts"

const JWT_SECRET_STRING = process.env.JWT_SECRET || "learnwise-super-secret-jwt-key-production-ready-2026"
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING)
export const TOKEN_COOKIE_NAME = "learnwise_token"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name: string
}

export interface SafeUser {
  id: string
  name: string
  email: string
  role: string
  goal: string | null
  avatar: string | null
  skillLevel: string | null
  learningStyle: string | null
  weeklyTime: string | null
  bio: string | null
  createdAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<SafeUser | null> {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value

    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload?.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        goal: true,
        avatar: true,
        skillLevel: true,
        learningStyle: true,
        weeklyTime: true,
        bio: true,
        createdAt: true,
      },
    })

    return user
  } catch {
    return null
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<SafeUser | null> {
  try {
    // 1. Check Bearer Authorization header
    const authHeader = request.headers.get("authorization")
    let token: string | undefined

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    } else {
      // 2. Check Cookie
      token = request.cookies.get(TOKEN_COOKIE_NAME)?.value
    }

    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload?.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        goal: true,
        avatar: true,
        skillLevel: true,
        learningStyle: true,
        weeklyTime: true,
        bio: true,
        createdAt: true,
      },
    })

    return user
  } catch {
    return null
  }
}

export function setTokenCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function removeTokenCookie(response: NextResponse) {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
