"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { LocaleType, RegisterFormType } from "@/types"

import { RegisterSchema } from "@/schemas/register-schema"

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

export function RegisterForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  })

  const locale = params.lang as LocaleType
  const redirectPathname = searchParams.get("redirectTo")
  const { isSubmitting, isDirty } = form.formState
  const isDisabled = isSubmitting || !isDirty

  async function onSubmit(data: RegisterFormType) {
    const { firstName, lastName, email, password, role } = data

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      })

      const result = await res.json()

      if (res.status >= 400) {
        const { issues, message } = result as {
          issues?: { path: (keyof RegisterFormType)[]; message: string }[]
          message?: string
        }

        if (issues) {
          issues.forEach((issue) => {
            const field = issue.path[0]
            form.setError(field, { type: "manual", message: issue.message })
          })
          return
        }

        throw new Error(message ?? "An unknown error occurred.")
      }

      // Check if email verification is required
      if (result.requiresEmailVerification) {
        toast({
          title: "Registration Successful",
          description:
            result.message || "Please check your email to verify your account.",
        })

        // Redirect to verify-email page with email as query param
        router.push(
          ensureLocalizedPathname(
            `/verify-email?email=${encodeURIComponent(email)}${
              redirectPathname
                ? `&redirectTo=${encodeURIComponent(redirectPathname)}`
                : ""
            }`,
            locale
          )
        )
        return
      }

      // If no verification needed (shouldn't happen for credentials), go to sign-in
      toast({ title: "Registration Successful" })
      router.push(
        ensureLocalizedPathname(
          redirectPathname
            ? ensureRedirectPathname("/sign-in", redirectPathname)
            : "/sign-in",
          locale
        )
      )
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Confirm Password</FormLabel>
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
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="freelancer">Freelancer</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="organizer">Organizer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <ButtonLoading isLoading={isSubmitting} disabled={isDisabled}>
          Create Account
        </ButtonLoading>
        <div className="-mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href={ensureLocalizedPathname(
              redirectPathname
                ? ensureRedirectPathname("/sign-in", redirectPathname)
                : "/sign-in",
              locale
            )}
            className="underline"
          >
            Sign in
          </Link>
        </div>
        <SeparatorWithText>Or continue with</SeparatorWithText>
        <OAuthLinks selectedRole={form.watch("role")} />
      </form>
    </Form>
  )
}
