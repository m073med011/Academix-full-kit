import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Shadboard
      </h1>
      <p className="text-muted-foreground max-w-md text-lg">
        A comprehensive dashboard kit built with Next.js and Shadcn UI.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
