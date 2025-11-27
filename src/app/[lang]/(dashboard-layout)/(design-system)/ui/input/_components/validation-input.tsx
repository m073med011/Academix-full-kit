"use client"

import * as React from "react"
import { CheckCircle, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ValidationRules {
  length?: number
  capitalLetters?: "all" | "some" | "none"
  hasNumbers?: boolean
  include?: string[]
  englishOnly?: boolean
  arabicOnly?: boolean
}

interface ValidationInputProps extends React.ComponentProps<"input"> {
  validationState?: "success" | "error" | "none"
  validationMessage?: string
  label?: string
  validations?: ValidationRules
}

export function ValidationInput({
  className,
  validationState = "none",
  validationMessage,
  label,
  id,
  validations,
  ...props
}: ValidationInputProps) {
  const [internalState, setInternalState] = React.useState<
    "success" | "error" | "none"
  >("none")
  const [internalMessage, setInternalMessage] = React.useState<string>("")

  const validateValue = (value: string) => {
    if (!validations || !value) {
      setInternalState("none")
      setInternalMessage("")
      return
    }

    // Length validation
    if (validations.length && value.length !== validations.length) {
      setInternalState("error")
      setInternalMessage(`Must be exactly ${validations.length} characters`)
      return
    }

    // Capital letters validation
    if (validations.capitalLetters === "all") {
      if (value !== value.toUpperCase() || !/[A-Z]/.test(value)) {
        setInternalState("error")
        setInternalMessage("All letters must be capitals")
        return
      }
    }

    // Numbers validation
    if (validations.hasNumbers && !/\d/.test(value)) {
      setInternalState("error")
      setInternalMessage("Must contain numbers")
      return
    }

    // Include validation
    if (validations.include && validations.include.length > 0) {
      for (const str of validations.include) {
        if (!value.includes(str)) {
          setInternalState("error")
          setInternalMessage(`Must contain "${str}"`)
          return
        }
      }
    }

    // English only validation
    if (
      validations.englishOnly &&
      !/^[A-Za-z0-9\s@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value)
    ) {
      setInternalState("error")
      setInternalMessage("Must contain English characters only")
      return
    }

    // Arabic only validation
    if (
      validations.arabicOnly &&
      !/^[\u0600-\u06FF\s0-9@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value)
    ) {
      setInternalState("error")
      setInternalMessage("Must contain Arabic characters only")
      return
    }

    // All validations passed
    setInternalState("success")
    setInternalMessage("Valid input")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    validateValue(value)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  const finalState =
    validationState !== "none" ? validationState : internalState
  const finalMessage =
    validationMessage || (internalState !== "none" ? internalMessage : "")

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          className={cn(
            "pr-10 transition-colors",
            finalState === "success" &&
              "border-success focus-visible:border-success focus-visible:ring-success/20",
            finalState === "error" &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
            className
          )}
          {...props}
          onChange={handleChange}
        />
        {finalState === "success" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
        )}
        {finalState === "error" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <CircleAlert className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>
      {finalMessage && (
        <p
          className={cn(
            "text-[0.8rem] font-medium",
            finalState === "success" && "text-success",
            finalState === "error" && "text-destructive"
          )}
        >
          {finalMessage}
        </p>
      )}
    </div>
  )
}
