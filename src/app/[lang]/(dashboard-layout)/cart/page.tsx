import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import { CartClient } from "./_components/cart-client"

export default async function CartPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return <CartClient dictionary={dictionary} />
}
