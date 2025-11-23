import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { VerifyEmailForm } from "./verify-email-form"

export function VerifyEmail({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>Verify Your Email</AuthTitle>
        <AuthDescription>
          Enter the 6-digit code sent to your email address to verify your
          account.
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <VerifyEmailForm />
      </AuthForm>
    </Auth>
  )
}
