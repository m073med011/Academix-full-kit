"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { CourseFormData } from "../types"
import { WIZARD_STEPS, initialCourseFormData } from "../types"

import { ensureLocalizedPathname } from "@/lib/i18n"

import { BasicInfoStep } from "./steps/basic-info-step"
import { CurriculumStep } from "./steps/curriculum-step"
import { MediaStep } from "./steps/media-step"
import { PricingStep } from "./steps/pricing-step"
import { ReviewStep } from "./steps/review-step"
import { WizardStepper } from "./wizard-stepper"

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

  const t = dictionary.profilePage.createCourse

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

  const handleCancel = () => {
    router.push(
      ensureLocalizedPathname("/pages/account/profile?tab=created", locale)
    )
  }

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    console.log("Saving draft:", formData)
  }

  const handlePublish = () => {
    // TODO: Implement publish functionality
    console.log("Publishing course:", formData)
  }

  const renderStep = () => {
    switch (currentStep) {
      case WIZARD_STEPS.BASIC_INFO:
        return (
          <BasicInfoStep
            dictionary={dictionary}
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onCancel={handleCancel}
            onSaveDraft={handleSaveDraft}
          />
        )
      case WIZARD_STEPS.CURRICULUM:
        return (
          <CurriculumStep
            dictionary={dictionary}
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        )
      case WIZARD_STEPS.PRICING:
        return (
          <PricingStep
            dictionary={dictionary}
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WIZARD_STEPS.MEDIA:
        return (
          <MediaStep
            dictionary={dictionary}
            formData={formData}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WIZARD_STEPS.REVIEW:
        return (
          <ReviewStep
            dictionary={dictionary}
            formData={formData}
            onBack={handleBack}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
            onEditStep={goToStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <WizardStepper
        currentStep={currentStep}
        onStepClick={goToStep}
        dictionary={dictionary}
      />
      {renderStep()}
    </div>
  )
}
