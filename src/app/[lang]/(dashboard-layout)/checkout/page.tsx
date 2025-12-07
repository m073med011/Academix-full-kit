import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import { CheckoutClient } from "./checkout-client"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return <CheckoutClient dictionary={dictionary} locale={lang} />
}
