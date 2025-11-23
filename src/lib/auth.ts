import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function authenticateUser() {
  const session = await getSession()

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized user.")
  }

  return session.user
}

/**
 * Get the access token from the session for making backend API calls
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return session?.accessToken || null
}

/**
 * Check if the current session has a token refresh error
 */
export async function hasSessionError(): Promise<boolean> {
  const session = await getSession()
  return session?.error === "RefreshTokenError"
}

/**
 * Get the authenticated user with their access token for API calls
 */
export async function getAuthenticatedContext() {
  const session = await getSession()

  if (!session || !session.user?.id) {
    return null
  }

  return {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  }
}
