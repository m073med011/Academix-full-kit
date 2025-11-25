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
        <AuthTitle>{dictionary.auth.verifyEmail.title}</AuthTitle>
        <AuthDescription>
          {dictionary.auth.verifyEmail.codeDescription}
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <VerifyEmailForm dictionary={dictionary} />
      </AuthForm>
    </Auth>
  )
}
