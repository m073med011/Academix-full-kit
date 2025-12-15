import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { CardList } from "./_components/card-list"
import { HorizontalList } from "./_components/horizontal-list"
import { VerticalList } from "./_components/vertical-list"

export const metadata: Metadata = {
  title: "Sortable List",
}

export default async function SortableListPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)
  const t = dictionary.sortableListDemo

  return (
    <section className="container grid gap-4 p-4 md:grid-cols-2">
      <VerticalList dictionary={t} />
      <HorizontalList dictionary={t} />
      <div className="md:col-span-2">
        <CardList dictionary={t} />
      </div>
    </section>
  )
}
