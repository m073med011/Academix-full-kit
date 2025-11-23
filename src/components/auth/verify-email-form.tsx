"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { VerifyEmailFormType } from "@/types"

import { VerifyEmailSchema } from "@/schemas/verify-email-schema"

import { tokenStorage } from "@/lib/api-client"

import { toast } from "@/hooks/use-toast"
import { ButtonLoading } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const emailParam = searchParams.get("email") || ""
  const redirectPathname =
    searchParams.get("redirectTo") ||
    process.env.NEXT_PUBLIC_HOME_PATHNAME ||
    "/"

  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const form = useForm<VerifyEmailFormType>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: emailParam,
      code: "",
    },
  })

  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting

  //Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  async function onSubmit(data: VerifyEmailFormType) {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Verification failed")
      }

      // Store tokens
      if (result.accessToken && result.refreshToken) {
        tokenStorage.setTokens(result.accessToken, result.refreshToken)
      }

      toast({
        title: "Email Verified!",
        description:
          result.message || "Your email has been verified successfully.",
      })

      // Redirect to the intended destination or home
      router.push(redirectPathname)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description:
          error instanceof Error ? error.message : "Invalid or expired code",
      })
    }
  }

  async function handleResendCode() {
    if (countdown > 0 || !emailParam) return

    setIsResending(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailParam,
          purpose: "EMAIL_VERIFICATION",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to resend code")
      }

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      })

      // Start 60 second countdown
      setCountdown(60)
      form.setValue("code", "")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description:
          error instanceof Error ? error.message : "Could not resend code",
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
                <p className="text-muted-foreground text-xs">
                  Enter the 6-digit code sent to your email
                </p>
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Verify Email
        </ButtonLoading>

        <div className="text-center text-sm">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={countdown > 0 || isResending}
            className="underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : isResending
                ? "Sending..."
                : "Resend"}
          </button>
        </div>
      </form>
    </Form>
  )
}
