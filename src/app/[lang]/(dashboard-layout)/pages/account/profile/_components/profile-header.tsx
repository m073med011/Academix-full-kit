"use client"

import { useState } from "react"
import { UserPen, Lock } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { UserProfile } from "@/types/api"

import { typography } from "@/lib/typography"
import { getInitials } from "@/lib/utils"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EditProfileForm } from "./edit-profile-form"
import { ChangePasswordForm } from "./change-password-form"

interface ProfileHeaderProps {
  locale: LocaleType
  dictionary: DictionaryType
  user: UserProfile
}

export function ProfileHeader({ locale, dictionary, user }: ProfileHeaderProps) {
  const t = dictionary.profilePage.header
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  return (
    <section className="bg-background">
      <AspectRatio ratio={5 / 1} className="bg-muted">
        <div className="h-full w-full bg-linear-to-r from-primary/20 to-primary/10" />
      </AspectRatio>
      <div className="relative w-full flex flex-col items-center gap-2 p-4 md:flex-row">
        <Avatar className="size-32 -mt-20 md:size-40">
          <AvatarImage
            src={user.imageProfileUrl}
            alt="Profile Avatar"
            className="border-4 border-background object-cover"
          />
          <AvatarFallback className="border-4 border-background text-4xl">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute top-4 end-4 flex gap-2">
          {!user.isOAuthUser && (
            <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Change Password">
                  <Lock className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Update your password to keep your account secure.
                  </DialogDescription>
                </DialogHeader>
                <ChangePasswordForm onSuccess={() => setIsPasswordOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Edit Profile">
                <UserPen className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <EditProfileForm 
                user={{ name: user.name, imageProfileUrl: user.imageProfileUrl }} 
                onSuccess={() => setIsEditOpen(false)}
                dictionary={dictionary}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-center md:text-start">
          <div>
            <h1 className={`${typography.h2} line-clamp-1`}>{user.name}</h1>
            <p className={`${typography.muted} line-clamp-1`}>
              {user.email}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
            {user.isOAuthUser && (
              <Badge variant="secondary">
                {user.provider}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
