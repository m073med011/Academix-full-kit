"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { oauthLinksData } from "@/data/oauth-links"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function OAuthLinks({ dictionary }: { dictionary: DictionaryType }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    if (provider.toLowerCase() === "google") {
      setIsGoogleLoading(true)
      toast({
        title: dictionary.auth.oauth.redirecting.replace(
          "{provider}",
          "Google"
        ),
        description: dictionary.auth.oauth.redirectingMessage.replace(
          "{provider}",
          "Google"
        ),
      })
    }

    try {
      await signIn(provider.toLowerCase(), { callbackUrl: "/" })
    } catch (_error) {
      setIsGoogleLoading(false)
      toast({
        variant: "destructive",
        title: dictionary.auth.oauth.failed,
        description: dictionary.auth.oauth.failedMessage.replace(
          "{provider}",
          "Google"
        ),
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
