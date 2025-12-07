"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"

import type { VariantProps } from "class-variance-authority"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { Button } from "./button"

// ============================================================================
// Context
// ============================================================================

interface StepsContextValue {
  activeStep: number
  totalSteps: number
  orientation: "horizontal" | "vertical"
  allowJump: boolean
  variant: "default" | "outline" | "simple"
  size: "sm" | "default" | "lg"
  goToStep: (step: number) => void
  goToNextStep: () => void
  goToPrevStep: () => void
  canGoNext: boolean
  canGoPrev: boolean
}

const StepsContext = React.createContext<StepsContextValue | null>(null)

function useStepsContext() {
  const context = React.useContext(StepsContext)
  if (!context) {
    throw new Error("Steps components must be used within a Steps provider")
  }
  return context
}

// ============================================================================
// Steps Root
// ============================================================================

export const stepsVariants = cva("flex w-full", {
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "flex-row gap-6",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepsProps
  extends
    Omit<ComponentProps<"div">, "onChange">,
    VariantProps<typeof stepsVariants> {
  /** Current active step (0-indexed) */
  activeStep?: number
  /** Callback when active step changes */
  onStepChange?: (step: number) => void
  /** Total number of steps */
  totalSteps: number
  /** Allow clicking steps to jump between them */
  allowJump?: boolean
  /** Enable/disable going to next step */
  canGoNext?: boolean
  /** Enable/disable going to previous step */
  canGoPrev?: boolean
  /** Visual variant */
  variant?: "default" | "outline" | "simple"
  /** Size variant */
  size?: "sm" | "default" | "lg"
}

export function Steps({
  activeStep: controlledActiveStep,
  onStepChange,
  totalSteps,
  orientation = "horizontal",
  allowJump = false,
  canGoNext: canGoNextProp = true,
  canGoPrev: canGoPrevProp = true,
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: StepsProps) {
  const [internalActiveStep, setInternalActiveStep] = React.useState(0)

  const activeStep = controlledActiveStep ?? internalActiveStep
  const setActiveStep = onStepChange ?? setInternalActiveStep

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setActiveStep(step)
      }
    },
    [totalSteps, setActiveStep]
  )

  const goToNextStep = React.useCallback(() => {
    if (activeStep < totalSteps - 1) {
      setActiveStep(activeStep + 1)
    }
  }, [activeStep, totalSteps, setActiveStep])

  const goToPrevStep = React.useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }, [activeStep, setActiveStep])

  const canGoNext = canGoNextProp && activeStep < totalSteps - 1
  const canGoPrev = canGoPrevProp && activeStep > 0

  const contextValue = React.useMemo(
    () => ({
      activeStep,
      totalSteps,
      orientation: orientation ?? "horizontal",
      allowJump,
      variant: variant ?? "default",
      size: size ?? "default",
      goToStep,
      goToNextStep,
      goToPrevStep,
      canGoNext,
      canGoPrev,
    }),
    [
      activeStep,
      totalSteps,
      orientation,
      allowJump,
      variant,
      size,
      goToStep,
      goToNextStep,
      goToPrevStep,
      canGoNext,
      canGoPrev,
    ]
  )

  return (
    <StepsContext.Provider value={contextValue}>
      <div
        data-slot="steps"
        className={cn(stepsVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    </StepsContext.Provider>
  )
}

// ============================================================================
// Steps List
// ============================================================================

export const stepsListVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-center justify-between w-full",
      vertical: "flex-col items-start gap-2 shrink-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepsListProps extends ComponentProps<"div"> {}

export function StepsList({ className, children, ...props }: StepsListProps) {
  const { orientation } = useStepsContext()

  return (
    <div
      data-slot="steps-list"
      role="tablist"
      aria-orientation={orientation}
      className={cn(stepsListVariants({ orientation }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Steps Item
// ============================================================================

export const stepsItemIndicatorVariants = cva(
  "flex items-center justify-center rounded-full font-medium transition-colors shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        simple: "bg-transparent",
      },
      size: {
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        lg: "size-12 text-base",
      },
      status: {
        completed: "",
        current: "",
        upcoming: "",
      },
    },
    compoundVariants: [
      // Default variant
      {
        variant: "default",
        status: "completed",
        className: "bg-primary text-primary-foreground",
      },
      {
        variant: "default",
        status: "current",
        className: "bg-primary text-primary-foreground ring-4 ring-primary/20",
      },
      {
        variant: "default",
        status: "upcoming",
        className: "bg-muted text-muted-foreground",
      },
      // Outline variant
      {
        variant: "outline",
        status: "completed",
        className: "border-primary bg-primary text-primary-foreground",
      },
      {
        variant: "outline",
        status: "current",
        className: "border-primary text-primary bg-background",
      },
      {
        variant: "outline",
        status: "upcoming",
        className:
          "border-muted-foreground/30 text-muted-foreground bg-background",
      },
      // Simple variant
      {
        variant: "simple",
        status: "completed",
        className: "text-primary",
      },
      {
        variant: "simple",
        status: "current",
        className: "text-primary font-bold",
      },
      {
        variant: "simple",
        status: "upcoming",
        className: "text-muted-foreground",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "upcoming",
    },
  }
)

interface StepsItemProps extends ComponentProps<"div"> {
  /** Step index (0-indexed) */
  step: number
  /** Custom icon to display instead of number */
  icon?: ReactNode
  /** Label text for the step */
  label?: string
  /** Optional description text */
  description?: string
  /** Show checkmark when completed */
  showCheckOnComplete?: boolean
}

export function StepsItem({
  step,
  icon,
  label,
  description,
  showCheckOnComplete = true,
  className,
  ...props
}: StepsItemProps) {
  const { activeStep, allowJump, goToStep, variant, size, orientation } =
    useStepsContext()

  const status: "completed" | "current" | "upcoming" =
    step < activeStep
      ? "completed"
      : step === activeStep
        ? "current"
        : "upcoming"

  const isClickable = allowJump && status !== "current"

  const handleClick = () => {
    if (isClickable) {
      goToStep(step)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      goToStep(step)
    }
  }

  const showCheck = showCheckOnComplete && status === "completed" && !icon

  return (
    <div
      data-slot="steps-item"
      data-status={status}
      role="tab"
      aria-selected={status === "current"}
      tabIndex={isClickable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex gap-3",
        orientation === "horizontal"
          ? "flex-col items-center"
          : "flex-row items-start",
        isClickable && "cursor-pointer",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          stepsItemIndicatorVariants({ variant, size, status }),
          isClickable && "hover:opacity-80"
        )}
      >
        {showCheck ? (
          <Check
            className={cn(
              size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5"
            )}
          />
        ) : icon ? (
          icon
        ) : (
          step + 1
        )}
      </div>
      {(label || description) && (
        <div
          className={cn(
            "flex flex-col",
            orientation === "horizontal"
              ? "items-center text-center"
              : "items-start text-start"
          )}
        >
          {label && (
            <span
              className={cn(
                "font-medium",
                size === "sm"
                  ? "text-xs"
                  : size === "lg"
                    ? "text-base"
                    : "text-sm",
                status === "current"
                  ? "text-foreground"
                  : status === "completed"
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={cn(
                "text-muted-foreground",
                size === "sm" ? "text-xs" : "text-sm"
              )}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Steps Connector
// ============================================================================

export const stepsConnectorVariants = cva("transition-colors", {
  variants: {
    orientation: {
      horizontal: "h-0.5 flex-1 mx-2",
      vertical: "w-0.5 min-h-8 ms-5 my-1",
    },
    status: {
      completed: "bg-primary",
      upcoming: "bg-muted-foreground/30",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    status: "upcoming",
  },
})

interface StepsConnectorProps extends ComponentProps<"div"> {
  /** The step index this connector follows (0-indexed) */
  afterStep: number
}

export function StepsConnector({
  afterStep,
  className,
  ...props
}: StepsConnectorProps) {
  const { activeStep, orientation } = useStepsContext()

  const status: "completed" | "upcoming" =
    afterStep < activeStep ? "completed" : "upcoming"

  return (
    <div
      data-slot="steps-connector"
      data-status={status}
      className={cn(stepsConnectorVariants({ orientation, status }), className)}
      {...props}
    />
  )
}

// ============================================================================
// Steps Content
// ============================================================================

interface StepsContentProps extends ComponentProps<"div"> {
  /** The step index this content belongs to (0-indexed) */
  step: number
  /** Force show content regardless of active step */
  forceMount?: boolean
}

export function StepsContent({
  step,
  forceMount = false,
  className,
  children,
  ...props
}: StepsContentProps) {
  const { activeStep, orientation } = useStepsContext()

  const isActive = step === activeStep

  if (!forceMount && !isActive) {
    return null
  }

  return (
    <div
      data-slot="steps-content"
      data-step={step}
      role="tabpanel"
      hidden={!isActive}
      className={cn(
        "w-full",
        orientation === "horizontal" ? "mt-6" : "",
        !isActive && "hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Steps Navigation
// ============================================================================

interface StepsNavigationProps extends ComponentProps<"div"> {
  /** Custom previous button label */
  prevLabel?: string
  /** Custom next button label */
  nextLabel?: string
  /** Custom finish button label (shown on last step) */
  finishLabel?: string
  /** Callback when finish button is clicked */
  onFinish?: () => void
  /** Hide previous button */
  hidePrev?: boolean
  /** Hide next button */
  hideNext?: boolean
  /** Custom previous button */
  prevButton?: ReactNode
  /** Custom next button */
  nextButton?: ReactNode
}

export function StepsNavigation({
  prevLabel = "Previous",
  nextLabel = "Next",
  finishLabel = "Finish",
  onFinish,
  hidePrev = false,
  hideNext = false,
  prevButton,
  nextButton,
  className,
  ...props
}: StepsNavigationProps) {
  const {
    activeStep,
    totalSteps,
    goToNextStep,
    goToPrevStep,
    canGoNext,
    canGoPrev,
  } = useStepsContext()

  const isLastStep = activeStep === totalSteps - 1

  const handleNextOrFinish = () => {
    if (isLastStep && onFinish) {
      onFinish()
    } else {
      goToNextStep()
    }
  }

  return (
    <div
      data-slot="steps-navigation"
      className={cn("flex items-center justify-between gap-4 mt-6", className)}
      {...props}
    >
      <div>
        {!hidePrev &&
          (prevButton ? (
            <div onClick={canGoPrev ? goToPrevStep : undefined}>
              {prevButton}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevStep}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="size-4 me-1" />
              {prevLabel}
            </Button>
          ))}
      </div>
      <div>
        {!hideNext &&
          (nextButton ? (
            <div
              onClick={canGoNext || isLastStep ? handleNextOrFinish : undefined}
            >
              {nextButton}
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleNextOrFinish}
              disabled={!canGoNext && !isLastStep}
            >
              {isLastStep ? finishLabel : nextLabel}
              {!isLastStep && <ChevronRight className="size-4 ms-1" />}
            </Button>
          ))}
      </div>
    </div>
  )
}

// ============================================================================
// Utility Hook
// ============================================================================

export { useStepsContext }
