import { getServerSession } from "next-auth"

import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { authOptions } from "@/configs/next-auth"
import { getDictionary } from "@/lib/get-dictionary"

import { DictionarySyncProvider } from "@/providers/dictionary-sync-provider"
import { Layout } from "@/components/layout"

export default async function DashboardLayout(props: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const params = await props.params

  const { children } = props

  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  const dictionary = await getDictionary(params.lang as LocaleType)

  return (
    <DictionarySyncProvider dictionary={dictionary}>
      <Layout dictionary={dictionary}>{children}</Layout>
    </DictionarySyncProvider>
  )
}
