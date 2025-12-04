import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.accessToken) {
    return NextResponse.json({ accessToken: null })
  }

  return NextResponse.json({ accessToken: session.accessToken })
}
