import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import { PaymentCallbackClient } from "./payment-callback-client"

export default async function PaymentCallbackPage({
  params,
}: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return <PaymentCallbackClient dictionary={dictionary} locale={lang} />
}
