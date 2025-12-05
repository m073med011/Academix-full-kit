"use client"

import { useRouter, useSearchParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"

import { CardWithUnderlineTabs } from "@/app/[lang]/(dashboard-layout)/(design-system)/cards/basic/_components/card-with-underline-tabs"
import { Activity } from "./tabs/activity"
import { CreatedCourses } from "./tabs/created-courses"
import { PersonalInformation } from "./tabs/personal-information"
import { PurchasedCourses } from "./tabs/purchased-courses"

interface ProfileTabsProps {
  dictionary: DictionaryType
}

export function ProfileTabs({ dictionary }: ProfileTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "created"
  const t = dictionary.profilePage.tabs

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("tab", value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const tabs = [
    {
      value: "created",
      label: t.createdCourses,
      content: <CreatedCourses dictionary={dictionary} />,
    },
    {
      value: "purchased",
      label: t.purchasedCourses,
      content: <PurchasedCourses dictionary={dictionary} />,
    },
    {
      value: "personal",
      label: t.personalInformation,
      content: <PersonalInformation dictionary={dictionary} />,
    },
    {
      value: "activity",
      label: t.activity,
      content: <Activity dictionary={dictionary} />,
    },
  ]

  return (
    <section className="py-2">
      <CardWithUnderlineTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      />
    </section>
  )
}
