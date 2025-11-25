import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import { StoreView } from "./store-view"

export default async function StorePage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return <StoreView dictionary={dictionary} />
}
