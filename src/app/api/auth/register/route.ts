import { NextResponse } from "next/server"

import { RegisterSchema } from "@/schemas/register-schema"

// LMS Backend URL
const LMS_BACKEND_URL =
  process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = RegisterSchema.safeParse(body)

    // Validate request data
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsedData.error.issues },
        { status: 400 }
      )
    }

    const { name, email, role, password } = parsedData.data

    // Forward request to LMS Backend
    // Backend expects: name, email, password, role (optional)
    // For credentials registration, backend will:
    // 1. Create user with emailVerified: false
    // 2. Generate OTP for email verification
    // 3. Return requiresEmailVerification: true
    const response = await fetch(`${LMS_BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role, // Send user-selected role to backend
      }),
    })

    const data = await response.json()

    // Handle backend errors
    if (!response.ok || !data.success) {
      const errorMessage = data.error || data.message || "Registration failed"

      // Check for specific error types
      if (
        errorMessage.toLowerCase().includes("email") &&
        (errorMessage.toLowerCase().includes("exist") ||
          errorMessage.toLowerCase().includes("already"))
      ) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { message: errorMessage },
        { status: response.status || 400 }
      )
    }

    // Backend returns requiresEmailVerification for credentials users
    if (data.requiresEmailVerification) {
      return NextResponse.json(
        {
          success: true,
          requiresEmailVerification: true,
          message:
            data.message ||
            "Account created successfully. Please verify your email to continue.",
          user: {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          },
        },
        { status: 201 }
      )
    }

    // OAuth registration returns token immediately
    if (data.token) {
      return NextResponse.json(
        {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          user: {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          },
        },
        { status: 201 }
      )
    }

    // Fallback response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: data.user?._id || data.user?.id,
          name: data.user?.name,
          email: data.user?.email,
          role: data.user?.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
