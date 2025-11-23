import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { Verify2FAForm } from "./verify-2fa-form"

export function Verify2FA({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth dictionary={dictionary}>
      <AuthHeader>
        <AuthTitle>Two-Factor Authentication</AuthTitle>
        <AuthDescription>
          Enter the 6-digit code sent to your email address to complete sign in.
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <Verify2FAForm />
      </AuthForm>
    </Auth>
  )
}
