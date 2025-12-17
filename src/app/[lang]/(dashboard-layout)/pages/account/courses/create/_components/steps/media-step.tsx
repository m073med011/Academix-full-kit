"use client"

import { Upload, Video } from "lucide-react"

import type { CloudinaryUploadResult } from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/cloudinary-service"
import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData } from "../../types"

import { Button } from "@/components/ui/button"
import { DefaultImage } from "@/components/ui/defult-Image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CloudinaryUploader } from "@/components/ui/cloudinary-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      </header>

      {/* Course Thumbnail Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.courseThumbnail}</CardTitle>
          <CardDescription>{t.thumbnailRecommendation}</CardDescription>
        </CardHeader>
        <CardContent>
          {formData.thumbnailUrl ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
              <DefaultImage
                src={formData.thumbnailUrl}
                alt="Course Thumbnail"
                fill
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onUpdate({ thumbnailUrl: undefined })}
              >
                Remove
              </Button>
            </div>
          ) : (
            <CloudinaryUploader
              dictionary={dictionary}
              defaultResourceType="image"
              showTypeSelector={false}
              onUploadComplete={(result: CloudinaryUploadResult) =>
                onUpdate({ thumbnailUrl: result.secureUrl })
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Promotional Video Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t.promotionalVideo}</CardTitle>
          <CardDescription>{t.videoRecommendation}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.promoVideoUrl ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-black">
              <video
                src={formData.promoVideoUrl}
                poster={formData.thumbnailUrl}
                controls
                className="w-full h-full"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => onUpdate({ promoVideoUrl: undefined })}
              >
                Remove
              </Button>
            </div>
          ) : (
            <>
              {/* File Uploader */}
              <CloudinaryUploader
                dictionary={dictionary}
                defaultResourceType="video"
                showTypeSelector={false}
                onUploadComplete={(result: CloudinaryUploadResult) =>
                  onUpdate({ promoVideoUrl: result.secureUrl })
                }
              />

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
            </>
          )}
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
                <Input
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
    </div>
  )
}
