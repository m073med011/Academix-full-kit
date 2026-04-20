import { NextResponse } from "next/server"

// LMS Backend URL
const LMS_BACKEND_URL =
  process.env.LMS_BACKEND_URL || "http://localhost:5000/api"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      )
    }

    // Forward request to LMS Backend
    const response = await fetch(
      `${LMS_BACKEND_URL}/auth/reactivate-account/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data.message || "Failed to confirm account reactivation",
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error confirming account reactivation:", error)
    return NextResponse.json(
      { message: "An error occurred during account reactivation confirm" },
      { status: 500 }
    )
  }
}
