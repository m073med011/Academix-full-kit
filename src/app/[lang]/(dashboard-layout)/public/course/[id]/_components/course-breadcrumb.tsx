"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { Button } from "@/components/ui/button"

interface CourseBreadcrumbProps {
  dictionary: DictionaryType
  locale: LocaleType
  category: string
  title: string
}

export function CourseBreadcrumb({
  dictionary,
  locale,
  category,
  title,
}: CourseBreadcrumbProps) {
  const router = useRouter()
  const t = dictionary.courseDetailsPage?.navigation

  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t?.back || "Back"}
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link
            href={ensureLocalizedPathname("/public/store", locale)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t?.catalog || "Catalog"}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link
            href={ensureLocalizedPathname(
              `/public/store?category=${category}`,
              locale
            )}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {category}
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium line-clamp-1">{title}</span>
        </div>
      </div>
    </div>
  )
}
