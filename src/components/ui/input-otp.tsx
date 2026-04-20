"use client"

import { forwardRef, useContext } from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import type { ComponentProps, ElementRef } from "react"

import { cn } from "@/lib/utils"

type InputOTPProps = ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}

const ARABIC_INDIC_ZERO_CODE = 0x0660
const EXTENDED_ARABIC_INDIC_ZERO_CODE = 0x06f0

export const OTP_DIGIT_PATTERN = "^[0-9\\u0660-\\u0669\\u06F0-\\u06F9]+$"

export function normalizeOtpValue(value: string) {
  return value
    .replace(/[\u0660-\u0669]/g, (char) =>
      String(char.charCodeAt(0) - ARABIC_INDIC_ZERO_CODE)
    )
    .replace(/[\u06F0-\u06F9]/g, (char) =>
      String(char.charCodeAt(0) - EXTENDED_ARABIC_INDIC_ZERO_CODE)
    )
}

export const InputOTP = forwardRef<ElementRef<typeof OTPInput>, InputOTPProps>(
  function InputOTP(
    {
      className,
      containerClassName,
      defaultValue,
      onChange,
      pasteTransformer,
      value,
      ...props
    },
    ref
  ) {
    return (
      <OTPInput
        ref={ref}
        data-slot="input-otp"
        containerClassName={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          containerClassName
        )}
        className={cn("disabled:cursor-not-allowed", className)}
        defaultValue={
          typeof defaultValue === "string"
            ? normalizeOtpValue(defaultValue)
            : defaultValue
        }
        value={typeof value === "string" ? normalizeOtpValue(value) : value}
        onChange={(nextValue) => onChange?.(normalizeOtpValue(nextValue))}
        pasteTransformer={(pastedValue) =>
          normalizeOtpValue(
            pasteTransformer ? pasteTransformer(pastedValue) : pastedValue
          )
        }
        {...props}
      />
    )
  }
)

export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

type InputOTPSlotProps = ComponentProps<"div"> & {
  index: number
}

export function InputOTPSlot({
  index,
  className,
  ...props
}: InputOTPSlotProps) {
  const inputOTPContext = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      data-slot="input-otp-slot"
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-e border-input text-sm transition-all first:rounded-s-md first:border-s last:rounded-e-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

export function InputOTPSeparator({ ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <Minus />
    </div>
  )
}
