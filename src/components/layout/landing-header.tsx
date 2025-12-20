"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { Button } from "@/components/ui/button"
import { LanguageDropdown } from "@/components/language-dropdown"
import { ModeDropdown } from "@/components/mode-dropdown"

interface LandingHeaderProps {
  dictionary: DictionaryType
}

export function LandingHeader({ dictionary }: LandingHeaderProps) {
  const params = useParams()
  const locale = params.lang as LocaleType
  const t = dictionary.landingPage?.header

  // Fallback if dictionary keys are missing during hot reload
  if (!t) return null

  const navItems = [
    { label: t.features, href: "#features" },
    { label: t.testimonials, href: "#testimonials" },
    { label: t.pricing, href: "#pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link
            href={ensureLocalizedPathname("/", locale)}
            className="flex items-center font-black"
          >
            <Image
              src="/images/logos/logo02.png"
              alt="Academix"
              height={26}
              width={26}
              className="dark:invert mr-2"
            />
            <span className="hidden sm:inline-block">Academix</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <ModeDropdown dictionary={dictionary} />
            <LanguageDropdown dictionary={dictionary} />
          </div>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href={ensureLocalizedPathname("/auth/signin", locale)}>
              {t.signIn}
            </Link>
          </Button>
          <Button asChild>
            <Link href={ensureLocalizedPathname("/auth/register", locale)}>
              {t.getStarted}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
