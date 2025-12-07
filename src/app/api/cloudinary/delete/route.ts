import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { publicId, resourceType = "image" } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId is required" },
        { status: 400 }
      )
    }

    // Check if Cloudinary is configured
    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    if (!apiKey || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary API credentials not configured" },
        { status: 500 }
      )
    }

    // Delete the resource from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: `Failed to delete: ${result.result}` },
      { status: 500 }
    )
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete file from Cloudinary" },
      { status: 500 }
    )
  }
}
