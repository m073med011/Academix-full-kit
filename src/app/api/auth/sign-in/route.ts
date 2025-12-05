import { NextResponse } from "next/server"

import type { LoginResponse } from "@/types/api"

import { SignInSchema } from "@/schemas/sign-in-schema"

// LMS Backend URL
const LMS_BACKEND_URL =
  process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = SignInSchema.safeParse(body)

    // If validation fails, return an error response with a 400 status
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsedData.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = parsedData.data

    // Forward request to LMS Backend
    const response = await fetch(`${LMS_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data: LoginResponse = await response.json()

    // Handle backend errors
    if (!response.ok) {
      const errorData = data as { error?: string; message?: string }
      return NextResponse.json(
        {
          message:
            errorData.error || errorData.message || "Invalid email or password",
        },
        { status: response.status || 401 }
      )
    }

    // Handle email verification required
    if ("requiresEmailVerification" in data && data.requiresEmailVerification) {
      return NextResponse.json(
        {
          requiresEmailVerification: true,
          email: data.user.email,
          message: data.message || "Please verify your email to continue",
        },
        { status: 403 }
      )
    }

    // Handle 2FA required
    if ("requires2FA" in data && data.requires2FA) {
      return NextResponse.json(
        {
          requires2FA: true,
          email: data.user.email,
          message: data.message || "Please complete two-factor authentication",
        },
        { status: 403 }
      )
    }

    // Successful login
    if ("token" in data && data.token) {
      return NextResponse.json(
        {
          success: true,
          user: {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.imageProfileUrl || null,
            role: data.user.role,
          },
          accessToken: data.token,
          refreshToken: data.refreshToken,
          organizations: data.organizations || [],
          activeOrganizationId: data.activeOrganizationId,
        },
        { status: 200 }
      )
    }

    // Unexpected response
    throw new Error("Unexpected response from backend")
  } catch (error) {
    console.error("Error signing in:", error)
    return NextResponse.json(
      { message: "An error occurred during sign in" },
      { status: 500 }
    )
  }
}
