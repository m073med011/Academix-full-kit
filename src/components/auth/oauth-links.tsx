"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

import { oauthLinksData } from "@/data/oauth-links"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function OAuthLinks({ selectedRole }: { selectedRole?: string }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    if (provider.toLowerCase() === "google") {
      // Set role cookie if selected
      if (selectedRole) {
        document.cookie = `registration_role=${selectedRole}; path=/; max-age=3600`
      }

      setIsGoogleLoading(true)
      toast({
        title: "Redirecting to Google",
        description: "Please wait while we redirect you to Google sign in...",
      })
    }

    try {
      await signIn(provider.toLowerCase(), { callbackUrl: "/" })
    } catch (_error) {
      setIsGoogleLoading(false)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to initiate Google sign in.",
      })
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {oauthLinksData.map((link) => (
        <Button
          key={link.label}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isGoogleLoading}
          onClick={() => handleSignIn(link.label)}
          aria-label={link.label}
        >
          {isGoogleLoading && link.label === "Google" ? (
            <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <link.icon className="mr-2 size-4" />
          )}
          {link.label}
        </Button>
      ))}
    </div>
  )
}
