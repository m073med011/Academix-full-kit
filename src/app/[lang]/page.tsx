import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Iphone15ProMockup } from "@/app/[lang]/(dashboard-layout)/(design-system)/extended-ui/mockups/_components/iphone-15-pro-mockup"
import { SafariMockup } from "@/app/[lang]/(dashboard-layout)/(design-system)/extended-ui/mockups/_components/safari-mockup"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 text-center">
      <section className="container space-y-10 py-16">
        <div className="grid place-items-center gap-y-4 text-center">
          <h1 className="text-6xl font-black leading-none">
            Welcome to Academix
          </h1>
          <p className="max-w-prose w-full text-lg text-muted-foreground">
            A comprehensive dashboard kit built with Next.js and Shadcn UI.
          </p>
          <div className="flex gap-x-2">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className=" flex w-full flex-col max-w-7xl ">
        {[...Array(5)].map((_, i) => (
          <section
            key={i}
            className="flex flex-col items-center justify-center gap-6 border-y bg-background p-4 md:flex-row"
          >
            <div className="flex-3">
              <SafariMockup />
            </div>
            <div className="flex-1">
              <Iphone15ProMockup />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
