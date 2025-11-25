"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType, RegisterFormType } from "@/types"
import type { RegisterResponse } from "@/types/api"

import { RegisterSchema } from "@/schemas/register-schema"

import { ApiClientError, apiClient } from "@/lib/api-client"
import { ensureLocalizedPathname } from "@/lib/i18n"
import { ensureRedirectPathname } from "@/lib/utils"

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
import { PasswordInput } from "@/components/ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SeparatorWithText } from "@/components/ui/separator"
import { OAuthLinks } from "./oauth-links"
import { PasswordRequirements } from "./password-requirements"
import { VerifyEmailForm } from "./verify-email-form"

export function RegisterForm({ dictionary }: { dictionary: DictionaryType }) {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [step, setStep] = useState<"register" | "verify">("register")
  const [registeredEmail, setRegisteredEmail] = useState("")

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty

  async function onSubmit(data: RegisterFormType) {
    const { name, email, role, password } = data

    try {
      const result = await apiClient.post<RegisterResponse>(
        "/auth/register",
        {
          name,
          email,
          role,
          password,
        },
        { skipAuth: true }
      )

      // Check if email verification is required
      // Backend returns this at the top level, so we cast to the correct type
      const response = result as unknown as RegisterResponse
      if (
        "requiresEmailVerification" in response &&
        response.requiresEmailVerification
      ) {
        toast({
          title: dictionary.auth.register.registrationSuccessful,
          description:
            result.message || dictionary.auth.register.checkEmailMessage,
        })

        setRegisteredEmail(email)
        setStep("verify")
        return
      }

      // If no verification needed (shouldn't happen for credentials), go to sign-in
      toast({ title: dictionary.auth.register.registrationSuccessful })
      router.push(ensureLocalizedPathname("/sign-in", locale))
    } catch (error) {
      if (error instanceof ApiClientError) {
        // Handle validation errors
        if (error.isValidationError() && error.data) {
          const apiError = error.data as {
            issues?: { path: string[]; message: string }[]
          }
          if (apiError.issues) {
            apiError.issues.forEach((issue) => {
              const field = issue.path[0] as keyof RegisterFormType
              form.setError(field, { type: "manual", message: issue.message })
            })
            return
          }
        }

        // Handle other API errors
        toast({
          variant: "destructive",
          title: dictionary.auth.register.registrationFailed,
          description: error.message,
        })
      } else {
        // Handle unexpected errors
        toast({
          variant: "destructive",
          title: dictionary.auth.register.registrationFailed,
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred.",
        })
      }
    }
  }

  if (step === "verify") {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {dictionary.auth.register.checkEmail}
          </h1>
          <p className="text-muted-foreground text-sm">
            {dictionary.auth.register.verificationSent} {registeredEmail}
          </p>
        </div>
        <VerifyEmailForm
          email={registeredEmail}
          dictionary={dictionary}
          onSuccess={() => {
            // Redirect to home or dashboard after successful verification
            router.push(ensureLocalizedPathname("/", locale))
          }}
        />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.auth.register.fullName}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={dictionary.auth.register.fullNamePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.auth.register.role}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={dictionary.auth.register.rolePlaceholder}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">
                      {dictionary.auth.register.roles.student}
                    </SelectItem>
                    <SelectItem value="instructor">
                      {dictionary.auth.register.roles.instructor}
                    </SelectItem>
                    <SelectItem value="freelancer">
                      {dictionary.auth.register.roles.freelancer}
                    </SelectItem>
                    <SelectItem value="organizer">
                      {dictionary.auth.register.roles.organizer}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.auth.register.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={dictionary.auth.register.emailPlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.auth.register.password}</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {dictionary.auth.register.confirmPassword}
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                  />
                </FormControl>
                <FormMessage />
                <PasswordRequirements
                  password={form.watch("password")}
                  isVisible={isPasswordFocused}
                  dictionary={dictionary}
                />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          {dictionary.auth.register.button}
        </ButtonLoading>
        <div className="-mt-4 text-center text-sm">
          {dictionary.auth.register.haveAccount}{" "}
          <Link
            href={ensureLocalizedPathname(
              redirectPathname
                ? ensureRedirectPathname("/sign-in", redirectPathname)
                : "/sign-in",
              locale
            )}
            className="underline"
          >
            {dictionary.auth.register.signIn}
          </Link>
        </div>
        <SeparatorWithText>
          {dictionary.auth.register.orContinue}
        </SeparatorWithText>
        <OAuthLinks dictionary={dictionary} />
      </form>
    </Form>
  )
}
