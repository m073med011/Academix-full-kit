"use client"

import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getSession, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import type { UserRole } from "@/types/api"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType, SignInFormType } from "@/types"

import { SignInSchema } from "@/schemas/sign-in-schema"

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
import { SeparatorWithText } from "@/components/ui/separator"
import { OAuthLinks } from "./oauth-links"

// Roles the backend can legitimately return – defined outside the component
// so the reference is stable across renders.
const VALID_ROLES: ReadonlyArray<UserRole | "anonymous"> = [
  "student",
  "instructor",
  "freelancer",
  "organizer",
  "admin",
  "user",
  "guest",
  "anonymous", // reserved: dedicated page to be added later
]

// Fallback role when the backend doesn't return one
const DEFAULT_ROLE = "anonymous" as const

export function SignInForm({ dictionary }: { dictionary: DictionaryType }) {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectPathname =
    searchParams.get("redirectTo") ||
    process.env.NEXT_PUBLIC_HOME_PATHNAME ||
    "/"

  const form = useForm<SignInFormType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const locale = params.lang as LocaleType
  const { isSubmitting } = form.formState
  const isDisabled = isSubmitting

  async function onSubmit(data: SignInFormType) {
    const { email, password } = data

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result && result.error) {
        // Check for email verification required error
        if (result.error.startsWith("EMAIL_VERIFICATION_REQUIRED:")) {
          const userEmail = result.error.split(":")[1]
          toast({
            title: dictionary.auth.signIn.emailVerificationRequired,
            description: dictionary.auth.signIn.verifyEmailMessage,
          })
          router.push(
            ensureLocalizedPathname(
              `/verify-email?email=${encodeURIComponent(userEmail)}${
                redirectPathname
                  ? `&redirectTo=${encodeURIComponent(redirectPathname)}`
                  : ""
              }`,
              locale
            )
          )
          return
        }

        // Check for 2FA required error
        if (result.error.startsWith("2FA_REQUIRED:")) {
          const userEmail = result.error.split(":")[1]
          toast({
            title: dictionary.auth.signIn.twoFactorRequired,
            description: dictionary.auth.signIn.twoFactorMessage,
          })
          router.push(
            ensureLocalizedPathname(
              `/verify-2fa?email=${encodeURIComponent(userEmail)}${
                redirectPathname
                  ? `&redirectTo=${encodeURIComponent(redirectPathname)}`
                  : ""
              }`,
              locale
            )
          )
          return
        }

        // Regular error
        throw new Error(result.error)
      }

      // Successful login — read the fresh session to obtain the user's role
      const session = await getSession()
      const rawRole = session?.user?.role

      // Resolve the role:
      //  • known valid role  → use it as-is
      //  • "anonymous"       → pass through (dedicated page TBD)
      //  • missing / unknown → fall back to DEFAULT_ROLE ("student")
      const resolvedRole =
        rawRole && VALID_ROLES.includes(rawRole) ? rawRole : DEFAULT_ROLE

      // Strip any stale `role` param that may already exist in redirectPathname
      // (e.g. captured by the middleware from a previous authenticated session)
      // before appending the fresh one, to avoid duplicate ?role=…&role=… params.
      const cleanUrl = new URL(redirectPathname, "http://x")
      cleanUrl.searchParams.delete("role")
      const cleanRedirect =
        cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : "")

      // Always append ?role=<resolvedRole> so the destination page can act on it
      const sep = cleanRedirect.includes("?") ? "&" : "?"
      const finalRedirect = `${cleanRedirect}${sep}role=${resolvedRole}`

      router.push(ensureLocalizedPathname(finalRedirect, locale))
    } catch (error) {
      toast({
        variant: "destructive",
        title: dictionary.auth.signIn.signInFailed,
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grow gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.auth.signIn.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={dictionary.auth.signIn.emailPlaceholder}
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
                <div className="flex items-center">
                  <FormLabel>{dictionary.auth.signIn.password}</FormLabel>
                  <Link
                    href={ensureLocalizedPathname(
                      redirectPathname
                        ? ensureRedirectPathname(
                            "/forgot-password",
                            redirectPathname
                          )
                        : "/forgot-password",
                      locale
                    )}
                    className="ms-auto inline-block text-sm underline"
                  >
                    {dictionary.auth.signIn.forgotPassword}
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          {dictionary.auth.signIn.button}
        </ButtonLoading>
        <div className="-mt-4 text-center text-sm">
          {dictionary.auth.signIn.noAccount}{" "}
          <Link
            href={ensureLocalizedPathname(
              redirectPathname
                ? ensureRedirectPathname("/register", redirectPathname)
                : "/register",
              locale
            )}
            className="underline"
          >
            {dictionary.auth.signIn.signUp}
          </Link>
        </div>
        <SeparatorWithText>
          {dictionary.auth.signIn.orContinue}
        </SeparatorWithText>
        <OAuthLinks dictionary={dictionary} />
      </form>
    </Form>
  )
}
