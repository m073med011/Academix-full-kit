import { cookies } from "next/headers"

// Cookie configuration
const ACCESS_TOKEN_COOKIE = "lms_access_token"
const REFRESH_TOKEN_COOKIE = "lms_refresh_token"
const USER_DATA_COOKIE = "lms_user_data"

// Token expiration times (in seconds)
const ACCESS_TOKEN_MAX_AGE = 150 * 60 // 150 minutes (matching backend)
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

// Server-side token management (for API routes and server components)
export const serverTokenService = {
  async setTokens(
    accessToken: string,
    refreshToken: string,
    userData?: Record<string, unknown>
  ): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    })

    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    })

    if (userData) {
      cookieStore.set(USER_DATA_COOKIE, JSON.stringify(userData), {
        ...cookieOptions,
        httpOnly: false, // Allow client-side access for user data
        maxAge: REFRESH_TOKEN_MAX_AGE,
      })
    }
  },

  async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null
  },

  async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null
  },

  async getUserData(): Promise<Record<string, unknown> | null> {
    const cookieStore = await cookies()
    const userData = cookieStore.get(USER_DATA_COOKIE)?.value

    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  },

  async clearTokens(): Promise<void> {
    const cookieStore = await cookies()

    cookieStore.delete(ACCESS_TOKEN_COOKIE)
    cookieStore.delete(REFRESH_TOKEN_COOKIE)
    cookieStore.delete(USER_DATA_COOKIE)
  },

  async hasValidTokens(): Promise<boolean> {
    const accessToken = await this.getAccessToken()
    const refreshToken = await this.getRefreshToken()
    return !!accessToken && !!refreshToken
  },

  async refreshAccessToken(): Promise<{
    success: boolean
    accessToken?: string
    refreshToken?: string
  }> {
    const refreshToken = await this.getRefreshToken()

    if (!refreshToken) {
      return { success: false }
    }

    const API_URL = process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        await this.clearTokens()
        return { success: false }
      }

      const data = await response.json()

      if (data.success && data.data?.accessToken && data.data?.refreshToken) {
        await this.setTokens(data.data.accessToken, data.data.refreshToken)
        return {
          success: true,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        }
      }

      await this.clearTokens()
      return { success: false }
    } catch {
      await this.clearTokens()
      return { success: false }
    }
  },
}

// Parse JWT token without verification (for extracting user info)
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = parts[1]
    const decoded = Buffer.from(payload, "base64").toString("utf-8")
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

// Check if JWT token is expired
export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload || typeof payload.exp !== "number") return true

  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}

// Get time until token expires (in seconds)
export function getTokenExpiresIn(token: string): number {
  const payload = parseJwtPayload(token)
  if (!payload || typeof payload.exp !== "number") return 0

  const currentTime = Math.floor(Date.now() / 1000)
  return Math.max(0, payload.exp - currentTime)
}
