import { NextResponse } from "next/server"
import { z } from "zod"

// LMS Backend URL
const LMS_BACKEND_URL =
  process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

// Validation schema for 2FA verification request
const Verify2FASchema = z.object({
  email: z.string().email("Please enter a valid email"),
  code: z.string().length(6, "Code must be 6 digits"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = Verify2FASchema.safeParse(body)

    // Validate request data
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsedData.error.errors },
        { status: 400 }
      )
    }

    const { email, code } = parsedData.data

    // Forward request to LMS Backend - same endpoint as verify-email but for 2FA purpose
    const response = await fetch(`${LMS_BACKEND_URL}/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        code,
        purpose: "login_verification",
      }),
    })

    const data = await response.json()

    // Handle backend errors
    if (!response.ok || !data.success) {
      const errorMessage = data.error || data.message || "Verification failed"

      return NextResponse.json(
        { message: errorMessage },
        { status: response.status || 400 }
      )
    }

    // After OTP verification, we need to complete the login
    // The backend should return tokens after successful 2FA
    return NextResponse.json(
      {
        success: true,
        message: data.message || "2FA verification successful",
        user: data.user
          ? {
              id: data.user._id || data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              avatar: data.user.imageProfileUrl || null,
            }
          : undefined,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json(
      { message: "An error occurred during 2FA verification" },
      { status: 500 }
    )
  }
}
