"use client"

import { Search } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Input } from "@/components/ui/input"

interface StoreHeroProps {
  dictionary: DictionaryType
}

export function StoreHero({ dictionary }: StoreHeroProps) {
  const t = dictionary.storePage

  return (
    <div className="w-full bg-card py-16 sm:py-24 lg:py-28 border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-foreground text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {t.hero.title}
          </h1>
          <p className="text-muted-foreground text-lg font-normal leading-normal sm:text-xl">
            {t.hero.description}
          </p>
        </div>
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 rtl:left-auto rtl:right-4" />
            <Input
              className="w-full rounded-lg border-2 border-border bg-background py-6 pl-12 pr-6 text-base placeholder:text-muted-foreground focus-visible:ring-primary/50 rtl:pl-6 rtl:pr-12"
              placeholder={t.search.placeholder}
              type="search"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
