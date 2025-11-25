import { getServerSession } from "next-auth"

import type { LocaleType } from "@/types"
import type { ReactNode } from "react"

import { authOptions } from "@/configs/next-auth"
import { getDictionary } from "@/lib/get-dictionary"

import { Layout } from "@/components/layout"

export default async function DashboardLayout(props: {
  children: ReactNode
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params

  const { children } = props

  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  const dictionary = await getDictionary(params.lang)

  return <Layout dictionary={dictionary}>{children}</Layout>
}
