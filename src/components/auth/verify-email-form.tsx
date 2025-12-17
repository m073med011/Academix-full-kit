"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { VerifyEmailFormType } from "@/types"

import { VerifyEmailSchema } from "@/schemas/verify-email-schema"

import { toast } from "@/hooks/use-toast"
import { Button, ButtonLoading } from "@/components/ui/button"
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

interface VerifyEmailFormProps {
  email?: string
  onSuccess?: () => void
  dictionary: DictionaryType
}

export function VerifyEmailForm({
  email: propEmail,
  onSuccess,
  dictionary,
}: VerifyEmailFormProps) {
  const searchParams = useSearchParams()

  const emailParam = propEmail || searchParams.get("email") || ""
  const redirectPathname =
    process.env.NEXT_PUBLIC_HOME_PATHNAME ||
    // searchParams.get("redirectTo") ||
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

  // Update form email if propEmail changes
  useEffect(() => {
    if (propEmail) {
      form.setValue("email", propEmail)
    }
  }, [propEmail, form])

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
    if (isSubmitting) return

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
        // If the error is "Invalid or expired OTP" but we just verified successfully (race condition),
        // or if the user is already verified, we should proceed.
        // However, since we can't easily distinguish a "just verified" race condition from a genuine invalid OTP
        // without more complex state, we rely on the first success.
        // If this is a retry and the OTP is now gone, it's a genuine error unless we handle it.
        throw new Error(result.message || "Verification failed")
      }

      // Store tokens
      if (result.accessToken && result.refreshToken) {
        // Tokens are handled by NextAuth session update below

        // Update NextAuth session by re-signing in with the new tokens
        console.log("Re-authenticating with new tokens...", {
          accessToken: result.accessToken ? "Present" : "Missing",
          refreshToken: result.refreshToken ? "Present" : "Missing",
        })
        const signInResult = await signIn("credentials", {
          token: result.accessToken,
          refreshToken: result.refreshToken,
          redirect: false,
        })

        if (signInResult?.error) {
          console.error("Re-authentication failed:", signInResult.error)
          throw new Error("Failed to refresh session")
        }
        console.log("Re-authentication successful")
      }

      toast({
        title: dictionary.auth.verifyEmail.emailVerified,
        description:
          result.message || dictionary.auth.verifyEmail.verificationSuccess,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        // Redirect to the intended destination or home
        // Force a hard navigation to ensure middleware sees the new session
        window.location.href = redirectPathname
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary.auth.verifyEmail.verificationFailed,
        description:
          error instanceof Error
            ? error.message
            : dictionary.auth.verifyEmail.invalidCode,
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
        title: dictionary.auth.verifyEmail.codeResent,
        description: dictionary.auth.verifyEmail.codeResentMessage,
      })

      // Start 60 second countdown
      setCountdown(60)
      form.setValue("code", "")
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary.auth.verifyEmail.resendFailed,
        description:
          error instanceof Error
            ? error.message
            : dictionary.auth.verifyEmail.resendError,
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
                <FormLabel>{dictionary.auth.verifyEmail.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={dictionary.auth.verifyEmail.emailPlaceholder}
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
                <FormLabel>
                  {dictionary.auth.verifyEmail.verificationCode}
                </FormLabel>
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
                  {dictionary.auth.verifyEmail.codeDescription}
                </p>
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          {dictionary.auth.verifyEmail.button}
        </ButtonLoading>

        <div className="text-center text-sm">
          {dictionary.auth.verifyEmail.didntReceive}{" "}
          <Button
            type="button"
            variant="link"
            onClick={handleResendCode}
            disabled={countdown > 0 || isResending}
            className="underline disabled:opacity-50 disabled:cursor-not-allowed p-0 h-auto font-normal"
          >
            {countdown > 0
              ? dictionary.auth.verifyEmail.resendIn.replace(
                  "{seconds}",
                  countdown.toString()
                )
              : isResending
                ? dictionary.auth.verifyEmail.sending
                : dictionary.auth.verifyEmail.resend}
          </Button>
        </div>
      </form>
    </Form>
  )
}
