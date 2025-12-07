import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { getDictionary } from "@/lib/get-dictionary"

import { ProfileHeader } from "./_components/profile-header"
import { ProfileTabs } from "./_components/profile-tabs"

// Define metadata for the page
// More info: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
export const metadata: Metadata = {
  title: "Profile",
}

export default async function ProfilePage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  return (
    <div className="container px-0">
      <ProfileHeader locale={params.lang} dictionary={dictionary} />
      <ProfileTabs dictionary={dictionary} locale={params.lang} />
    </div>
  )
}
