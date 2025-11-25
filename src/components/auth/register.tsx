import type { DictionaryType } from "@/lib/get-dictionary"

import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { RegisterForm } from "./register-form"

export function Register({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <Auth
      imgSrc="/images/illustrations/misc/welcome.svg"
      dictionary={dictionary}
    >
      <AuthHeader>
        <AuthTitle>{dictionary.auth.register.title}</AuthTitle>
        <AuthDescription>
          {dictionary.auth.register.description}
        </AuthDescription>
      </AuthHeader>
      <AuthForm>
        <RegisterForm dictionary={dictionary} />
      </AuthForm>
    </Auth>
  )
}
