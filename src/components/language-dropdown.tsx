"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Earth } from "lucide-react"
import Image from "next/image"

const flags = {
  ar: "/images/icons/Palestine-01-1.svg",
  en: "/images/icons/uk.svg",
}

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { i18n } from "@/configs/i18n"
import { relocalizePathname } from "@/lib/i18n"
import { getDictionaryValue } from "@/lib/utils"

import { useSettings } from "@/hooks/use-settings"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageDropdown({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const pathname = usePathname()
  const params = useParams()
  const { settings, updateSettings } = useSettings()

  const locale = params.lang as LocaleType
  const direction = i18n.localeDirection[locale]

  const setLocale = useCallback(
    (localeName: LocaleType) => {
      updateSettings({ ...settings, locale: localeName })
    },
    [settings, updateSettings]
  )

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Language">
          <Image
            src={flags[locale]}
            alt={locale}
            width={20}
            height={20}
            className="rounded-sm object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {dictionary.navigation.language.language}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale}>
          {i18n.locales.map((locale) => {
            const localeName = i18n.localeNames[locale]
            const localizedLocaleName = getDictionaryValue(
              localeName,
              dictionary.navigation.language
            )

            return (
              <Link
                key={locale}
                href={relocalizePathname(pathname, locale)}
                onClick={() => setLocale(locale)}
              >
                <DropdownMenuRadioItem
                  value={locale}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={flags[locale]}
                    alt={localizedLocaleName}
                    width={20}
                    height={20}
                    className="rounded-sm object-cover"
                  />
                  <span>{localizedLocaleName}</span>
                </DropdownMenuRadioItem>
              </Link>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
