"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { ShieldCheck } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType, SignInFormType } from "@/types"

import { SignInSchema } from "@/schemas/sign-in-schema"

import { ensureLocalizedPathname } from "@/lib/i18n"

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

const LMS_BACKEND_URL =
  process.env.NEXT_PUBLIC_LMS_BACKEND_URL || "http://localhost:5000/api"

export function ReactivateAccountForm({
  dictionary,
}: {
  dictionary: DictionaryType
}) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const locale = params.lang as LocaleType
  const prefillEmail = searchParams.get("email") || ""

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: prefillEmail,
      password: "",
    },
  })

  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting

  async function onSubmit(data: SignInFormType) {
    const { email, password } = data

    try {
      // Call the reactivate endpoint directly
      const response = await fetch("/api/auth/reactivate-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to reactivate account"
        )
      }

      toast({
        title: dictionary.auth.reactivateAccount.successTitle,
        description:
          dictionary.auth.reactivateAccount.successDescription,
      })

      // Now sign in with the returned tokens
      const signInResult = await signIn("credentials", {
        redirect: false,
        token: result.token,
        refreshToken: result.refreshToken,
      })

      if (signInResult?.error) {
        // If token login fails, redirect to sign-in page
        router.push(ensureLocalizedPathname("/sign-in", locale))
        return
      }

      // Redirect to dashboard
      const redirectPath =
        process.env.NEXT_PUBLIC_HOME_PATHNAME || "/"
      router.push(ensureLocalizedPathname(redirectPath, locale))
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary.auth.reactivateAccount.failedTitle,
        description:
          error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* Info banner */}
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <ShieldCheck className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            {dictionary.auth.reactivateAccount.description}
          </p>
        </div>

        <div className="grid grow gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {dictionary.auth.reactivateAccount.email}
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={
                      dictionary.auth.reactivateAccount.emailPlaceholder
                    }
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
                <FormLabel>
                  {dictionary.auth.reactivateAccount.password}
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          {isSubmitting
            ? dictionary.auth.reactivateAccount.reactivating
            : dictionary.auth.reactivateAccount.button}
        </ButtonLoading>

        <div className="text-center text-sm">
          <Link
            href={ensureLocalizedPathname("/sign-in", locale)}
            className="underline"
          >
            {dictionary.auth.reactivateAccount.backToSignIn}
          </Link>
        </div>
      </form>
    </Form>
  )
}
