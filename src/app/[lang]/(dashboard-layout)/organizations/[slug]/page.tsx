import type { LocaleType } from "@/types"

import { getDictionary } from "@/lib/get-dictionary"

import OrganizationDetailView from "./_components/organization-detail-view"

import { organizationService } from "../_services/organization.service"

interface OrganizationPageProps {
  params: Promise<{
    lang: LocaleType
    slug: string
  }>
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { lang, slug } = await params
  const dict = await getDictionary(lang)
  
  const { data: organization } = await organizationService.getOrganizationById(slug)

  return <OrganizationDetailView dictionary={dict.organizationsPage} organization={organization} />
}
