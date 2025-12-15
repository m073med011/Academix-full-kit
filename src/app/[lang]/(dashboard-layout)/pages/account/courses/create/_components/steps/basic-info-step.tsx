"use client"

import { ArrowRight } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData } from "../../types"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  // CardDescription,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface BasicInfoStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onUpdate: (data: Partial<CourseFormData>) => void
  onNext: () => void
}

export function BasicInfoStep({
  dictionary,
  formData,
  onUpdate,
  onNext,
}: BasicInfoStepProps) {
  const t = dictionary.profilePage.createCourse.basicInfo
  const tActions = dictionary.profilePage.createCourse.actions

  return (
    <div className="flex flex-col gap-8">
      {/* Page Heading */}
      <header className="flex flex-col gap-3 text-center">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.description}</p>
      </header>

      {/* Form Section */}
      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Course Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="course-title">{t.courseTitle}</Label>
            <Input
              id="course-title"
              placeholder={t.courseTitlePlaceholder}
              value={formData.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="h-12"
            />
          </div>

          {/* Course Description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="course-description">{t.courseDescription}</Label>
            <Textarea
              id="course-description"
              placeholder={t.courseDescriptionPlaceholder}
              value={formData.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="min-h-48 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Category */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-category">{t.courseCategories}</Label>
              <Input
                id="course-category"
                placeholder={t.categoriesPlaceholder}
                value={formData.category}
                onChange={(e) => onUpdate({ category: e.target.value })}
                className="h-12"
              />
            </div>

            {/* Level */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="target-audience">{t.targetAudience}</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  onUpdate({
                    level: value as CourseFormData["level"],
                  })
                }
              >
                <SelectTrigger id="target-audience" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    {t.audienceLevels.beginner}
                  </SelectItem>
                  <SelectItem value="intermediate">
                    {t.audienceLevels.intermediate}
                  </SelectItem>
                  <SelectItem value="advanced">
                    {t.audienceLevels.advanced}
                  </SelectItem>
                  <SelectItem value="expert">
                    {t.audienceLevels.expert}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="course-duration">Total Duration (Hours)</Label>
              <Input
                id="course-duration"
                type="number"
                min="0"
                step="0.5"
                placeholder="e.g. 10.5"
                value={formData.duration || ""}
                onChange={(e) =>
                  onUpdate({ duration: parseFloat(e.target.value) || 0 })
                }
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <footer className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4"></footer>
    </div>
  )
}
