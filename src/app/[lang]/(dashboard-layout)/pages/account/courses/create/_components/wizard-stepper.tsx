"use client"

import type { DictionaryType } from "@/lib/get-dictionary"

import { cn } from "@/lib/utils"

interface WizardStepperProps {
  currentStep: number
  onStepClick: (step: number) => void
  dictionary: DictionaryType
}

export function WizardStepper({
  currentStep,
  onStepClick,
  dictionary,
}: WizardStepperProps) {
  const t = dictionary.profilePage.createCourse.steps

  const steps = [
    { id: 1, label: t.basicInfo },
    { id: 2, label: t.curriculum },
    { id: 3, label: t.pricing },
    { id: 4, label: t.media },
    { id: 5, label: t.review },
  ]

  return (
    <nav aria-label="Progress" className="flex justify-center">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-medium">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => onStepClick(step.id)}
              className={cn(
                "transition-colors hover:text-primary",
                currentStep === step.id
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </button>
            {index < steps.length - 1 && (
              <span className="text-muted-foreground/50">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
