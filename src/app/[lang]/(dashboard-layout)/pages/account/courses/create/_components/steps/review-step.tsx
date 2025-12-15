"use client"

import { ArrowLeft, CheckCircle, ChevronRight, Pencil } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData } from "../../types"
import { WIZARD_STEPS } from "../../types"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onBack: () => void
  onPublish: () => void
  onEditStep: (step: number) => void
}

export function ReviewStep({
  dictionary,
  formData,
  onBack,
  onPublish,
  onEditStep,
}: ReviewStepProps) {
  const t = dictionary.profilePage.createCourse.review
  const tActions = dictionary.profilePage.createCourse.actions

  // Check completion status for each section
  const basicInfoComplete = formData.title && formData.description
  const curriculumComplete = formData.modules.length > 0
  const mediaComplete = true // Simplified - media is optional
  const pricingComplete =
    formData.enrollmentType === "free" || formData.price > 0

  const allChecksPass =
    basicInfoComplete && curriculumComplete && mediaComplete && pricingComplete

  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
    >
      <Pencil className="size-4" />
      <span>{tActions.edit}</span>
    </button>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t.title}</h1>
      </header>

      {/* Success Alert */}
      {allChecksPass && (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300">
          <CheckCircle className="size-4" />
          <AlertDescription>{t.allChecksPassed}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
        {/* Main Content */}
        <main className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.basicInformation}</CardTitle>
              <EditButton onClick={() => onEditStep(WIZARD_STEPS.BASIC_INFO)} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <p className="text-sm text-muted-foreground">
                  {dictionary.profilePage.createCourse.basicInfo.courseTitle}
                </p>
                <p className="md:col-span-2 text-sm">
                  {formData.title || "Not set"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <p className="text-sm text-muted-foreground">{t.category}</p>
                <p className="md:col-span-2 text-sm">
                  {formData.category || "Not set"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <p className="text-sm text-muted-foreground">
                  {dictionary.profilePage.createCourse.basicInfo.targetAudience}
                </p>
                <p className="md:col-span-2 text-sm capitalize">
                  {formData.level}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Curriculum */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.curriculum}</CardTitle>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {formData.modules.length} {t.sections},{" "}
                  {formData.modules.reduce(
                    (acc, m) => acc + m.contents.length,
                    0
                  )}{" "}
                  {t.lectures}
                </p>
                <EditButton
                  onClick={() => onEditStep(WIZARD_STEPS.CURRICULUM)}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Course Media */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.courseMedia}</CardTitle>
              <EditButton onClick={() => onEditStep(WIZARD_STEPS.MEDIA)} />
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-40 h-24 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  {formData.thumbnailUrl ? "Thumbnail" : "No thumbnail"}
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {dictionary.profilePage.createCourse.media.courseThumbnail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.thumbnailUrl ? "1920×1080 - JPG" : "Not uploaded"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Promotions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.pricingAndPromotions}</CardTitle>
              <EditButton onClick={() => onEditStep(WIZARD_STEPS.PRICING)} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <p className="text-sm text-muted-foreground">{t.priceTier}</p>
                <p className="md:col-span-2 text-sm">
                  {formData.enrollmentType === "free"
                    ? dictionary.profilePage.createCourse.pricing.free
                    : `$${formData.price.toFixed(2)} (${formData.currency})`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <p className="text-sm text-muted-foreground">{t.promotions}</p>
                <p className="md:col-span-2 text-sm">{t.noActivePromotions}</p>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-8 space-y-6">
            {/* Readiness Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t.readinessChecklist}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${
                        basicInfoComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>{t.basicInfoComplete}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${
                        curriculumComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>{t.curriculumAdded}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${
                        mediaComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>{t.mediaUploaded}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${
                        pricingComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>{t.pricingSet}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {/* <div className="flex flex-col gap-3">
              <Button className="w-full" size="lg" onClick={onPublish}>
                {t.publishCourse}
              </Button>
            </div> */}
          </div>
        </aside>
      </div>
    </div>
  )
}
