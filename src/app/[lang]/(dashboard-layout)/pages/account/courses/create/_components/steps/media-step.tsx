"use client"

import { Upload, Video } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData } from "../../types"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface MediaStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onUpdate: (data: Partial<CourseFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function MediaStep({
  dictionary,
  formData,
  onUpdate,
  onNext,
  onBack,
}: MediaStepProps) {
  const t = dictionary.profilePage.createCourse.media
  const tActions = dictionary.profilePage.createCourse.actions
  const tProgress = dictionary.profilePage.createCourse.progress

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
            {dictionary.profilePage.createCourse.basicInfo.title
              .split(" ")
              .slice(0, 3)
              .join(" ")}
          </h1>
        </div>
        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {tProgress.stepOf
                .replace("{current}", "4")
                .replace("{total}", "5")}
              : {t.title}
            </span>
          </div>
          <Progress value={80} />
        </div>
      </header>

      {/* Course Thumbnail Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.courseThumbnail}</CardTitle>
          <CardDescription>{t.thumbnailRecommendation}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <div className="text-center text-muted-foreground p-4">
              <Upload className="size-10 mx-auto mb-2" />
              <p className="text-sm">
                {t.dragDropImage}{" "}
                <span className="font-semibold text-primary">
                  {t.clickToBrowse}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Video Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.promotionalVideo}</CardTitle>
          <CardDescription>{t.videoRecommendation}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Uploader */}
          <div className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <div className="text-center text-muted-foreground p-4">
              <Video className="size-10 mx-auto mb-2" />
              <p className="text-sm">
                {t.dragDropVideo}{" "}
                <span className="font-semibold text-primary">
                  {t.clickToBrowse}
                </span>
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs font-semibold text-muted-foreground">
              {t.or}
            </span>
            <Separator className="flex-1" />
          </div>

          {/* URL Input */}
          <div>
            <Label htmlFor="video-url">{t.pasteVideoUrl}</Label>
            <Input
              id="video-url"
              type="url"
              placeholder={t.videoUrlPlaceholder}
              value={formData.promoVideoUrl || ""}
              onChange={(e) => onUpdate({ promoVideoUrl: e.target.value })}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Course Branding Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.branding}</CardTitle>
          <CardDescription>{t.brandingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="brand-color">{t.primaryBrandColor}</Label>
            <div className="relative mt-2 max-w-xs">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <div
                  className="size-4 rounded-full border border-muted-foreground/30"
                  style={{ backgroundColor: formData.brandColor }}
                />
              </div>
              <Input
                id="brand-color"
                type="text"
                value={formData.brandColor}
                onChange={(e) => onUpdate({ brandColor: e.target.value })}
                className="pl-10 pr-12"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <input
                  type="color"
                  value={formData.brandColor}
                  onChange={(e) => onUpdate({ brandColor: e.target.value })}
                  className="w-6 h-6 p-0 border-none cursor-pointer bg-transparent"
                  aria-label="Color Picker"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <footer className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          {tActions.back}
        </Button>
        <Button onClick={onNext}>{tActions.saveAndContinue}</Button>
      </footer>
    </div>
  )
}
