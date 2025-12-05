"use client"

import Image from "next/image"
import Link from "next/link"
import { UserPen } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { userData } from "@/data/user"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { cn, formatNumberToCompact, getInitials } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  locale: LocaleType
  dictionary: DictionaryType
}

export function ProfileHeader({ locale, dictionary }: ProfileHeaderProps) {
  const t = dictionary.profilePage.header

  return (
    <section className="bg-background">
      <AspectRatio ratio={5 / 1} className="bg-muted">
        {userData.background && (
          <Image
            src={userData.background}
            fill
            className="h-full w-full object-cover"
            alt="Profile Background"
          />
        )}
      </AspectRatio>
      <div className="relative w-full flex flex-col items-center gap-2 p-4 md:flex-row">
        <Avatar className="size-32 -mt-20 md:size-40">
          <AvatarImage
            src={userData.avatar}
            alt="Profile Avatar"
            className="border-4 border-background"
          />
          <AvatarFallback className="border-4 border-background">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute top-4 end-4"
        >
          <Link
            href={ensureLocalizedPathname("/pages/account/settings", locale)}
            aria-label={t.editProfile}
          >
            <UserPen className="size-4" />
          </Link>
        </Button>
        <div className="text-center md:text-start">
          <div>
            <h1 className="text-2xl font-bold line-clamp-1">{userData.name}</h1>
            <p className="text-muted-foreground line-clamp-1">
              {userData.state && userData.state + ", "}
              {userData.country}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 mt-2">
            <Badge variant="outline">
              {formatNumberToCompact(userData.followers)} {t.followers}
            </Badge>
            <Badge variant="outline">
              {formatNumberToCompact(userData.connections)} {t.connections}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
