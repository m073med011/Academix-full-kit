"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"


import {
  BookOpen,
  CheckCircle,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { CourseFormData } from "../types"
import { initialCourseFormData } from "../types"

import { Button } from "@/components/ui/button"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { toast } from "sonner"

import { courseService } from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/course-service"
import type { CreateCourseRequest } from "@/types/api"
import {
  Steps,
  StepsConnector,
  StepsContent,
  StepsItem,
  StepsList,
  StepsNavigation,
} from "@/components/ui/steps"
import { BasicInfoStep } from "./steps/basic-info-step"
import { CurriculumStep } from "./steps/curriculum-step"
import { MediaStep } from "./steps/media-step"
import { PricingStep } from "./steps/pricing-step"
import { ReviewStep } from "./steps/review-step"

interface WizardContainerProps {
  dictionary: DictionaryType
  locale: LocaleType
  initialStep: number
}

export function WizardContainer({
  dictionary,
  locale,
  initialStep,
}: WizardContainerProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(
    Math.min(Math.max(initialStep, 1), 5)
  )
  const [formData, setFormData] = useState<CourseFormData>(
    initialCourseFormData
  )
  const [isPublishing, setIsPublishing] = useState(false)
  const isPublishingRef = useRef(false)

  const t = dictionary.profilePage.createCourse
  const tSteps = t.steps
  const tActions = t.actions

  const updateFormData = (data: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const goToStep = (step: number) => {
    const newStep = Math.min(Math.max(step, 1), 5)
    setCurrentStep(newStep)
    router.push(
      ensureLocalizedPathname(
        `/pages/account/courses/create?step=${newStep}`,
        locale
      ),
      { scroll: false }
    )
  }

  const handleNext = () => {
    if (currentStep < 5) {
      goToStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    }
  }

  const handlePublish = async () => {
    if (isPublishingRef.current) return
    
    if (!isStepValid(5)) {
      toast.error("Please complete all required fields before publishing")
      return
    }

    isPublishingRef.current = true
    setIsPublishing(true)

    try {
      
      // 1. Create the course with basic info
      const createCourseData: CreateCourseRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        price: formData.price,
        currency: formData.currency,
        duration: formData.duration,
        thumbnailUrl: formData.thumbnailUrl,
        promoVideoUrl: formData.promoVideoUrl,
        brandColor: formData.brandColor,
        enrollmentType: formData.enrollmentType,
        enrollmentStartDate: formData.enrollmentStartDate,
        enrollmentEndDate: formData.enrollmentEndDate,
        isPublished: true,
        isOrgPrivate: formData.isPrivate,
        modules: [], // Start with empty modules
      }
      
      const createdCourse = await courseService.createCourse(createCourseData)
      const courseId = createdCourse._id

      // 2. Create materials and construct module structure
      const modulesWithMaterials = await Promise.all(
        formData.modules
          .filter((module) => module.title && module.title.trim() !== "")
          .map(async (module) => {
            const materialPromises = module.contents
              .filter((content) => content.title && content.title.trim() !== "")
              .map(async (content, index) => {
                // Map frontend content types to backend MaterialType
                let type: "video" | "text" | "quiz" | "assignment" | "link" | "pdf" = "text"
                
                switch (content.type) {
                  case "video": type = "video"; break
                  case "article": type = "text"; break
                  case "quiz": type = "quiz"; break
                  case "assignment": type = "assignment"; break
                  case "link": type = "link"; break
                }

                // Create material
                const materialData = {
                  title: content.title,
                  description: content.description,
                  courseId: courseId,
                  type,
                  content: content.content,
                  url: content.url,
                  duration: content.duration,
                  order: index,
                  isPublished: true,
                  isFreePreview: content.isFreePreview,
                  allowDownloads: content.allowDownloads,
                  points: content.points,
                  dueDate: content.dueDate,
                  submissionTypes: content.submissionTypes,
                  allowLate: content.allowLate,
                  openInNewTab: content.openInNewTab,
                }

                const createdMaterial = await courseService.createMaterial(materialData)
                
                return {
                  materialId: createdMaterial._id,
                  order: index
                }
              })

            const items = await Promise.all(materialPromises)

            return {
              title: module.title,
              items
            }
          })
      )

      // 3. Update course with modules containing material references
      if (modulesWithMaterials.length > 0) {
        await courseService.updateCourse(courseId, {
          modules: modulesWithMaterials
        })
      }

      toast.success("Course published successfully!")
      
      // Redirect to public course page
      router.push(
        ensureLocalizedPathname(`/public/course/${courseId}`, locale)
      )
    } catch (error) {
      console.error("Failed to publish course:", error)
      toast.error("Failed to publish course. Please try again.")
    } finally {
      setIsPublishing(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: // Basic Info
        return !!formData.title && !!formData.description
      case 2: // Curriculum
        return formData.modules.length > 0
      case 3: // Pricing
        return formData.enrollmentType === "free" || formData.price > 0
      case 4: // Media
        return true // Optional
      case 5: // Review
        return (
          !!formData.title &&
          !!formData.description &&
          formData.modules.length > 0 &&
          (formData.enrollmentType === "free" || formData.price > 0)
        )
      default:
        return false
    }
  }

  return (
    <Steps
      activeStep={currentStep - 1}
      onStepChange={(step) => goToStep(step + 1)}
      totalSteps={5}
      allowJump={true}
      className="gap-8"
    >
      <StepsList>
        <StepsItem
          step={0}
          label={tSteps.basicInfo}
          icon={<FileText className="size-5" />}
        />
        <StepsConnector afterStep={0} />
        <StepsItem
          step={1}
          label={tSteps.curriculum}
          icon={<BookOpen className="size-5" />}
        />
        <StepsConnector afterStep={1} />
        <StepsItem
          step={2}
          label={tSteps.pricing}
          icon={<DollarSign className="size-5" />}
        />
        <StepsConnector afterStep={2} />
        <StepsItem
          step={3}
          label={tSteps.media}
          icon={<ImageIcon className="size-5" />}
        />
        <StepsConnector afterStep={3} />
        <StepsItem
          step={4}
          label={tSteps.review}
          icon={<CheckCircle className="size-5" />}
        />
      </StepsList>

      <StepsContent step={0}>
        <BasicInfoStep
          dictionary={dictionary}
          formData={formData}
          onUpdate={updateFormData}
          onNext={handleNext}
        />
        <StepsNavigation
          prevLabel={tActions.back}
          nextLabel={tActions.next}
          hidePrev
          nextButton={
            <Button onClick={handleNext} disabled={!isStepValid(1)}>
              {tActions.next}
            </Button>
          }
        />
      </StepsContent>

      <StepsContent step={1}>
        <CurriculumStep
          dictionary={dictionary}
          formData={formData}
          onUpdate={updateFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
        <StepsNavigation
          prevLabel={tActions.back}
          nextLabel={tActions.next}
          prevButton={
            <Button variant="outline" onClick={handleBack}>
              {tActions.back}
            </Button>
          }
          nextButton={
            <Button onClick={handleNext} disabled={!isStepValid(2)}>
              {tActions.next}
            </Button>
          }
        />
      </StepsContent>

      <StepsContent step={2}>
        <PricingStep
          dictionary={dictionary}
          formData={formData}
          onUpdate={updateFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
        <StepsNavigation
          prevLabel={tActions.back}
          nextLabel={tActions.next}
          prevButton={
            <Button variant="outline" onClick={handleBack}>
              {tActions.back}
            </Button>
          }
          nextButton={
            <Button onClick={handleNext} disabled={!isStepValid(3)}>
              {tActions.next}
            </Button>
          }
        />
      </StepsContent>

      <StepsContent step={3}>
        <MediaStep
          dictionary={dictionary}
          formData={formData}
          onUpdate={updateFormData}
          onNext={handleNext}
          onBack={handleBack}
        />
        <StepsNavigation
          prevLabel={tActions.back}
          nextLabel={tActions.next}
          prevButton={
            <Button variant="outline" onClick={handleBack}>
              {tActions.back}
            </Button>
          }
          nextButton={
            <Button onClick={handleNext} disabled={!isStepValid(4)}>
              {tActions.next}
            </Button>
          }
        />
      </StepsContent>

      <StepsContent step={4}>
        <ReviewStep
          dictionary={dictionary}
          formData={formData}
          onBack={handleBack}
          onPublish={handlePublish}
          onEditStep={goToStep}
        />
        <StepsNavigation
          prevLabel={tActions.back}
          finishLabel={t.review.publishCourse}
          onFinish={handlePublish}
          prevButton={
            <Button variant="outline" onClick={handleBack}>
              {tActions.back}
            </Button>
          }
          nextButton={
            <Button onClick={handlePublish} disabled={isPublishing}>
              {isPublishing && <Loader2 className="mr-2 size-4 animate-spin" />}
              {t.review.publishCourse}
            </Button>
          }
        />
      </StepsContent>
    </Steps>
  )
}
