"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

interface LandingFooterProps {
  dictionary: DictionaryType
}

export function LandingFooter({ dictionary }: LandingFooterProps) {
  const params = useParams()
  const locale = params.lang as LocaleType
  const t = dictionary.landingPage?.footer

  // Fallback
  if (!t) return null

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40 py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Academix. {t.rights}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={ensureLocalizedPathname("/terms", locale)}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-muted-foreground"
            )}
          >
            {t.terms}
          </Link>
          <Link
            href={ensureLocalizedPathname("/privacy", locale)}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-muted-foreground"
            )}
          >
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  )
}
