import { NextResponse } from "next/server"
import { z } from "zod"

// LMS Backend URL
const LMS_BACKEND_URL =
  process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

// Validation schema for resend verification request
const ResendVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  purpose: z.enum([
    "EMAIL_VERIFICATION",
    "PASSWORD_RESET",
    "LOGIN_VERIFICATION",
  ]),
})

// Map frontend purpose values to backend purpose values
const purposeMap: Record<string, string> = {
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
  LOGIN_VERIFICATION: "login_verification",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsedData = ResendVerificationSchema.safeParse(body)

    // Validate request data
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsedData.error.issues },
        { status: 400 }
      )
    }

    const { email, purpose } = parsedData.data

    // Map frontend purpose to backend purpose
    const backendPurpose = purposeMap[purpose] || purpose.toLowerCase()

    // Forward request to LMS Backend
    const response = await fetch(`${LMS_BACKEND_URL}/otp/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        purpose: backendPurpose,
      }),
    })

    const data = await response.json()

    // Handle backend errors
    if (!response.ok || !data.success) {
      const errorMessage = data.error || data.message || "Failed to resend code"

      return NextResponse.json(
        { message: errorMessage },
        { status: response.status || 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: data.message || "Verification code sent successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { message: "An error occurred while resending verification code" },
      { status: 500 }
    )
  }
}
