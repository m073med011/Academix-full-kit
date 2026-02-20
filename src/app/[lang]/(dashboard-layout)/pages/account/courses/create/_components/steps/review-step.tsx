"use client"

import { useState } from "react"
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  Pencil,
  PlayCircle,
  ClipboardList,
  Eye,
  Download,
  Clock,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { CourseFormData, CourseContent } from "../../types"
import { WIZARD_STEPS } from "../../types"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ReviewStepProps {
  dictionary: DictionaryType
  formData: CourseFormData
  onBack: () => void
  onPublish: () => void
  onEditStep: (step: number) => void
}

// Helper function to get the icon for content type
const getContentTypeIcon = (type: CourseContent["type"]) => {
  switch (type) {
    case "video":
      return <PlayCircle className="size-4 text-blue-500" />
    case "text":
      return <FileText className="size-4 text-green-500" />
    case "quiz":
      return <HelpCircle className="size-4 text-purple-500" />
    case "assignment":
      return <ClipboardList className="size-4 text-orange-500" />
    case "link":
      return <LinkIcon className="size-4 text-cyan-500" />
    default:
      return <FileText className="size-4 text-muted-foreground" />
  }
}

// Helper function to get the content type label
const getContentTypeLabel = (type: CourseContent["type"]) => {
  switch (type) {
    case "video":
      return "Video"
    case "text":
      return "Article"
    case "quiz":
      return "Quiz"
    case "assignment":
      return "Assignment"
    case "link":
      return "Link"
    default:
      return type
  }
}

// Module preview component
function CurriculumModulePreview({
  module,
  moduleIndex,
}: {
  module: CourseFormData["modules"][number]
  moduleIndex: number
}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
          {isOpen ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
          <span className="font-medium text-sm">
            Module {moduleIndex + 1}: {module.title}
          </span>
          <Badge variant="secondary" className="ml-auto text-xs">
            {module.contents.length} item{module.contents.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-7 mt-2 space-y-2">
          {module.contents.length === 0 ? (
            <p className="text-sm text-muted-foreground italic pl-2">
              No materials in this module
            </p>
          ) : (
            module.contents.map((content, contentIndex) => (
              <ContentItemPreview
                key={content.id}
                content={content}
                contentIndex={contentIndex}
              />
            ))
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// Content item preview component
function ContentItemPreview({
  content,
  contentIndex,
}: {
  content: CourseContent
  contentIndex: number
}) {
  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-background">
      <div className="flex-shrink-0 mt-0.5">
        {getContentTypeIcon(content.type)}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate">{content.title}</span>
          <Badge variant="outline" className="text-xs">
            {getContentTypeLabel(content.type)}
          </Badge>
          {content.status === "draft" && (
            <Badge variant="secondary" className="text-xs">
              Draft
            </Badge>
          )}
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {content.description}
          </p>
        )}

        {/* URL/Link for video and link types */}
        {(content.type === "video" || content.type === "link") && content.url && (
          <div className="flex items-center gap-1 text-xs text-primary">
            <ExternalLink className="size-3" />
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate max-w-xs hover:underline"
            >
              {content.url}
            </a>
          </div>
        )}

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mt-1">
          {content.isFreePreview && (
            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <Eye className="size-3" />
              <span>Free Preview</span>
            </div>
          )}
          {content.allowDownloads && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Download className="size-3" />
              <span>Downloads Allowed</span>
            </div>
          )}
          {content.duration && content.duration > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span>{content.duration} min</span>
            </div>
          )}
          {content.points && content.points > 0 && (
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {content.points} points
            </div>
          )}
          {content.openInNewTab && content.type === "link" && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="size-3" />
              <span>Opens in new tab</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
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
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors h-auto p-0 hover:bg-transparent"
    >
      <Pencil className="size-4" />
      <span>{tActions.edit}</span>
    </Button>
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

          {/* Curriculum Preview */}
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
            <CardContent className="space-y-4">
              {formData.modules.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No modules added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.modules.map((module, moduleIndex) => (
                    <CurriculumModulePreview
                      key={module.id}
                      module={module}
                      moduleIndex={moduleIndex}
                    />
                  ))}
                </div>
              )}
            </CardContent>
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
                      className={`size-5 me-2 ${basicInfoComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                        }`}
                    />
                    <span>{t.basicInfoComplete}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${curriculumComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                        }`}
                    />
                    <span>{t.curriculumAdded}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${mediaComplete
                          ? "text-green-500"
                          : "text-muted-foreground"
                        }`}
                    />
                    <span>{t.mediaUploaded}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle
                      className={`size-5 me-2 ${pricingComplete
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
