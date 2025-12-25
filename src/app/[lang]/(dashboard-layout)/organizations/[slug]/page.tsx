import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import OrganizationDetailView from "./_components/organization-detail-view"

interface OrganizationPageProps {
  params: Promise<{
    lang: LocaleType
    slug: string
  }>
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return <OrganizationDetailView dictionary={dict.organizationsPage} />
}
